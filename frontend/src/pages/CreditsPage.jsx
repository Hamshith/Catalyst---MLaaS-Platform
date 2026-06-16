import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCreditBalance, getCreditHistory } from '../api/credits';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import DataTable from '../components/tables/DataTable';
import { SkeletonCard, SkeletonTable } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import { formatDate } from '../utils/dateUtils';
import { MODEL_DISPLAY_NAMES } from '../constants/request';
import { Coins, TrendingDown, TrendingUp, Zap } from 'lucide-react';

const MODEL_COSTS = [
  { tier: 'Low', cost: 5, models: ['Logistic Regression', 'Linear Regression', 'K-Means'] },
  { tier: 'Medium', cost: '10–15', models: ['Random Forest', 'XGBoost'] },
  { tier: 'High', cost: 20, models: ['SVM', 'SVR', 'DBSCAN'] },
];

export default function CreditsPage() {
  const {
    data: balance,
    isLoading: balLoading,
    error: balError,
    refetch: refetchBal,
  } = useQuery({
    queryKey: ['credit-balance'],
    queryFn: () => getCreditBalance().then((r) => r.data),
    refetchInterval: 10000,
  });

  const {
    data: history,
    isLoading: histLoading,
    error: histError,
    refetch: refetchHist,
  } = useQuery({
    queryKey: ['credit-history'],
    queryFn: () => getCreditHistory().then((r) => r.data),
    refetchInterval: 10000,
  });

  const columns = useMemo(
    () => [
      {
        key: 'transaction_type',
        label: 'Type',
        render: (val) => (
          <div className="flex items-center gap-2">
            {val === 'DEBIT' ? (
              <TrendingDown className="w-3.5 h-3.5 text-danger" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5 text-success" />
            )}
            <Badge variant={val === 'DEBIT' ? 'failed' : 'completed'}>
              {val}
            </Badge>
          </div>
        ),
      },
      {
        key: 'credits_used',
        label: 'Amount',
        render: (val, row) => {
          const amount = val || row.credits_added || 0;
          const isDebit = row.transaction_type === 'DEBIT';
          return (
            <span className={`font-bold ${isDebit ? 'text-danger' : 'text-success'}`}>
              {isDebit ? '−' : '+'}{amount}
            </span>
          );
        },
      },
      {
        key: 'model_type',
        label: 'Model',
        render: (val) =>
          val ? (
            <span className="capitalize">{MODEL_DISPLAY_NAMES[val] || val.replace(/_/g, ' ')}</span>
          ) : (
            <span className="text-dark/30 dark:text-surface-light/30">—</span>
          ),
      },
      {
        key: 'reason',
        label: 'Reason',
        render: (val) =>
          val ? (
            <span className="capitalize text-xs">{val.replace(/_/g, ' ').toLowerCase()}</span>
          ) : (
            <span className="text-dark/30 dark:text-surface-light/30 text-xs">Training</span>
          ),
      },
      {
        key: 'created_at',
        label: 'Date',
        render: (val) => <span className="text-xs">{formatDate(val)}</span>,
      },
    ],
    []
  );

  if (balError) return <ErrorState message={balError.message} onRetry={refetchBal} />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Balance & Cost Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70">
              Credit Balance
            </h3>
          </div>
          {balLoading ? (
            <div className="h-16 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
          ) : (
            <div className="text-center">
              <p className="text-5xl font-black text-primary tracking-tight">
                {balance?.credits ?? 0}
              </p>
              <p className="text-xs text-dark/40 dark:text-surface-light/40 mt-2 uppercase tracking-wider">
                Credits Available
              </p>
            </div>
          )}
        </Card>

        {/* Model Cost Table */}
        <Card className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-secondary" />
            </div>
            <h3 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70">
              Credit Costs per Training
            </h3>
          </div>
          <div className="space-y-3">
            {MODEL_COSTS.map((tier) => (
              <div
                key={tier.tier}
                className="flex items-center justify-between p-3 rounded-xl bg-black/3 dark:bg-white/3"
              >
                <div>
                  <Badge variant={tier.tier.toLowerCase()}>{tier.tier} Tier</Badge>
                  <p className="text-xs text-dark/40 dark:text-surface-light/40 mt-1">
                    {tier.models.join(', ')}
                  </p>
                </div>
                <span className="text-lg font-bold text-dark dark:text-surface-light">
                  {tier.cost} <span className="text-xs font-normal text-dark/40 dark:text-surface-light/40">credits</span>
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <h3 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70 mb-4">
          Transaction History
        </h3>
        {histLoading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : histError ? (
          <ErrorState message={histError.message} onRetry={refetchHist} />
        ) : (
          <DataTable
            data={history || []}
            columns={columns}
            emptyTitle="No transactions yet"
            emptyDescription="Your credit history will appear here after your first training."
          />
        )}
      </Card>
    </div>
  );
}
