import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DashboardStats } from "@/types";
import type { TaskStatus } from "@/types";
import { CHART_COLORS } from "@/utils/constants";

interface DistributionChartProps {
  distribution: DashboardStats["status_distribution"];
}

export default function DistributionChart({ distribution }: DistributionChartProps) {
  const data = Object.entries(distribution).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Task Distribution</h3>
      {data.length === 0 ? (
        <p className="text-sm text-slate-500">No task data to visualize yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={CHART_COLORS[entry.name as TaskStatus] ?? "#94A3B8"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
