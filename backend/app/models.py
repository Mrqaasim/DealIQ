from __future__ import annotations

from typing import Dict, Literal, Optional

from pydantic import BaseModel, Field, model_validator


class AcquirerInput(BaseModel):
    name: str = Field(min_length=1)
    ticker: str = Field(min_length=1, max_length=20)
    share_price: float = Field(gt=0)
    shares_outstanding: float = Field(gt=0)
    net_income: float
    cash_balance: float = Field(ge=0)
    debt_balance: float = Field(ge=0)


class TargetInput(BaseModel):
    name: str = Field(min_length=1)
    ticker: str = Field(min_length=1, max_length=20)
    share_price: float = Field(gt=0)
    shares_outstanding: float = Field(gt=0)
    net_income: float
    revenue: float = Field(ge=0)
    cash_balance: float = Field(ge=0)
    debt_balance: float = Field(ge=0)


class DealAssumptions(BaseModel):
    purchase_premium: float = Field(ge=0)
    cash_financing_pct: float = Field(ge=0, le=1)
    debt_financing_pct: float = Field(ge=0, le=1)
    stock_financing_pct: float = Field(ge=0, le=1)
    interest_rate: float = Field(ge=0)
    tax_rate: float = Field(ge=0, le=1)
    annual_pre_tax_synergies: float = Field(ge=0)

    @model_validator(mode="after")
    def financing_must_equal_one(self) -> "DealAssumptions":
        financing_total = (
            self.cash_financing_pct
            + self.debt_financing_pct
            + self.stock_financing_pct
        )
        if abs(financing_total - 1.0) > 1e-6:
            raise ValueError("Cash, debt, and stock financing must total 100%.")
        return self


class DealRequest(BaseModel):
    acquirer: AcquirerInput
    target: TargetInput
    assumptions: DealAssumptions

    @model_validator(mode="after")
    def cash_must_be_available(self) -> "DealRequest":
        offer_price = self.target.share_price * (1 + self.assumptions.purchase_premium)
        purchase_price = offer_price * self.target.shares_outstanding
        cash_used = purchase_price * self.assumptions.cash_financing_pct
        if cash_used > self.acquirer.cash_balance + 1e-6:
            raise ValueError(
                f"Cash financing requires ${cash_used:,.1f}mm, exceeding "
                f"{self.acquirer.name}'s ${self.acquirer.cash_balance:,.1f}mm cash balance."
            )
        return self


Verdict = Literal["Accretive", "Dilutive", "Neutral"]


class DealCalculationResult(BaseModel):
    acquirer_standalone_eps: float
    offer_price: float
    equity_purchase_price: float
    cash_used: float
    debt_issued: float
    stock_issued_value: float
    new_shares_issued: float
    new_interest_expense: float
    after_tax_interest_expense: float
    after_tax_synergies: float
    pro_forma_net_income: float
    pro_forma_shares: float
    pro_forma_eps: float
    accretion_dilution_pct: float
    verdict: Verdict
    break_even_pre_tax_synergies: Optional[float] = None


class SensitivityRanges(BaseModel):
    purchase_premiums: list[float] = Field(
        default_factory=lambda: [0.10, 0.20, 0.30, 0.40], min_length=1
    )
    synergy_values: list[float] = Field(
        default_factory=lambda: [0, 500, 1000, 1500], min_length=1
    )

    @model_validator(mode="after")
    def ranges_must_be_valid(self) -> "SensitivityRanges":
        if any(value < 0 for value in self.purchase_premiums):
            raise ValueError("Purchase premium cases cannot be negative.")
        if any(value < 0 for value in self.synergy_values):
            raise ValueError("Synergy cases cannot be negative.")
        return self


class SensitivityRequest(DealRequest):
    ranges: SensitivityRanges = Field(default_factory=SensitivityRanges)


class SensitivityCell(BaseModel):
    purchase_premium: float
    pre_tax_synergies: float
    accretion_dilution_pct: float
    verdict: Verdict


class SensitivityResponse(BaseModel):
    purchase_premiums: list[float]
    synergy_values: list[float]
    grid: list[list[SensitivityCell]]
    break_even_pre_tax_synergies: Optional[float]


class MemoRequest(DealRequest):
    calculation: DealCalculationResult


class MemoResponse(BaseModel):
    memo: str
    sections: Dict[str, str]


class HealthResponse(BaseModel):
    status: Literal["ok"]


class CompanyLookupResponse(BaseModel):
    name: str
    ticker: str
    currency: str
    exchange: Optional[str] = None
    share_price: Optional[float] = None
    shares_outstanding: Optional[float] = None
    net_income: Optional[float] = None
    revenue: Optional[float] = None
    cash_balance: Optional[float] = None
    debt_balance: Optional[float] = None
    source: str
    as_of: str
    missing_fields: list[str] = Field(default_factory=list)
