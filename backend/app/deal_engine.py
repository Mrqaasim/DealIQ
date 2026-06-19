from __future__ import annotations

from typing import Optional

from .models import (
    AcquirerInput,
    DealAssumptions,
    DealCalculationResult,
    DealRequest,
    TargetInput,
    Verdict,
)

NEUTRAL_THRESHOLD = 0.0001


def classify_verdict(accretion_dilution_pct: float) -> Verdict:
    if abs(accretion_dilution_pct) <= NEUTRAL_THRESHOLD:
        return "Neutral"
    return "Accretive" if accretion_dilution_pct > 0 else "Dilutive"


def calculate_deal(
    acquirer: AcquirerInput,
    target: TargetInput,
    assumptions: DealAssumptions,
    *,
    include_break_even: bool = True,
) -> DealCalculationResult:
    standalone_eps = acquirer.net_income / acquirer.shares_outstanding
    offer_price = target.share_price * (1 + assumptions.purchase_premium)
    purchase_price = offer_price * target.shares_outstanding
    cash_used = purchase_price * assumptions.cash_financing_pct
    debt_issued = purchase_price * assumptions.debt_financing_pct
    stock_issued_value = purchase_price * assumptions.stock_financing_pct
    new_shares_issued = stock_issued_value / acquirer.share_price
    interest_expense = debt_issued * assumptions.interest_rate
    after_tax_interest = interest_expense * (1 - assumptions.tax_rate)
    after_tax_synergies = assumptions.annual_pre_tax_synergies * (
        1 - assumptions.tax_rate
    )
    pro_forma_net_income = (
        acquirer.net_income
        + target.net_income
        + after_tax_synergies
        - after_tax_interest
    )
    pro_forma_shares = acquirer.shares_outstanding + new_shares_issued
    pro_forma_eps = pro_forma_net_income / pro_forma_shares
    accretion_dilution = (pro_forma_eps - standalone_eps) / standalone_eps

    result = DealCalculationResult(
        acquirer_standalone_eps=standalone_eps,
        offer_price=offer_price,
        equity_purchase_price=purchase_price,
        cash_used=cash_used,
        debt_issued=debt_issued,
        stock_issued_value=stock_issued_value,
        new_shares_issued=new_shares_issued,
        new_interest_expense=interest_expense,
        after_tax_interest_expense=after_tax_interest,
        after_tax_synergies=after_tax_synergies,
        pro_forma_net_income=pro_forma_net_income,
        pro_forma_shares=pro_forma_shares,
        pro_forma_eps=pro_forma_eps,
        accretion_dilution_pct=accretion_dilution,
        verdict=classify_verdict(accretion_dilution),
    )

    if include_break_even:
        result.break_even_pre_tax_synergies = find_break_even_synergies(
            acquirer, target, assumptions
        )
    return result


def find_break_even_synergies(
    acquirer: AcquirerInput,
    target: TargetInput,
    assumptions: DealAssumptions,
    *,
    tolerance: float = 0.01,
) -> Optional[float]:
    zero_synergy = assumptions.model_copy(update={"annual_pre_tax_synergies": 0.0})
    zero_result = calculate_deal(
        acquirer, target, zero_synergy, include_break_even=False
    )
    if zero_result.accretion_dilution_pct >= -NEUTRAL_THRESHOLD:
        return 0.0
    if assumptions.tax_rate >= 1:
        return None

    purchase_price = zero_result.equity_purchase_price
    upper = max(1000.0, purchase_price * 5)
    upper_assumptions = assumptions.model_copy(
        update={"annual_pre_tax_synergies": upper}
    )
    upper_result = calculate_deal(
        acquirer, target, upper_assumptions, include_break_even=False
    )
    if upper_result.accretion_dilution_pct < -NEUTRAL_THRESHOLD:
        return None

    lower = 0.0
    while upper - lower > tolerance:
        midpoint = (lower + upper) / 2
        midpoint_assumptions = assumptions.model_copy(
            update={"annual_pre_tax_synergies": midpoint}
        )
        midpoint_result = calculate_deal(
            acquirer, target, midpoint_assumptions, include_break_even=False
        )
        if midpoint_result.accretion_dilution_pct >= -NEUTRAL_THRESHOLD:
            upper = midpoint
        else:
            lower = midpoint
    return round(upper, 2)


def calculate_request(request: DealRequest) -> DealCalculationResult:
    return calculate_deal(request.acquirer, request.target, request.assumptions)
