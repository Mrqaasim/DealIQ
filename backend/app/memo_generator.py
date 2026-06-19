from __future__ import annotations

from .models import DealCalculationResult, DealRequest, MemoResponse


def _money(value: float) -> str:
    if abs(value) >= 1000:
        return f"${value / 1000:,.2f}bn"
    return f"${value:,.1f}mm"


def _percent(value: float) -> str:
    return f"{value * 100:.1f}%"


def generate_memo(
    deal: DealRequest, calculation: DealCalculationResult
) -> MemoResponse:
    assumptions = deal.assumptions
    break_even = calculation.break_even_pre_tax_synergies
    impact_word = calculation.verdict.lower()

    sections = {
        "Deal Summary": (
            f"{deal.acquirer.name} ({deal.acquirer.ticker.upper()}) is evaluating the "
            f"acquisition of {deal.target.name} ({deal.target.ticker.upper()}) at a "
            f"{_percent(assumptions.purchase_premium)} premium. The implied offer price "
            f"is ${calculation.offer_price:,.2f} per share, representing an equity "
            f"purchase price of {_money(calculation.equity_purchase_price)}."
        ),
        "Financing Structure": (
            f"The transaction is funded with {_percent(assumptions.cash_financing_pct)} "
            f"cash, {_percent(assumptions.debt_financing_pct)} debt, and "
            f"{_percent(assumptions.stock_financing_pct)} stock. This requires "
            f"{_money(calculation.cash_used)} of cash, {_money(calculation.debt_issued)} "
            f"of new debt, and {calculation.new_shares_issued:,.1f}mm newly issued shares."
        ),
        "EPS Impact": (
            f"Acquirer standalone EPS of ${calculation.acquirer_standalone_eps:,.2f} "
            f"moves to pro forma EPS of ${calculation.pro_forma_eps:,.2f}. The base case "
            f"is {abs(calculation.accretion_dilution_pct) * 100:.2f}% {impact_word}."
        ),
        "Sensitivity / What Needs to Be True": (
            "The transaction is already neutral or accretive before synergies."
            if break_even == 0
            else (
                f"The deal requires approximately {_money(break_even)} of annual pre-tax "
                f"synergies to reach neutral EPS."
                if break_even is not None
                else "The modeled transaction does not reach neutral EPS within the practical synergy bound."
            )
        ),
        "Key Drivers": (
            f"The primary drivers are the {_percent(assumptions.purchase_premium)} "
            f"purchase premium, {_percent(assumptions.stock_financing_pct)} stock mix, "
            f"{_percent(assumptions.interest_rate)} cost of new debt, and "
            f"{_money(assumptions.annual_pre_tax_synergies)} of annual pre-tax synergies."
        ),
        "Final Verdict": (
            f"On the stated assumptions, the transaction is {calculation.verdict.upper()}. "
            "Execution should focus on protecting the synergy case and financing economics "
            "that support the modeled EPS outcome."
        ),
    }
    memo = "\n\n".join(f"{title}\n{text}" for title, text in sections.items())
    return MemoResponse(memo=memo, sections=sections)

