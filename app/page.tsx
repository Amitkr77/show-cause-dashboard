"use client";

import StatsCards from "@/components/dashboard/stats-cards";
import StatusChart from "@/components/dashboard/status-chart";
import DistrictChart from "@/components/dashboard/district-chart";
import ActionChart from "@/components/dashboard/action-chart";
import TrendChart from "@/components/dashboard/trend-chart";
import RecentSubmissions from "@/components/dashboard/recent-submissions";

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of all show cause notices
        </p>
      </div>

      <StatsCards />

      {/* Bento grid: trend takes 2/3, status pie takes 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <StatusChart />
      </div>

      {/* Second row: action + district side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ActionChart />
        <DistrictChart />
      </div>

      <RecentSubmissions />
    </div>
  );
}
