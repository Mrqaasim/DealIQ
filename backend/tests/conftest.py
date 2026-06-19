import pytest

from app.models import DealRequest


@pytest.fixture
def base_deal_data() -> dict:
    return {
        "acquirer": {
            "name": "Northstar Systems",
            "ticker": "NSS",
            "share_price": 100,
            "shares_outstanding": 1000,
            "net_income": 8000,
            "cash_balance": 30000,
            "debt_balance": 12000,
        },
        "target": {
            "name": "Vector Cloud",
            "ticker": "VCLD",
            "share_price": 50,
            "shares_outstanding": 200,
            "net_income": 700,
            "revenue": 5000,
            "cash_balance": 1500,
            "debt_balance": 1000,
        },
        "assumptions": {
            "purchase_premium": 0.20,
            "cash_financing_pct": 0.30,
            "debt_financing_pct": 0.30,
            "stock_financing_pct": 0.40,
            "interest_rate": 0.05,
            "tax_rate": 0.25,
            "annual_pre_tax_synergies": 500,
        },
    }


@pytest.fixture
def base_deal(base_deal_data: dict) -> DealRequest:
    return DealRequest.model_validate(base_deal_data)

