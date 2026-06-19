# Sample deals

DealIQ includes three fictional transaction presets. They are designed to demonstrate different financing and synergy profiles and do not represent announced transactions.

Expected outputs below are produced by the current backend engine. Dollar values are in millions except per-share figures.

## 1. Software Scale

Northstar Systems acquires Vector Cloud at a 30% premium using 35% cash, 35% debt, and 30% stock.

| Output | Expected value |
| --- | ---: |
| Equity purchase price | $20,384.0mm |
| Pro forma EPS | $12.7352 |
| EPS accretion / (dilution) | 8.22% |
| Verdict | Accretive |
| Break-even pre-tax synergies | $0.0mm |

This case is accretive before synergies because the target's earnings contribution is strong relative to financing costs and new shares.

## 2. Stock-Heavy

Atlas Commerce acquires Beacon Marketplaces at a 25% premium using 10% cash, 15% debt, and 75% stock.

| Output | Expected value |
| --- | ---: |
| Equity purchase price | $11,237.5mm |
| Pro forma EPS | $5.4441 |
| EPS accretion / (dilution) | (0.87%) |
| Verdict | Dilutive |
| Break-even pre-tax synergies | $345.16mm |

The large stock issuance expands the share count enough to outweigh the base-case earnings contribution.

## 3. High-Synergy

Meridian Automation acquires Forge Robotics at a 35% premium using 30% cash, 45% debt, and 25% stock.

| Output | Expected value |
| --- | ---: |
| Equity purchase price | $10,206.0mm |
| Pro forma EPS | $9.9449 |
| EPS accretion / (dilution) | 15.22% |
| Verdict | Accretive |
| Break-even pre-tax synergies | $93.93mm |

This scenario demonstrates how a substantial synergy case can overcome a high purchase premium and debt-heavy financing.

## Reproduce the outputs

Start the backend and frontend, open `/new-deal`, select a preset from **Load demo deal**, and click **Calculate deal**. The result cards, sensitivity grid, and memo should populate together.

