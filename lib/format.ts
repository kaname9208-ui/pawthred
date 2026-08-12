export function formatUSD(n: number): string {
  return "$" + n.toFixed(2);
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
