export interface ValuationRequest {
  ticker: string;
  revenue_growth_rate: number;
  operating_margin: number;
  wacc: number;
  terminal_growth_rate: number;
}

export interface YearlyProjection {
  year: number;
  revenue: number;
  unlevered_free_cash_flow: number;
  discounted_cash_flow: number;
}

export interface ValuationResponse {
  ticker: string;
  enterprise_value: number;
  equity_value: number;
  implied_share_price: number;
  projections: YearlyProjection[];
}