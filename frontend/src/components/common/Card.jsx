import { clsx } from 'clsx';

export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={clsx(
        'glass-card p-6',
        hover && 'hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
