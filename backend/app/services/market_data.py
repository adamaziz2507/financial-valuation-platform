"""Live market data retrieval via the Financial Modeling Prep API."""

import os
from dataclasses import dataclass

import requests

from backend.app.services.cache import TTLCache

FMP_BASE_URL = "https://financialmodelingprep.com/stable"
CACHE_TTL_SECONDS = 3600


@dataclass(frozen=True)
class CompanyFinancials:
    ticker: str
    ttm_revenue: float
    operating_margin: float
    net_debt: float
    shares_outstanding: float
    current_price: float


class TickerNotFoundError(Exception):
    """Raised when the ticker cannot be resolved via the data provider."""


_financials_cache: TTLCache[CompanyFinancials] = TTLCache(ttl_seconds=CACHE_TTL_SECONDS)


def _get_api_key() -> str:
    api_key = os.environ.get("FMP_API_KEY")
    if not api_key:
        raise RuntimeError("FMP_API_KEY environment variable is not set")
    return api_key


def _fetch_first_result(endpoint: str, ticker: str, api_key: str, **extra_params) -> dict:
    params = {"symbol": ticker, "apikey": api_key, **extra_params}
    response = requests.get(f"{FMP_BASE_URL}/{endpoint}", params=params, timeout=10)
    response.raise_for_status()
    data = response.json()

    if not data:
        raise TickerNotFoundError(f"Could not resolve ticker '{ticker}'")

    return data[0]


def _fetch_from_provider(ticker: str) -> CompanyFinancials:
    api_key = _get_api_key()

    quote = _fetch_first_result("quote", ticker, api_key)
    income_statement = _fetch_first_result("income-statement", ticker, api_key, limit=1)
    balance_sheet = _fetch_first_result("balance-sheet-statement", ticker, api_key, limit=1)

    revenue = income_statement["revenue"]
    operating_income = income_statement["operatingIncome"]
    operating_margin = operating_income / revenue if revenue else 0.0

    return CompanyFinancials(
        ticker=ticker,
        ttm_revenue=float(revenue),
        operating_margin=float(operating_margin),
        net_debt=float(balance_sheet["netDebt"]),
        shares_outstanding=float(income_statement["weightedAverageShsOut"]),
        current_price=float(quote["price"]),
    )


def fetch_company_financials(ticker: str) -> CompanyFinancials:
    normalised_ticker = ticker.upper()

    cached = _financials_cache.get(normalised_ticker)
    if cached is not None:
        return cached

    financials = _fetch_from_provider(normalised_ticker)
    _financials_cache.set(normalised_ticker, financials)
    return financials