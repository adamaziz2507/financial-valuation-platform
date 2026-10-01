"""Unit tests for market data caching behaviour."""

from unittest.mock import patch

from backend.app.services import market_data
from backend.app.services.cache import TTLCache


def test_provider_is_called_once_per_ticker_within_ttl():
    sample = market_data.CompanyFinancials(
        ticker="TEST",
        ttm_revenue=1_000.0,
        operating_margin=0.2,
        net_debt=100.0,
        shares_outstanding=10.0,
        current_price=50.0,
    )
    market_data._financials_cache = TTLCache(ttl_seconds=60)

    with patch.object(market_data, "_fetch_from_provider", return_value=sample) as mock_fetch:
        market_data.fetch_company_financials("test")
        market_data.fetch_company_financials("TEST")

    assert mock_fetch.call_count == 1