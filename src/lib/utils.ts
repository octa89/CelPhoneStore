import { clsx } from "clsx";
export function cn(...args: any[]) {
  return clsx(args);
}
export const formatCurrency = (cents: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    cents / 100
  );
