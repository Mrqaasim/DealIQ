from __future__ import annotations

import re
import time
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple

import yfinance as yf

from .models import CompanyLookupResponse

TICKER_PATTERN = re.compile(r"^[A-Z0-9.\-^=]{1,20}$")
CACHE_TTL_SECONDS = 15 * 60
_cache: Dict[str, Tuple[float, CompanyLookupResponse]] = {}


class CompanyLookupError(Exception):
    """Raised when a public-company quote cannot be resolved."""


def _number(info: Dict[str, Any], *keys: str) -> Optional[float]:
    for key in keys:
        value = info.get(key)
        if isinstance(value, (int, float)) and value == value:
            return float(value)
    return None


def _millions(value: Optional[float]) -> Optional[float]:
    return round(value / 1_000_000, 2) if value is not None else None


def normalize_company_info(ticker: str, info: Dict[str, Any]) -> CompanyLookupResponse:
    share_price = _number(
        info, "currentPrice", "regularMarketPrice", "previousClose"
    )
    shares_outstanding = _millions(_number(info, "sharesOutstanding"))
    values = {
        "share_price": share_price,
        "shares_outstanding": shares_outstanding,
        "net_income": _millions(_number(info, "netIncomeToCommon", "netIncome")),
        "revenue": _millions(_number(info, "totalRevenue")),
        "cash_balance": _millions(
            _number(info, "totalCash", "cashCashEquivalentsAndShortTermInvestments")
        ),
        "debt_balance": _millions(_number(info, "totalDebt")),
    }
    missing_fields = [field for field, value in values.items() if value is None]
    name = (
        info.get("longName")
        or info.get("shortName")
        or info.get("displayName")
        or ticker
    )
    resolved_ticker = str(info.get("symbol") or ticker).upper()

    if share_price is None and shares_outstanding is None:
        raise CompanyLookupError(
            f"No public market data was found for ticker '{ticker}'."
        )

    return CompanyLookupResponse(
        name=str(name),
        ticker=resolved_ticker,
        currency=str(info.get("currency") or "USD"),
        exchange=info.get("fullExchangeName") or info.get("exchange"),
        source="Yahoo Finance via yfinance",
        as_of=datetime.now(timezone.utc).date().isoformat(),
        missing_fields=missing_fields,
        **values,
    )


def lookup_company(raw_ticker: str) -> CompanyLookupResponse:
    ticker = raw_ticker.strip().upper()
    if not TICKER_PATTERN.fullmatch(ticker):
        raise CompanyLookupError(
            "Enter a valid ticker using letters, numbers, dots, or hyphens."
        )

    cached = _cache.get(ticker)
    now = time.monotonic()
    if cached and now - cached[0] < CACHE_TTL_SECONDS:
        return cached[1]

    try:
        info = yf.Ticker(ticker).get_info()
    except Exception as exc:
        raise CompanyLookupError(
            "Market data is temporarily unavailable. You can still enter the figures manually."
        ) from exc

    if not isinstance(info, dict) or not info:
        raise CompanyLookupError(
            f"No public market data was found for ticker '{ticker}'."
        )

    result = normalize_company_info(ticker, info)
    _cache[ticker] = (now, result)
    return result
