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

const STATUS_COLORS = [
  "#64748B", // Backlog
  "#6366F1", // In Progress
  "#F59E0B", // Review
  "#22C55E", // Done
];

const PRIORITY_COLORS = {
  low: "#64748B",
  medium: "#F59E0B",
  high: "#EF4444",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#1E293B",
  border: "1px solid #334155",
  borderRadius: "8px",
  color: "#F8FAFC",
};

const TOOLTIP_LABEL_STYLE = {
  color: "#F8FAFC",
};

const TOOLTIP_ITEM_STYLE = {
  color: "#CBD5E1",
};

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
      <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-dark-text">
        Analytics
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sprint Velocity */}
        <div
          className="
            rounded-lg border border-gray-200 bg-white p-4 shadow-sm
            dark:border-dark-border dark:bg-dark-surface dark:shadow-dark-sm
          "
          role="img"
          aria-label={`Bar chart showing completed tasks per sprint: ${velocityData
            .map((d) => `${d.sprint}: ${d.completed}`)
            .join(", ")}`}
        >
          <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-dark-muted">
            Sprint Velocity
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={velocityData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#CBD5E1"
                opacity={0.2}
              />

              <XAxis
                dataKey="sprint"
                tick={{
                  fontSize: 12,
                  fill: "#94A3B8",
                }}
                axisLine={{
                  stroke: "#334155",
                }}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fontSize: 12,
                  fill: "#94A3B8",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL_STYLE}
                itemStyle={TOOLTIP_ITEM_STYLE}
                cursor={{
                  fill: "#6366F1",
                  opacity: 0.08,
                }}
              />

              <Bar
                dataKey="completed"
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
                animationDuration={600}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Status Distribution */}
        <div
          className="
            rounded-lg border border-gray-200 bg-white p-4 shadow-sm
            dark:border-dark-border dark:bg-dark-surface dark:shadow-dark-sm
          "
          role="img"
          aria-label={`Pie chart showing task status distribution`}
        >
          <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-dark-muted">
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

              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL_STYLE}
                itemStyle={TOOLTIP_ITEM_STYLE}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Breakdown */}
        <div
          className="
            rounded-lg border border-gray-200 bg-white p-4 shadow-sm
            dark:border-dark-border dark:bg-dark-surface dark:shadow-dark-sm
          "
          role="img"
          aria-label={`Bar chart showing task priority breakdown`}
        >
          <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-dark-muted">
            Priority Breakdown
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#CBD5E1"
                opacity={0.2}
              />

              <XAxis
                dataKey="status"
                tick={{
                  fontSize: 12,
                  fill: "#94A3B8",
                }}
                axisLine={{
                  stroke: "#334155",
                }}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fontSize: 12,
                  fill: "#94A3B8",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL_STYLE}
                itemStyle={TOOLTIP_ITEM_STYLE}
                cursor={{
                  fill: "#6366F1",
                  opacity: 0.08,
                }}
              />

              <Legend
                wrapperStyle={{
                  color: "#CBD5E1",
                  fontSize: "12px",
                }}
              />

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
          className="
            rounded-lg border border-gray-200 bg-white p-4 shadow-sm
            dark:border-dark-border dark:bg-dark-surface dark:shadow-dark-sm
          "
          role="img"
          aria-label={`Line chart showing task completion trend`}
        >
          <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-dark-muted">
            Completion Trend
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#CBD5E1"
                opacity={0.2}
              />

              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 11,
                  fill: "#94A3B8",
                }}
                axisLine={{
                  stroke: "#334155",
                }}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fontSize: 12,
                  fill: "#94A3B8",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL_STYLE}
                itemStyle={TOOLTIP_ITEM_STYLE}
                cursor={{
                  stroke: "#6366F1",
                  strokeWidth: 1,
                  opacity: 0.4,
                }}
              />

              <Line
                type="monotone"
                dataKey="completed"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "#6366F1",
                  stroke: "#1E293B",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                  fill: "#818CF8",
                  stroke: "#F8FAFC",
                  strokeWidth: 2,
                }}
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
