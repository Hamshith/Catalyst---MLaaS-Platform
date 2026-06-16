import { clsx } from 'clsx';
import { Check, Clock, Cog, Cpu, AlertCircle } from 'lucide-react';

const steps = [
  { key: 'queued', label: 'Queued', icon: Clock },
  { key: 'preprocessing', label: 'Preprocessing', icon: Cog },
  { key: 'training', label: 'Training', icon: Cpu },
  { key: 'completed', label: 'Completed', icon: Check },
];

const statusOrder = ['queued', 'preprocessing', 'training', 'completed'];

export default function StatusTimeline({ currentStatus }) {
  const isFailed = currentStatus === 'failed';
  const currentIdx = statusOrder.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, idx) => {
        const isCompleted = !isFailed && currentIdx > idx;
        const isCurrent = !isFailed && currentIdx === idx;
        const isPast = isCompleted;
        const StepIcon = isFailed && isCurrent ? AlertCircle : step.icon;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isCompleted && 'bg-success text-white shadow-lg shadow-success/30',
                  isCurrent && !isFailed && 'bg-primary text-white shadow-lg shadow-primary/30 animate-pulse-glow',
                  isCurrent && isFailed && 'bg-danger text-white shadow-lg shadow-danger/30',
                  !isCompleted && !isCurrent && 'bg-black/5 dark:bg-white/5 text-dark/30 dark:text-surface-light/30'
                )}
              >
                <StepIcon className="w-5 h-5" />
              </div>
              <span
                className={clsx(
                  'text-[10px] font-medium mt-2 whitespace-nowrap',
                  (isCompleted || isCurrent) ? 'text-dark dark:text-surface-light' : 'text-dark/30 dark:text-surface-light/30'
                )}
              >
                {isFailed && step.key === currentStatus ? 'Failed' : step.label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mt-[-20px]">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-500',
                    isPast ? 'bg-success' : 'bg-black/10 dark:bg-white/10'
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
