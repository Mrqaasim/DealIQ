from __future__ import annotations

from .deal_engine import calculate_deal, find_break_even_synergies
from .models import (
    SensitivityCell,
    SensitivityRequest,
    SensitivityResponse,
)


def run_sensitivity(request: SensitivityRequest) -> SensitivityResponse:
    grid: list[list[SensitivityCell]] = []
    for synergy in request.ranges.synergy_values:
        row: list[SensitivityCell] = []
        for premium in request.ranges.purchase_premiums:
            assumptions = request.assumptions.model_copy(
                update={
                    "purchase_premium": premium,
                    "annual_pre_tax_synergies": synergy,
                }
            )
            result = calculate_deal(
                request.acquirer,
                request.target,
                assumptions,
                include_break_even=False,
            )
            row.append(
                SensitivityCell(
                    purchase_premium=premium,
                    pre_tax_synergies=synergy,
                    accretion_dilution_pct=result.accretion_dilution_pct,
                    verdict=result.verdict,
                )
            )
        grid.append(row)

    return SensitivityResponse(
        purchase_premiums=request.ranges.purchase_premiums,
        synergy_values=request.ranges.synergy_values,
        grid=grid,
        break_even_pre_tax_synergies=find_break_even_synergies(
            request.acquirer, request.target, request.assumptions
        ),
    )

