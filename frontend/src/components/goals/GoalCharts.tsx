import React from 'react';
import type { SavingsGoal } from '@/types/goal';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '@/utils/currency';

interface GoalChartsProps {
  goals: SavingsGoal[];
}

const STATUS_COLORS: Record<string, string> = {
  Completed: '#10B981',
  'Almost Complete': '#8B5CF6',
  'In Progress': '#3B82F6',
  Overdue: '#F43F5E',
  'Not Started': '#9CA3AF',
};

export const GoalCharts: React.FC<GoalChartsProps> = ({ goals }) => {
  if (goals.length === 0) return null;

  // 1. Progress Distribution (Pie Chart)
  const statusCounts: Record<string, number> = {
    Completed: 0,
    'Almost Complete': 0,
    'In Progress': 0,
    Overdue: 0,
    'Not Started': 0,
  };

  goals.forEach((g) => {
    if (g.status === 'COMPLETED') statusCounts.Completed++;
    else if (g.status === 'ALMOST_COMPLETE') statusCounts['Almost Complete']++;
    else if (g.status === 'OVERDUE') statusCounts.Overdue++;
    else if (g.status === 'IN_PROGRESS') statusCounts['In Progress']++;
    else statusCounts['Not Started']++;
  });

  const pieData = Object.entries(statusCounts)
    .filter(([, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));

  // 2. Goal Comparison (Bar Chart)
  const barData = goals.slice(0, 6).map((g) => ({
    name: g.name.length > 12 ? `${g.name.slice(0, 12)}...` : g.name,
    Saved: g.currentAmount,
    Target: g.targetAmount,
  }));

  // 3. Savings Timeline (Line Chart)
  const contributionMap: Record<string, number> = {};
  goals.forEach((g) => {
    if (g.contributions) {
      g.contributions.forEach((c) => {
        const monthYear = c.date ? c.date.slice(0, 7) : new Date().toISOString().slice(0, 7);
        contributionMap[monthYear] = (contributionMap[monthYear] || 0) + c.amount;
      });
    }
  });

  const timelineData = Object.entries(contributionMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => {
      const [year, month] = date.split('-');
      const label = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', {
        month: 'short',
        year: '2-digit',
      });
      return { date: label, Savings: amount };
    });


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Donut Chart: Status Distribution */}
      <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2">
        <h3 className="text-sm font-extrabold tracking-tight text-foreground">
          Goal Status Breakdown
        </h3>
        <div className="h-[240px] pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#3B82F6'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Target vs Saved */}
      <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2">
        <h3 className="text-sm font-extrabold tracking-tight text-foreground">
          Goal Progress Comparison
        </h3>
        <div className="h-[240px] pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={formatCurrency} />
              <Tooltip
                formatter={(val: unknown) => [formatCurrency(Number(val) || 0), '']}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="Saved" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Target" fill="#3B82F6" opacity={0.3} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart: Monthly Savings Deposits */}
      <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2">
        <h3 className="text-sm font-extrabold tracking-tight text-foreground">
          Goal Contributions Trend
        </h3>
        <div className="h-[240px] pt-0">
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(val: unknown) => [formatCurrency(Number(val) || 0), 'Savings Added']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Savings"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#8B5CF6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              No deposit timeline recorded yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalCharts;
