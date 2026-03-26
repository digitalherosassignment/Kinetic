/**
 * Format currency value
 */
export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date to display string
 */
export function formatDate(dateString, options = {}) {
  const defaults = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", {
    ...defaults,
    ...options,
  });
}

/**
 * Merge class names (simple version)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Generate a draw ID
 */
export function generateDrawId(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `KNC-${year}-${month}`;
}

/**
 * Calculate subscription amount
 */
export function getSubscriptionAmount(plan, billingCycle) {
  const prices = {
    essential: { monthly: 29, yearly: 278 },
    elite: { monthly: 59, yearly: 566 },
  };
  return prices[plan]?.[billingCycle] ?? 0;
}
