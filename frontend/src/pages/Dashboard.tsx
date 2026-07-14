import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "@/components/layout/Header";
import KpiCards from "@/components/dashboard/KpiCards";
import ProgressTracker from "@/components/dashboard/ProgressTracker";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import UrgentDeadlines from "@/components/dashboard/UrgentDeadlines";
import DistributionChart from "@/components/dashboard/DistributionChart";
import WeeklyCompletionsChart from "@/components/dashboard/WeeklyCompletionsChart";
import { SkeletonBlockGroup, SkeletonKpiCards } from "@/components/common/SkeletonLoader";
import { fetchDashboardStats } from "@/api/dashboard";
import type { DashboardStats } from "@/types";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchDashboardStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load dashboard stats";
        toast.error(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <Header title="Dashboard" subtitle="Your team's workload at a glance" />
      <div className="p-4 md:p-8 space-y-6">
        {loading || !stats ? (
          <>
            <SkeletonKpiCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SkeletonBlockGroup />
              <SkeletonBlockGroup />
              <SkeletonBlockGroup />
            </div>
          </>
        ) : (
          <>
            <KpiCards stats={stats} />
            <ProgressTracker overallProgress={stats.overall_progress} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DistributionChart distribution={stats.status_distribution} />
              <WeeklyCompletionsChart data={stats.weekly_completions} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityFeed activity={stats.recent_activity} />
              <UrgentDeadlines tasks={stats.urgent_deadlines} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
