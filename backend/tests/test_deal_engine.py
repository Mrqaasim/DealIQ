import pytest
from pydantic import ValidationError

from app.deal_engine import calculate_request, find_break_even_synergies
from app.models import DealRequest


def test_financing_mix_validation(base_deal_data):
    base_deal_data["assumptions"]["stock_financing_pct"] = 0.2
    with pytest.raises(ValidationError, match="must total 100%"):
        DealRequest.model_validate(base_deal_data)


def test_insufficient_cash_validation(base_deal_data):
    base_deal_data["acquirer"]["cash_balance"] = 100
    with pytest.raises(ValidationError, match="exceeding"):
        DealRequest.model_validate(base_deal_data)


def test_core_calculations(base_deal):
    result = calculate_request(base_deal)
    assert result.acquirer_standalone_eps == pytest.approx(8)
    assert result.offer_price == pytest.approx(60)
    assert result.equity_purchase_price == pytest.approx(12000)
    assert result.cash_used == pytest.approx(3600)
    assert result.debt_issued == pytest.approx(3600)
    assert result.stock_issued_value == pytest.approx(4800)
    assert result.new_shares_issued == pytest.approx(48)
    assert result.new_interest_expense == pytest.approx(180)
    assert result.after_tax_interest_expense == pytest.approx(135)
    assert result.pro_forma_net_income == pytest.approx(8940)
    assert result.pro_forma_shares == pytest.approx(1048)
    assert result.pro_forma_eps == pytest.approx(8.530534, rel=1e-6)
    assert result.accretion_dilution_pct == pytest.approx(0.0663168, rel=1e-5)
    assert result.verdict == "Accretive"


def test_dilutive_verdict(base_deal):
    assumptions = base_deal.assumptions.model_copy(
        update={
            "annual_pre_tax_synergies": 0,
            "stock_financing_pct": 0.8,
            "cash_financing_pct": 0.1,
            "debt_financing_pct": 0.1,
            "purchase_premium": 0.6,
        }
    )
    deal = base_deal.model_copy(update={"assumptions": assumptions})
    assert calculate_request(deal).verdict == "Dilutive"


def test_neutral_verdict(base_deal):
    base_result = calculate_request(base_deal)
    required_after_tax = (
        base_result.acquirer_standalone_eps * base_result.pro_forma_shares
        - base_deal.acquirer.net_income
        - base_deal.target.net_income
        + base_result.after_tax_interest_expense
    )
    synergy = required_after_tax / (1 - base_deal.assumptions.tax_rate)
    assumptions = base_deal.assumptions.model_copy(
        update={"annual_pre_tax_synergies": synergy}
    )
    deal = base_deal.model_copy(update={"assumptions": assumptions})
    assert calculate_request(deal).verdict == "Neutral"


def test_break_even_synergy(base_deal):
    assumptions = base_deal.assumptions.model_copy(
        update={
            "annual_pre_tax_synergies": 0,
            "cash_financing_pct": 0,
            "debt_financing_pct": 0,
            "stock_financing_pct": 1,
            "purchase_premium": 0.5,
        }
    )
    value = find_break_even_synergies(
        base_deal.acquirer, base_deal.target, assumptions
    )
    assert value is not None
    below = assumptions.model_copy(update={"annual_pre_tax_synergies": value - 1})
    above = assumptions.model_copy(update={"annual_pre_tax_synergies": value + 1})
    assert calculate_request(
        base_deal.model_copy(update={"assumptions": below})
    ).verdict == "Dilutive"
    assert calculate_request(
        base_deal.model_copy(update={"assumptions": above})
    ).verdict in {"Neutral", "Accretive"}


def test_break_even_is_zero_when_already_accretive(base_deal):
    assert find_break_even_synergies(
        base_deal.acquirer, base_deal.target, base_deal.assumptions
    ) == 0

