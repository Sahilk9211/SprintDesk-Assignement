// src/pages/Analytics.tsx
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useBoardStore } from "../stores/boardStore";
import { useSprintsQuery } from "../hooks/useTasksQuery";
import {
  getSprintVelocity,
  getStatusDistribution,
  getPriorityBreakdown,
  getCompletionTrend,
} from "../utils/analytics";
import Skeleton from "../components/ui/Skeleton";

const STATUS_COLORS = ["#94a3b8", "#3b82f6", "#f59e0b", "#22c55e"];
const PRIORITY_COLORS = { low: "#94a3b8", medium: "#f59e0b", high: "#ef4444" };

export default function Analytics() {
  const tasks = useBoardStore((s) => s.tasks);
  const { data: sprints = [], isLoading } = useSprintsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rect" height="280px" />
        ))}
      </div>
    );
  }

  const velocityData = getSprintVelocity(tasks, sprints);
  const statusData = getStatusDistribution(tasks);
  const priorityData = getPriorityBreakdown(tasks);
  const trendData = getCompletionTrend(tasks);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Analytics</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sprint Velocity */}
        <div
          className="rounded-lg border border-gray-200 bg-white p-4"
          role="img"
          aria-label={`Bar chart showing completed tasks per sprint: ${velocityData.map((d) => `${d.sprint}: ${d.completed}`).join(", ")}`}
        >
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            Sprint Velocity
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="sprint" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar
                dataKey="completed"
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
                animationDuration={600}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Status Distribution */}
        <div
          className="rounded-lg border border-gray-200 bg-white p-4"
          role="img"
          aria-label={`Bar chart showing completed tasks per sprint: ${velocityData.map((d) => `${d.sprint}: ${d.completed}`).join(", ")}`}
        >
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            Task Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry: any) => `${entry.status}: ${entry.count}`}
                animationDuration={600}
              >
                {statusData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={STATUS_COLORS[i % STATUS_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Breakdown */}
        <div
          className="rounded-lg border border-gray-200 bg-white p-4"
          role="img"
          aria-label={`Bar chart showing completed tasks per sprint: ${velocityData.map((d) => `${d.sprint}: ${d.completed}`).join(", ")}`}
        >
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            Priority Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="low"
                stackId="p"
                fill={PRIORITY_COLORS.low}
                animationDuration={600}
              />
              <Bar
                dataKey="medium"
                stackId="p"
                fill={PRIORITY_COLORS.medium}
                animationDuration={600}
              />
              <Bar
                dataKey="high"
                stackId="p"
                fill={PRIORITY_COLORS.high}
                radius={[4, 4, 0, 0]}
                animationDuration={600}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Trend */}
        <div
          className="rounded-lg border border-gray-200 bg-white p-4"
          role="img"
          aria-label={`Bar chart showing completed tasks per sprint: ${velocityData.map((d) => `${d.sprint}: ${d.completed}`).join(", ")}`}
        >
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            Completion Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ r: 3 }}
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
