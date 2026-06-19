import { DealRequest } from "@/types/deal";

export interface DemoDeal {
  id: string;
  label: string;
  description: string;
  deal: DealRequest;
}

export const demoDeals: DemoDeal[] = [
  {
    id: "software-scale",
    label: "Software Scale",
    description: "Large-cap software platform acquiring a cloud workflow asset.",
    deal: {
      acquirer: {
        name: "Northstar Systems",
        ticker: "NSS",
        share_price: 142,
        shares_outstanding: 820,
        net_income: 9650,
        cash_balance: 31000,
        debt_balance: 14500,
      },
      target: {
        name: "Vector Cloud",
        ticker: "VCLD",
        share_price: 64,
        shares_outstanding: 245,
        net_income: 980,
        revenue: 6200,
        cash_balance: 2100,
        debt_balance: 900,
      },
      assumptions: {
        purchase_premium: 0.3,
        cash_financing_pct: 0.35,
        debt_financing_pct: 0.35,
        stock_financing_pct: 0.3,
        interest_rate: 0.0525,
        tax_rate: 0.24,
        annual_pre_tax_synergies: 850,
      },
    },
  },
  {
    id: "stock-heavy",
    label: "Stock-Heavy",
    description: "Growth buyer preserving liquidity through equity consideration.",
    deal: {
      acquirer: {
        name: "Atlas Commerce",
        ticker: "ATLS",
        share_price: 78,
        shares_outstanding: 610,
        net_income: 3350,
        cash_balance: 10500,
        debt_balance: 6400,
      },
      target: {
        name: "Beacon Marketplaces",
        ticker: "BCNM",
        share_price: 29,
        shares_outstanding: 310,
        net_income: 410,
        revenue: 3900,
        cash_balance: 1200,
        debt_balance: 700,
      },
      assumptions: {
        purchase_premium: 0.25,
        cash_financing_pct: 0.1,
        debt_financing_pct: 0.15,
        stock_financing_pct: 0.75,
        interest_rate: 0.06,
        tax_rate: 0.25,
        annual_pre_tax_synergies: 300,
      },
    },
  },
  {
    id: "high-synergy",
    label: "High-Synergy",
    description: "Industrial technology combination with meaningful cost overlap.",
    deal: {
      acquirer: {
        name: "Meridian Automation",
        ticker: "MRDN",
        share_price: 96,
        shares_outstanding: 475,
        net_income: 4100,
        cash_balance: 16000,
        debt_balance: 9200,
      },
      target: {
        name: "Forge Robotics",
        ticker: "FRGE",
        share_price: 42,
        shares_outstanding: 180,
        net_income: 360,
        revenue: 2800,
        cash_balance: 650,
        debt_balance: 1100,
      },
      assumptions: {
        purchase_premium: 0.35,
        cash_financing_pct: 0.3,
        debt_financing_pct: 0.45,
        stock_financing_pct: 0.25,
        interest_rate: 0.0575,
        tax_rate: 0.23,
        annual_pre_tax_synergies: 950,
      },
    },
  },
];

export const emptyDeal: DealRequest = structuredClone(demoDeals[0].deal);

