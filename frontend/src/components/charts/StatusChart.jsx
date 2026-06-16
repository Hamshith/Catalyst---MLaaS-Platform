import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';

const COLORS = ['#3b82f6', '#f59e0b', '#F09D51', '#22c55e', '#ef4444'];

export default function StatusChart({ data = [], title = 'Status Distribution' }) {
  const chartData = data.filter((d) => d.value > 0);

  if (chartData.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70 mb-4">{title}</h3>
        <div className="h-48 flex items-center justify-center text-dark/30 dark:text-surface-light/30 text-sm">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
