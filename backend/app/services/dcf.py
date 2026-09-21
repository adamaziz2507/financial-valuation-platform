"""Core discounted cash flow valuation logic."""

from backend.app.schemas.valuation import ValuationRequest, ValuationResponse, YearlyProjection

PROJECTION_YEARS = 5


def run_dcf(request: ValuationRequest, base_revenue: float, net_debt: float, shares_outstanding: float) -> ValuationResponse:
    if request.wacc <= request.terminal_growth_rate:
        raise ValueError("WACC must be greater than the terminal growth rate")

    projections: list[YearlyProjection] = []
    revenue = base_revenue
    enterprise_value = 0.0

    for year in range(1, PROJECTION_YEARS + 1):
        revenue *= 1 + request.revenue_growth_rate
        ufcf = revenue * request.operating_margin
        discount_factor = (1 + request.wacc) ** year
        discounted_cf = ufcf / discount_factor

        enterprise_value += discounted_cf
        projections.append(
            YearlyProjection(
                year=year,
                revenue=revenue,
                unlevered_free_cash_flow=ufcf,
                discounted_cash_flow=discounted_cf,
            )
        )

    terminal_ufcf = projections[-1].unlevered_free_cash_flow * (1 + request.terminal_growth_rate)
    terminal_value = terminal_ufcf / (request.wacc - request.terminal_growth_rate)
    discounted_terminal_value = terminal_value / (1 + request.wacc) ** PROJECTION_YEARS

    enterprise_value += discounted_terminal_value
    equity_value = enterprise_value - net_debt
    implied_share_price = equity_value / shares_outstanding if shares_outstanding else 0.0

    return ValuationResponse(
        ticker=request.ticker.upper(),
        enterprise_value=enterprise_value,
        equity_value=equity_value,
        implied_share_price=implied_share_price,
        projections=projections,
    )

WACC_STEPS = [-0.01, 0.0, 0.01]
TERMINAL_GROWTH_STEPS = [-0.005, 0.0, 0.005]


def run_sensitivity_grid(
    request: ValuationRequest, base_revenue: float, net_debt: float, shares_outstanding: float
) -> list[dict]:
    grid = []

    for wacc_offset in WACC_STEPS:
        for growth_offset in TERMINAL_GROWTH_STEPS:
            scenario_wacc = request.wacc + wacc_offset
            scenario_terminal_growth = request.terminal_growth_rate + growth_offset

            if scenario_wacc <= scenario_terminal_growth:
                continue

            scenario_request = request.model_copy(
                update={"wacc": scenario_wacc, "terminal_growth_rate": scenario_terminal_growth}
            )
            result = run_dcf(scenario_request, base_revenue, net_debt, shares_outstanding)

            grid.append(
                {
                    "wacc": round(scenario_wacc, 4),
                    "terminal_growth_rate": round(scenario_terminal_growth, 4),
                    "implied_share_price": round(result.implied_share_price, 2),
                }
            )

    return grid