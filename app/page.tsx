"use client";

import StatsCards from "@/components/dashboard/stats-cards";
import StatusChart from "@/components/dashboard/status-chart";
import DistrictChart from "@/components/dashboard/district-chart";
import RecentSubmissions from "@/components/dashboard/recent-submissions";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart />
        <DistrictChart />
      </div>
      <RecentSubmissions />
    </div>
  );
}
