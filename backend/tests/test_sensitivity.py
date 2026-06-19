from app.models import SensitivityRequest, SensitivityRanges
from app.sensitivity import run_sensitivity


def test_default_sensitivity_shape(base_deal_data):
    result = run_sensitivity(SensitivityRequest.model_validate(base_deal_data))
    assert len(result.grid) == 4
    assert all(len(row) == 4 for row in result.grid)
    assert result.purchase_premiums == [0.1, 0.2, 0.3, 0.4]
    assert result.synergy_values == [0, 500, 1000, 1500]


def test_custom_sensitivity_ranges(base_deal_data):
    base_deal_data["ranges"] = {
        "purchase_premiums": [0.15, 0.25],
        "synergy_values": [100, 300, 700],
    }
    result = run_sensitivity(SensitivityRequest.model_validate(base_deal_data))
    assert len(result.grid) == 3
    assert all(len(row) == 2 for row in result.grid)

