# How the DealIQ model works

## Accretion and dilution

An acquisition is **EPS accretive** when the buyer's modeled pro forma earnings per share exceed its standalone earnings per share. It is **dilutive** when pro forma EPS is lower. DealIQ treats outcomes within ±0.01% as neutral so floating-point noise is not presented as an economic conclusion.

EPS is only one way to evaluate a transaction. Accretion can be created by financing choices and does not, by itself, prove that a buyer created long-term shareholder value.

## Why purchase premium matters

The premium increases the offer price above the target's unaffected share price. A higher purchase price requires more cash, debt, stock, or some combination of the three. That raises financing costs or increases the share count, making EPS accretion harder to achieve.

## Why debt creates interest expense

New acquisition debt creates annual interest expense. DealIQ applies the entered interest rate to new debt and then tax-affects that expense because interest is assumed to be tax-deductible:

```text
After-tax interest = debt issued × interest rate × (1 - tax rate)
```

The model does not currently include mandatory amortization, refinancing, changing benchmark rates, or credit-rating effects.

## Why stock creates dilution

Stock consideration requires the buyer to issue new shares:

```text
New shares issued = stock consideration ÷ acquirer share price
```

Those shares increase the denominator in pro forma EPS. Stock can preserve cash and borrowing capacity, but a large issuance makes accretion more difficult unless the target's earnings and synergies provide enough incremental income.

## Why synergies improve EPS

Synergies represent recurring pre-tax earnings improvements expected from the combination, such as duplicated-cost removal, vendor savings, or revenue opportunities. DealIQ tax-affects the entered amount and adds it to pro forma net income.

The break-even synergy output finds the minimum annual pre-tax synergy amount that brings modeled EPS to neutral or better. It uses a bounded binary search and returns no value when synergies cannot affect EPS—for example, at a 100% tax rate—or when the practical search bound is insufficient.

## Important limitations

DealIQ is a focused Year 1 equity purchase-price model. It does not currently model:

- Target net debt or enterprise value adjustments
- Purchase accounting, asset write-ups, or amortization
- Transaction fees, financing fees, or restructuring costs
- Foregone interest income on cash used
- Debt repayment or refinancing schedules
- Synergy ramp timing, implementation costs, or execution probability
- Revenue dis-synergies, customer churn, or integration disruption
- Multi-year forecasts, valuation, returns, or leverage ratios
- Fractional-share constraints or changing buyer share prices

The outputs are educational scenario analysis, not investment advice or a fairness opinion.

