"""Request and response models for the valuation API."""

from pydantic import BaseModel, Field


class ValuationRequest(BaseModel):
    ticker: str = Field(..., description="Stock ticker, e.g. AAPL")
    revenue_growth_rate: float = Field(..., description="Annual revenue growth assumption, e.g. 0.08 for 8%")
    operating_margin: float = Field(..., description="Operating margin assumption, e.g. 0.25 for 25%")
    wacc: float = Field(..., description="Weighted average cost of capital, e.g. 0.09 for 9%")
    terminal_growth_rate: float = Field(..., description="Perpetuity growth rate, e.g. 0.025 for 2.5%")


class YearlyProjection(BaseModel):
    year: int
    revenue: float
    unlevered_free_cash_flow: float
    discounted_cash_flow: float


class ValuationResponse(BaseModel):
    ticker: str
    enterprise_value: float
    equity_value: float
    implied_share_price: float
    projections: list[YearlyProjection]