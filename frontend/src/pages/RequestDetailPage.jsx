import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRequest } from '../api/requests';
import { getModels, downloadModel } from '../api/models';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import StatusTimeline from '../components/common/StatusTimeline';
import { SkeletonCard } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import { formatDate } from '../utils/dateUtils';
import { MODEL_DISPLAY_NAMES, MODEL_TIER_MAP } from '../constants/request';
import { FileText, Database, Cpu, BarChart3, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RequestDetailPage() {
  const { id } = useParams();
  const [downloading, setDownloading] = useState(false);

  const { data: request, isLoading, error, refetch } = useQuery({
    queryKey: ['request', id],
    queryFn: () => getRequest(id).then((r) => r.data),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') return false;
      return 3000;
    },
  });

  const { data: models } = useQuery({
    queryKey: ['models'],
    queryFn: () => getModels().then((r) => r.data),
    refetchInterval: 5000,
  });

  // Find the model associated with this request
  const trainedModel = models?.find((m) => m.request_id === id) || null;

  const handleDownload = async () => {
    if (!trainedModel) return;
    setDownloading(true);
    try {
      await downloadModel(trainedModel._id);
      toast.success('Model downloaded successfully');
    } catch {
      toast.error('Failed to download model');
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!request) return <ErrorState title="Not Found" message="Request not found" />;

  const model = request.classification_model || request.regression_model || request.unsupervised_model;
  const modelName = MODEL_DISPLAY_NAMES[model] || model;
  const tier = MODEL_TIER_MAP[model] || 'Unknown';

  const metrics = trainedModel?.metrics || request.metrics || request.results?.metrics || null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Status Timeline */}
      <Card>
        <h3 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70 mb-6">Training Pipeline</h3>
        <StatusTimeline currentStatus={request.status} />
      </Card>

      {/* Request Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-4.5 h-4.5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70">Request Info</h3>
          </div>
          <div className="space-y-3">
            {[
              ['Status', null, <Badge key="s" variant={request.status}>{request.status}</Badge>],
              ['Created', formatDate(request.created_at)],
              ['Updated', formatDate(request.updated_at)],
            ].map(([label, value, custom]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs text-dark/40 dark:text-surface-light/40">{label}</span>
                {custom || <span className="text-sm font-medium text-dark dark:text-surface-light">{value}</span>}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Database className="w-4.5 h-4.5 text-secondary" />
            </div>
            <h3 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70">Configuration</h3>
          </div>
          <div className="space-y-3">
            {[
              ['Learning Type', request.learning_type],
              ['Problem Type', request.problem_type || 'N/A'],
              ['Target Column', request.target_column || 'N/A'],
              ['Missing Values', request.missing_value_strategy],
              ['Encoding', request.encoding_method],
              ['Scaling', request.scaling_method],
              ['PCA', request.pca ? 'Enabled' : 'Disabled'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs text-dark/40 dark:text-surface-light/40">{label}</span>
                <span className="text-sm font-medium text-dark dark:text-surface-light capitalize">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Model Info */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-info/10 flex items-center justify-center">
              <Cpu className="w-4.5 h-4.5 text-info" />
            </div>
            <h3 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70">Model</h3>
          </div>
          {trainedModel && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download Model
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-lg font-bold text-dark dark:text-surface-light">{modelName}</p>
            <Badge variant={tier.toLowerCase()}>{tier} Tier</Badge>
          </div>
        </div>
      </Card>

      {/* Metrics */}
      {metrics && (
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center">
              <BarChart3 className="w-4.5 h-4.5 text-success" />
            </div>
            <h3 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70">Metrics</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="p-4 rounded-xl bg-black/3 dark:bg-white/3 text-center">
                <p className="text-2xl font-bold text-primary">
                  {typeof value === 'number' ? value.toFixed(4) : value}
                </p>
                <p className="text-xs text-dark/40 dark:text-surface-light/40 mt-1 uppercase">
                  {key.replace(/_/g, ' ')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Error message if failed */}
      {request.status === 'failed' && request.error && (
        <Card className="border-danger/20 bg-danger/5">
          <h3 className="text-sm font-semibold text-danger mb-2">Error Details</h3>
          <p className="text-sm text-danger/80 font-mono">{request.error}</p>
        </Card>
      )}
    </div>
  );
}
