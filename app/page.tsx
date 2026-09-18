"use client";

import StatsCards from "@/components/dashboard/stats-cards";
import StatusChart from "@/components/dashboard/status-chart";
import DistrictChart from "@/components/dashboard/district-chart";
import ActionChart from "@/components/dashboard/action-chart";
import TrendChart from "@/components/dashboard/trend-chart";
import RecentSubmissions from "@/components/dashboard/recent-submissions";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Overview of all show cause notices
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatusChart />
        <ActionChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrendChart />
        <DistrictChart />
      </div>

      <RecentSubmissions />
    </div>
  );
}
