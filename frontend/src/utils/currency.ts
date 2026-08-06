/**
 * formatCurrency — Centralized currency formatter using JavaScript Intl API
 * formatted specifically for Indian Rupee (INR - ₹) with Indian digit grouping.
 *
 * Examples:
 *  formatCurrency(0) -> "₹0.00"
 *  formatCurrency(1250) -> "₹1,250.00"
 *  formatCurrency(1250000) -> "₹12,50,000.00"
 */
export const formatCurrency = (amount: number): string => {
  const value = isNaN(amount) || amount === null || amount === undefined ? 0 : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
};

export default formatCurrency;
