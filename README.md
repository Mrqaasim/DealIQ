# DealIQ

DealIQ is a full-stack M&A deal simulator and deal intelligence workspace. It turns acquisition terms, financing assumptions, and operating synergies into a transparent Year 1 EPS accretion/dilution analysis, sensitivity matrix, break-even synergy estimate, and deterministic investment banking-style memo.

> Portfolio project: all included companies and transactions are fictional. DealIQ does not provide investment advice.

## Live demo and screenshots

- Live demo: _deployment URL coming soon_
- Screenshots: _add desktop and mobile captures after deployment_

## What it does

- Models cash, debt, and stock consideration
- Calculates offer price, purchase price, new debt, new shares, and interest expense
- Bridges standalone EPS to pro forma EPS
- Classifies a deal as accretive, dilutive, or neutral
- Calculates the annual pre-tax synergy level required to reach break-even EPS
- Runs purchase-premium and synergy sensitivity analysis
- Generates a deterministic transaction memo without an external AI service
- Includes three fictional demo transactions for immediate exploration
- Loads public-company market and financial data from a ticker, while keeping every field manually editable

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS, Recharts |
| Backend | Python, FastAPI, Pydantic |
| Testing | pytest, FastAPI TestClient, TypeScript compiler, Next production build |
| Data | Manual user inputs only; no database or paid APIs |

## Architecture

```text
Browser
  └── Next.js transaction workspace
        └── typed HTTP client
              └── FastAPI
                    ├── Pydantic validation
                    ├── finance engine
                    ├── sensitivity engine
                    └── deterministic memo generator
```

The finance engine is deliberately isolated from React and HTTP concerns. FastAPI owns validation and orchestration; the frontend owns input, formatting, and presentation.

## Finance model

All income statement values, balance sheet values, synergies, and share counts are entered in millions. Share price and EPS are in dollars per share. Because both net income and shares use millions, their units cancel correctly in the EPS calculation.

Core formulas:

```text
Offer price = target share price × (1 + premium)
Equity purchase price = offer price × target shares
New shares = stock consideration ÷ acquirer share price
After-tax interest = new debt × interest rate × (1 - tax rate)
After-tax synergies = pre-tax synergies × (1 - tax rate)
Pro forma EPS = pro forma net income ÷ pro forma shares
Accretion / dilution = (pro forma EPS - standalone EPS) ÷ standalone EPS
```

See [docs/model-explanation.md](docs/model-explanation.md) for a fuller explanation and model limitations.

## Run locally

### Backend

Python 3.12 is recommended.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`; interactive documentation is available at `http://localhost:8000/docs`.

Optional backend environment:

```bash
cp .env.example .env
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Service health |
| `GET` | `/company-lookup/{ticker}` | Public-company lookup and normalized financial inputs |
| `POST` | `/calculate-deal` | Base-case deal calculation |
| `POST` | `/sensitivity` | Premium/synergy scenario grid |
| `POST` | `/generate-memo` | Deterministic transaction memo |

Percentages are decimals in API requests: `0.30` means 30%.

Ticker lookup uses the open-source `yfinance` package and Yahoo Finance's
publicly available data for research and educational use. Availability and
field coverage vary by security, exchange, and Yahoo's upstream service. Any
missing field remains manually editable in the workspace.

## Verification

```bash
cd backend
.venv/bin/pytest

cd ../frontend
npm run typecheck
npm run build
```

## Repository layout

```text
frontend/     Next.js application and typed UI components
backend/      FastAPI application, finance engine, and pytest suite
docs/         Finance-model explanation and reproducible sample deals
```

## Deployment

Deploy the frontend and backend independently:

- Set `NEXT_PUBLIC_API_URL` to the public FastAPI base URL at frontend build time.
- Set `CORS_ORIGINS` on the backend to the deployed frontend origin. Multiple origins are comma-separated.
- Run the backend with a production ASGI server command such as `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Run the frontend using `npm run build` followed by `npm start`.

## Future improvements

- Enterprise-value and target net-debt treatment
- Purchase accounting, amortization, and one-time fees
- Multi-year operating forecasts and EPS impact
- Revenue and cost synergy ramp schedules
- Share-price and interest-rate sensitivities
- Exportable PDF / Excel transaction materials
- SEC filing ingestion and market-data integrations
