from __future__ import annotations

import os

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .company_lookup import CompanyLookupError, lookup_company
from .deal_engine import calculate_request
from .memo_generator import generate_memo
from .models import (
    CompanyLookupResponse,
    DealCalculationResult,
    DealRequest,
    HealthResponse,
    MemoRequest,
    MemoResponse,
    SensitivityRequest,
    SensitivityResponse,
)
from .sensitivity import run_sensitivity

app = FastAPI(
    title="DealIQ API",
    description="M&A accretion/dilution modeling and deal intelligence API.",
    version="1.0.0",
)

origins = os.getenv(
    "CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_, exc: RequestValidationError) -> JSONResponse:
    errors = [
        {
            "field": ".".join(str(part) for part in error["loc"] if part != "body"),
            "message": error["msg"].removeprefix("Value error, "),
            "type": error["type"],
        }
        for error in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "validation_error",
                "message": "The deal inputs are invalid.",
                "details": errors,
            }
        },
    )


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.get("/company-lookup/{ticker}", response_model=CompanyLookupResponse)
def company_lookup_endpoint(ticker: str) -> CompanyLookupResponse:
    try:
        return lookup_company(ticker)
    except CompanyLookupError as exc:
        raise HTTPException(
            status_code=404,
            detail={"code": "company_not_found", "message": str(exc)},
        ) from exc


@app.post("/calculate-deal", response_model=DealCalculationResult)
def calculate_deal_endpoint(request: DealRequest) -> DealCalculationResult:
    return calculate_request(request)


@app.post("/sensitivity", response_model=SensitivityResponse)
def sensitivity_endpoint(request: SensitivityRequest) -> SensitivityResponse:
    return run_sensitivity(request)


@app.post("/generate-memo", response_model=MemoResponse)
def memo_endpoint(request: MemoRequest) -> MemoResponse:
    recalculated = calculate_request(request)
    comparison_fields = (
        "offer_price",
        "equity_purchase_price",
        "pro_forma_eps",
        "accretion_dilution_pct",
    )
    for field in comparison_fields:
        submitted = getattr(request.calculation, field)
        expected = getattr(recalculated, field)
        if abs(submitted - expected) > 1e-6:
            raise HTTPException(
                status_code=409,
                detail={
                    "code": "stale_calculation",
                    "message": "The submitted calculation does not match the deal inputs.",
                },
            )
    deal = DealRequest(
        acquirer=request.acquirer,
        target=request.target,
        assumptions=request.assumptions,
    )
    return generate_memo(deal, recalculated)
