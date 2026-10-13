export type SeedCounts = {
  users: number;
  clients: number;
  product_types: number;
  products: number;
  sales: number;
  product_sales: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  users: 2,
  clients: 10,
  product_types: 25,
  products: 15,
  sales: 5,
  product_sales: 12,
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };
  for (const arg of argv) {
    const m = arg.match(/^--([a-zA-Z_]+)=(\d+)$/);
    if (!m) continue;
    const key = m[1] as keyof SeedCounts;
    const value = Number(m[2]);
    if (key in counts) {
      counts[key] = value;
    }
  }
  return counts;
}
