import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25 hover:shadow-primary/40',
  secondary:
    'bg-secondary text-white hover:bg-secondary-hover shadow-lg shadow-secondary/25',
  outline:
    'border-2 border-primary text-primary hover:bg-primary hover:text-white dark:border-primary dark:text-primary',
  ghost:
    'text-dark/70 dark:text-surface-light/70 hover:bg-black/5 dark:hover:bg-white/5',
  danger:
    'bg-danger text-white hover:bg-red-600 shadow-lg shadow-danger/25',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3 text-base rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
