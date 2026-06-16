import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-dark/70 dark:text-surface-light/70">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200',
          'bg-black/5 dark:bg-white/5',
          'border border-transparent',
          'text-dark dark:text-surface-light',
          'placeholder:text-dark/30 dark:placeholder:text-surface-light/30',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white dark:focus:bg-dark-lighter',
          error && 'ring-2 ring-danger/30 border-danger',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger mt-1 animate-slide-down">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
