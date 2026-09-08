"""FastAPI application entry point."""

from fastapi import FastAPI, HTTPException

from backend.app.schemas.valuation import ValuationRequest, ValuationResponse
from backend.app.services.dcf import run_dcf
from backend.app.services.market_data import fetch_company_financials, TickerNotFoundError

app = FastAPI(title="Financial Valuation Platform API")


@app.get("/api/v1/company/{ticker}")
def get_company_financials(ticker: str):
    try:
        return fetch_company_financials(ticker)
    except TickerNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@app.post("/api/v1/valuation", response_model=ValuationResponse)
def create_valuation(request: ValuationRequest):
    try:
        financials = fetch_company_financials(request.ticker)
    except TickerNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    try:
        return run_dcf(
            request=request,
            base_revenue=financials.ttm_revenue,
            net_debt=financials.net_debt,
            shares_outstanding=financials.shares_outstanding,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))