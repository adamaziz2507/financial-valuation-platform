"""Live market data retrieval for DCF valuation inputs."""

from dataclasses import dataclass

import yfinance as yf


@dataclass(frozen=True)
class CompanyFinancials:
    ticker: str
    ttm_revenue: float
    operating_margin: float
    net_debt: float
    shares_outstanding: float
    current_price: float


class TickerNotFoundError(Exception):
    """Raised when yfinance cannot resolve the given ticker."""


def fetch_company_financials(ticker: str) -> CompanyFinancials:
    stock = yf.Ticker(ticker)
    info = stock.info

    if not info or info.get("regularMarketPrice") is None:
        raise TickerNotFoundError(f"Could not resolve ticker '{ticker}'")

    return CompanyFinancials(
        ticker=ticker.upper(),
        ttm_revenue=float(info.get("totalRevenue", 0.0)),
        operating_margin=float(info.get("operatingMargins", 0.0)),
        net_debt=float(info.get("totalDebt", 0.0) - info.get("totalCash", 0.0)),
        shares_outstanding=float(info.get("sharesOutstanding", 0.0)),
        current_price=float(info.get("regularMarketPrice", 0.0)),
    )