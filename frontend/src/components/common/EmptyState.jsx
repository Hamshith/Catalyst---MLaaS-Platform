import { InboxIcon } from 'lucide-react';

export default function EmptyState({
  icon: Icon = InboxIcon,
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-dark/30 dark:text-surface-light/30" />
      </div>
      <h3 className="text-lg font-semibold text-dark/70 dark:text-surface-light/70 mb-1">
        {title}
      </h3>
      <p className="text-sm text-dark/40 dark:text-surface-light/40 max-w-sm mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}
