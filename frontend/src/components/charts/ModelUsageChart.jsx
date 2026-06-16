import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../common/Card';

const COLORS = ['#F06543', '#F09D51', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function ModelUsageChart({ data = [], title = 'Model Usage' }) {
  if (data.length === 0) {
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
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: '#888' }}
            width={120}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
