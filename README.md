# Financial Valuation Platform

A full-stack financial valuation platform that estimates a company's intrinsic
equity value using a 5-year Discounted Cash Flow (DCF) model. Given a stock
ticker and a set of assumptions, it retrieves live company fundamentals,
projects free cash flows, and derives an implied share price.

## Live Demo

- **App:** https://financial-valuation-platform.vercel.app
- **API docs:** https://financial-valuation-api.onrender.com/docs

> Note: the backend runs on a free hosting tier and may take up to 60 seconds
> to respond on first load after a period of inactivity.

## Features

- Live company fundamentals (revenue, operating margin, net debt, shares outstanding) via the Financial Modeling Prep API
- 5-year unlevered free cash flow projection based on user-defined assumptions
- Terminal value via the Gordon Growth Model
- Enterprise value → equity value → implied share price bridge
- Input validation and typed request/response models (Pydantic)
- Unit-tested calculation engine, fully decoupled from data retrieval

## Valuation Methodology

1. Retrieve the company's latest revenue, operating margin, net debt, and shares outstanding.
2. Project revenue over a 5-year forecast period using the user-supplied revenue growth rate.
3. Estimate each year's unlevered free cash flow as `revenue × operating margin`.
   *(This is a simplified UFCF proxy for a portfolio-scale model — a full
   treatment would use `EBIT × (1 − tax rate) + D&A − CapEx − Δ Net Working Capital`.)*
4. Discount each year's cash flow to present value using the WACC assumption.
5. Calculate terminal value at year 5 using the Gordon Growth Model:
   `TV = FCF_year6 / (WACC − terminal growth rate)`
6. Sum discounted cash flows and discounted terminal value to get enterprise value.
7. Subtract net debt to get equity value.
8. Divide by shares outstanding to get the implied share price.

The model requires WACC to exceed the terminal growth rate (otherwise the
perpetuity formula is undefined) and validates this before running.

## Tech Stack

**Backend:** FastAPI, Pydantic, pytest, [Financial Modeling Prep API](https://site.financialmodelingprep.com/) (live market data)
**Frontend:** Next.js, TypeScript, Tailwind CSS
**Deployment:** Render (backend), Vercel (frontend)

## Architecture

```
Client (Next.js) → FastAPI → Market Data Service (FMP) → DCF Engine → JSON response
```

backend/
├── app/
│ ├── main.py FastAPI routes, CORS config
│ ├── schemas/
│ │ └── valuation.py Pydantic request/response models
│ └── services/
│ ├── dcf.py Pure DCF calculation logic (no external calls)
│ └── market_data.py Live data retrieval via Financial Modeling Prep
└── tests/
└── test_dcf.py Unit tests covering valuation edge cases

frontend/
└── src/
├── app/page.tsx Main dashboard page
├── components/ Form and results UI
├── lib/api.ts Typed API client
└── types/valuation.ts Shared TypeScript types


The DCF engine (`dcf.py`) has no dependency on the data-fetching layer
(`market_data.py`), so the calculation logic is unit tested in complete
isolation from any external API.

## API Example

`POST /api/v1/valuation`

Request:
```json
{
  "ticker": "AAPL",
  "revenue_growth_rate": 0.08,
  "operating_margin": 0.30,
  "wacc": 0.09,
  "terminal_growth_rate": 0.025
}
```

Response:
```json
{
  "ticker": "AAPL",
  "enterprise_value": 2790165538520.86,
  "equity_value": 2768220542680.86,
  "implied_share_price": 189.68,
  "projections": [
    {
      "year": 1,
      "revenue": 504168826798.08,
      "unlevered_free_cash_flow": 151250648039.42,
      "discounted_cash_flow": 138762062421.49
    }
  ]
}
```

## Running Locally

```bash
# Backend
pip install -r requirements.txt
# Create a .env file with: FMP_API_KEY=your_key_here
uvicorn backend.app.main:app --reload

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Testing

```bash
pytest backend/tests -v
```

## Roadmap

- [x] Live market data integration (Financial Modeling Prep API)
- [x] DCF valuation engine with unit tests
- [x] Next.js + Tailwind frontend
- [x] Deployed to Render (backend) + Vercel (frontend)
- [ ] Sensitivity analysis (WACC × terminal growth grid)
- [ ] Interactive assumption sliders with real-time recalculation
- [ ] Dockerized local development environment
- [ ] CI pipeline (GitHub Actions) running tests on every push