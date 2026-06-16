import Card from './Card';

export default function StatCard({ icon: Icon, label, value, trend, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  };

  return (
    <Card className="flex items-start gap-4 group">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${colorMap[color]}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-dark/50 dark:text-surface-light/50 font-medium">{label}</p>
        <p className="text-2xl font-bold text-dark dark:text-surface-light mt-0.5">{value}</p>
        {trend !== undefined && (
          <p className="text-xs text-dark/40 dark:text-surface-light/40 mt-1">{trend}</p>
        )}
      </div>
    </Card>
  );
}
