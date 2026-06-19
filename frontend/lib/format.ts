export const formatMoney = (value: number, decimals = 1) => {
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(2)}bn`;
  }
  return `$${value.toFixed(decimals)}mm`;
};

export const formatPercent = (value: number, decimals = 1) =>
  `${(value * 100).toFixed(decimals)}%`;

export const formatEps = (value: number) => `$${value.toFixed(2)}`;

export const formatShares = (value: number) => `${value.toFixed(1)}mm`;

