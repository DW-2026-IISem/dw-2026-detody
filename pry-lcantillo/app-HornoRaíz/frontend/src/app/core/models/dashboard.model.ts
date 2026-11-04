export interface DashboardStats {
  totalClients: number;
  totalProducts: number;
  totalSales: number;
  revenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentSales?: unknown[];
  topProducts?: unknown[];
}
