export interface AcquirerInput {
  name: string;
  ticker: string;
  share_price: number;
  shares_outstanding: number;
  net_income: number;
  cash_balance: number;
  debt_balance: number;
}

export interface TargetInput extends AcquirerInput {
  revenue: number;
}

export interface DealAssumptions {
  purchase_premium: number;
  cash_financing_pct: number;
  debt_financing_pct: number;
  stock_financing_pct: number;
  interest_rate: number;
  tax_rate: number;
  annual_pre_tax_synergies: number;
}

export interface DealRequest {
  acquirer: AcquirerInput;
  target: TargetInput;
  assumptions: DealAssumptions;
}

export type Verdict = "Accretive" | "Dilutive" | "Neutral";

export interface DealCalculationResult {
  acquirer_standalone_eps: number;
  offer_price: number;
  equity_purchase_price: number;
  cash_used: number;
  debt_issued: number;
  stock_issued_value: number;
  new_shares_issued: number;
  new_interest_expense: number;
  after_tax_interest_expense: number;
  after_tax_synergies: number;
  pro_forma_net_income: number;
  pro_forma_shares: number;
  pro_forma_eps: number;
  accretion_dilution_pct: number;
  verdict: Verdict;
  break_even_pre_tax_synergies: number | null;
}

export interface SensitivityCell {
  purchase_premium: number;
  pre_tax_synergies: number;
  accretion_dilution_pct: number;
  verdict: Verdict;
}

export interface SensitivityResponse {
  purchase_premiums: number[];
  synergy_values: number[];
  grid: SensitivityCell[][];
  break_even_pre_tax_synergies: number | null;
}

export interface MemoResponse {
  memo: string;
  sections: Record<string, string>;
}

export interface DealOutputs {
  calculation: DealCalculationResult;
  sensitivity: SensitivityResponse;
  memo: MemoResponse;
}

export interface CompanyLookupResult {
  name: string;
  ticker: string;
  currency: string;
  exchange: string | null;
  share_price: number | null;
  shares_outstanding: number | null;
  net_income: number | null;
  revenue: number | null;
  cash_balance: number | null;
  debt_balance: number | null;
  source: string;
  as_of: string;
  missing_fields: string[];
}
