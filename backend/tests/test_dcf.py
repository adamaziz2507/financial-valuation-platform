"""Unit tests for the DCF valuation engine."""

import pytest

from backend.app.schemas.valuation import ValuationRequest
from backend.app.services.dcf import run_dcf


def make_request(**overrides) -> ValuationRequest:
    defaults = dict(
        ticker="TEST",
        revenue_growth_rate=0.08,
        operating_margin=0.25,
        wacc=0.09,
        terminal_growth_rate=0.025,
    )
    defaults.update(overrides)
    return ValuationRequest(**defaults)


def test_run_dcf_returns_five_year_projection():
    result = run_dcf(make_request(), base_revenue=1_000_000, net_debt=100_000, shares_outstanding=10_000)

    assert len(result.projections) == 5
    assert result.projections[0].year == 1
    assert result.projections[4].year == 5


def test_run_dcf_enterprise_value_is_positive_for_reasonable_inputs():
    result = run_dcf(make_request(), base_revenue=1_000_000, net_debt=100_000, shares_outstanding=10_000)

    assert result.enterprise_value > 0
    assert result.equity_value == pytest.approx(result.enterprise_value - 100_000)


def test_run_dcf_raises_when_wacc_equals_terminal_growth_rate():
    request = make_request(wacc=0.025, terminal_growth_rate=0.025)

    with pytest.raises(ValueError, match="WACC must be greater than the terminal growth rate"):
        run_dcf(request, base_revenue=1_000_000, net_debt=100_000, shares_outstanding=10_000)


def test_run_dcf_raises_when_wacc_below_terminal_growth_rate():
    request = make_request(wacc=0.02, terminal_growth_rate=0.05)

    with pytest.raises(ValueError, match="WACC must be greater than the terminal growth rate"):
        run_dcf(request, base_revenue=1_000_000, net_debt=100_000, shares_outstanding=10_000)


def test_run_dcf_handles_negative_revenue_growth():
    request = make_request(revenue_growth_rate=-0.05)

    result = run_dcf(request, base_revenue=1_000_000, net_debt=100_000, shares_outstanding=10_000)

    assert result.projections[0].revenue < 1_000_000
    assert result.enterprise_value > 0


def test_run_dcf_implied_share_price_is_zero_when_no_shares_outstanding():
    result = run_dcf(make_request(), base_revenue=1_000_000, net_debt=100_000, shares_outstanding=0)

    assert result.implied_share_price == 0.0