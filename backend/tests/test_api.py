from fastapi.testclient import TestClient

from app.main import app
from app.models import CompanyLookupResponse

client = TestClient(app)


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_company_lookup(monkeypatch):
    expected = CompanyLookupResponse(
        name="Apple Inc.",
        ticker="AAPL",
        currency="USD",
        exchange="NasdaqGS",
        share_price=210.5,
        shares_outstanding=15000,
        net_income=100000,
        revenue=400000,
        cash_balance=60000,
        debt_balance=90000,
        source="Test provider",
        as_of="2026-06-19",
    )
    monkeypatch.setattr("app.main.lookup_company", lambda _: expected)

    response = client.get("/company-lookup/aapl")
    assert response.status_code == 200
    assert response.json()["ticker"] == "AAPL"
    assert response.json()["share_price"] == 210.5


def test_calculate_deal(base_deal_data):
    response = client.post("/calculate-deal", json=base_deal_data)
    assert response.status_code == 200
    assert response.json()["verdict"] == "Accretive"


def test_sensitivity_endpoint(base_deal_data):
    response = client.post("/sensitivity", json=base_deal_data)
    assert response.status_code == 200
    assert len(response.json()["grid"]) == 4


def test_generate_memo(base_deal_data):
    calculation = client.post("/calculate-deal", json=base_deal_data).json()
    response = client.post(
        "/generate-memo",
        json={**base_deal_data, "calculation": calculation},
    )
    assert response.status_code == 200
    assert "Deal Summary" in response.json()["sections"]
    assert "Northstar Systems" in response.json()["memo"]


def test_structured_validation_error(base_deal_data):
    base_deal_data["acquirer"]["share_price"] = 0
    response = client.post("/calculate-deal", json=base_deal_data)
    assert response.status_code == 422
    payload = response.json()["error"]
    assert payload["code"] == "validation_error"
    assert payload["details"][0]["field"] == "acquirer.share_price"
