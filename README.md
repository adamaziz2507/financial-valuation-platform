# Financial Valuation Platform

A production-style DCF (discounted cash flow) valuation API. Given a stock ticker
and a set of financial assumptions, it pulls live company fundamentals and
computes a 5-year unlevered free cash flow projection, terminal value via the
Gordon Growth Model, and an implied share price.

## Stack

- **FastAPI** — REST API framework
- **Pydantic** — request/response validation and typed data models
- **yfinance** — live market data (revenue, margins, debt, shares outstanding)
- **pytest** — unit test suite for the valuation engine

## Architecture

backend/
├── app/
│ ├── main.py FastAPI routes
│ ├── schemas/ Pydantic request/response models
│ └── services/
│ ├── dcf.py Pure DCF calculation logic
│ └── market_data.py Live data retrieval via yfinance
└── tests/
└── test_dcf.py Unit tests covering valuation edge cases


The valuation math (`dcf.py`) is fully decoupled from data fetching
(`market_data.py`), so the calculation engine can be unit tested without
hitting any external API.

## Running locally

```bash
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Then visit `http://127.0.0.1:8000/docs` for interactive API docs.

## Example

`POST /api/v1/valuation`

```json
{
  "ticker": "AAPL",
  "revenue_growth_rate": 0.08,
  "operating_margin": 0.30,
  "wacc": 0.09,
  "terminal_growth_rate": 0.025
}
```

Returns enterprise value, equity value, implied share price, and a full
year-by-year cash flow projection.

## Tests

```bash
pytest backend/tests -v
```

## Roadmap

- [x] Live market data integration
- [x] DCF valuation engine with unit tests
- [ ] Next.js frontend with interactive assumption sliders
- [ ] Docker + cloud deployment (Render + Vercel)