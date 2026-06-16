import { clsx } from 'clsx';

const variants = {
  queued: 'bg-info/10 text-info border border-info/20',
  preprocessing: 'bg-warning/10 text-warning border border-warning/20',
  training: 'bg-secondary/10 text-secondary border border-secondary/20',
  completed: 'bg-success/10 text-success border border-success/20',
  failed: 'bg-danger/10 text-danger border border-danger/20',
  default: 'bg-dark/10 text-dark/70 dark:bg-white/10 dark:text-surface-light/70 border border-dark/10 dark:border-white/10',
  low: 'bg-success/10 text-success border border-success/20',
  medium: 'bg-warning/10 text-warning border border-warning/20',
  high: 'bg-danger/10 text-danger border border-danger/20',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide',
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}
