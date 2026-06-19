import pytest

from app.company_lookup import CompanyLookupError, normalize_company_info


def test_normalize_company_info_converts_to_millions():
    result = normalize_company_info(
        "AAPL",
        {
            "symbol": "AAPL",
            "longName": "Apple Inc.",
            "currency": "USD",
            "fullExchangeName": "NasdaqGS",
            "currentPrice": 210.5,
            "sharesOutstanding": 15_000_000_000,
            "netIncomeToCommon": 100_000_000_000,
            "totalRevenue": 400_000_000_000,
            "totalCash": 60_000_000_000,
            "totalDebt": 90_000_000_000,
        },
    )

    assert result.name == "Apple Inc."
    assert result.share_price == 210.5
    assert result.shares_outstanding == 15000
    assert result.net_income == 100000
    assert result.revenue == 400000
    assert result.cash_balance == 60000
    assert result.debt_balance == 90000
    assert result.missing_fields == []


def test_normalize_company_info_reports_missing_fields():
    result = normalize_company_info(
        "TEST",
        {
            "symbol": "TEST",
            "shortName": "Test Company",
            "regularMarketPrice": 12.5,
        },
    )

    assert result.share_price == 12.5
    assert "shares_outstanding" in result.missing_fields
    assert "revenue" in result.missing_fields


def test_normalize_company_info_rejects_empty_quote():
    with pytest.raises(CompanyLookupError, match="No public market data"):
        normalize_company_info("MISSING", {"symbol": "MISSING"})
