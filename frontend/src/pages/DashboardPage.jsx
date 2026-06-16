import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getRequests } from '../api/requests';
import { getDatasets } from '../api/datasets';
import { getModels } from '../api/models';
import StatCard from '../components/common/StatCard';
import StatusChart from '../components/charts/StatusChart';
import ModelUsageChart from '../components/charts/ModelUsageChart';
import TrendChart from '../components/charts/TrendChart';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import { SkeletonCard, SkeletonChart } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import { formatDate } from '../utils/dateUtils';
import {
  ListChecks,
  CheckCircle2,
  XCircle,
  Activity,
  Box,
  Lightbulb,
} from 'lucide-react';
import { MODEL_DISPLAY_NAMES } from '../constants/request';

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    data: requests,
    isLoading: reqLoading,
    error: reqError,
    refetch: refetchReq,
  } = useQuery({
    queryKey: ['requests'],
    queryFn: () => getRequests().then((r) => r.data),
    refetchInterval: 10000,
  });

  const {
    data: datasets,
    isLoading: dsLoading,
  } = useQuery({
    queryKey: ['datasets'],
    queryFn: () => getDatasets().then((r) => r.data),
  });

  const {
    data: models,
    isLoading: modelsLoading,
  } = useQuery({
    queryKey: ['models'],
    queryFn: () => getModels().then((r) => r.data),
  });

  const stats = useMemo(() => {
    if (!requests) return null;
    const total = requests.length;
    const completed = requests.filter((r) => r.status === 'completed').length;
    const failed = requests.filter((r) => r.status === 'failed').length;
    const active = requests.filter((r) =>
      ['queued', 'preprocessing', 'training'].includes(r.status)
    ).length;
    return { total, completed, failed, active };
  }, [requests]);

  const statusChartData = useMemo(() => {
    if (!requests) return [];
    const counts = {};
    requests.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [requests]);

  const modelUsageData = useMemo(() => {
    if (!requests) return [];
    const counts = {};
    requests.forEach((r) => {
      const model =
        r.classification_model || r.regression_model || r.unsupervised_model;
      if (model) {
        const displayName = MODEL_DISPLAY_NAMES[model] || model;
        counts[displayName] = (counts[displayName] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [requests]);

  const trendData = useMemo(() => {
    if (!requests) return [];
    const byDate = {};
    requests.forEach((r) => {
      const date = new Date(r.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      byDate[date] = (byDate[date] || 0) + 1;
    });
    return Object.entries(byDate)
      .map(([date, count]) => ({ date, count }))
      .slice(-14);
  }, [requests]);

  // Map dataset IDs to filenames
  const datasetMap = useMemo(() => {
    if (!datasets) return {};
    const map = {};
    datasets.forEach((ds) => {
      map[ds._id] = ds.filename;
    });
    return map;
  }, [datasets]);

  const recentRequests = useMemo(() => {
    if (!requests) return [];
    return [...requests]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [requests]);

  if (reqError) {
    return <ErrorState message={reqError.message} onRetry={refetchReq} />;
  }

  const loading = reqLoading || dsLoading || modelsLoading;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon={ListChecks} label="Total Requests" value={stats?.total || 0} color="primary" />
            <StatCard icon={CheckCircle2} label="Completed" value={stats?.completed || 0} color="success" />
            <StatCard icon={XCircle} label="Failed" value={stats?.failed || 0} color="danger" />
            <StatCard icon={Activity} label="Active" value={stats?.active || 0} color="warning" />
            <StatCard icon={Box} label="Models" value={models?.length || 0} color="info" />
            <StatCard icon={Lightbulb} label="Datasets" value={datasets?.length || 0} color="secondary" />
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonChart key={i} />)
        ) : (
          <>
            <StatusChart data={statusChartData} title="Request Status Distribution" />
            <ModelUsageChart data={modelUsageData} title="Model Usage" />
            <TrendChart data={trendData} title="Training Trends" color="#F06543" />
            <TrendChart data={trendData} title="Activity Over Time" color="#F09D51" />
          </>
        )}
      </div>

      {/* Recent Requests */}
      {!loading && recentRequests.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70">
              Recent Requests
            </h3>
            <button
              onClick={() => navigate('/requests')}
              className="text-xs font-medium text-primary hover:underline"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {recentRequests.map((req) => (
              <div
                key={req._id}
                onClick={() => navigate(`/requests/${req._id}`)}
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-primary/3 dark:hover:bg-primary/5 -mx-6 px-6 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dark dark:text-surface-light truncate">
                    {datasetMap[req.dataset_id] || 'Unknown'} •{' '}
                    {MODEL_DISPLAY_NAMES[
                      req.classification_model || req.regression_model || req.unsupervised_model
                    ] || 'N/A'}
                  </p>
                  <p className="text-xs text-dark/40 dark:text-surface-light/40">
                    {formatDate(req.created_at)}
                  </p>
                </div>
                <Badge variant={req.status}>{req.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
