import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRequests } from '../api/requests';
import { getDatasets } from '../api/datasets';
import { getModels, downloadModel } from '../api/models';
import DataTable from '../components/tables/DataTable';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import { SkeletonTable } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import { formatDate } from '../utils/dateUtils';
import { Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  REQUEST_STATUS_OPTIONS,
  LEARNING_TYPE_OPTIONS,
  MODEL_DISPLAY_NAMES,
  MODEL_TIER_MAP,
} from '../constants/request';

export default function RequestsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [learningFilter, setLearningFilter] = useState('');
  const [downloading, setDownloading] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['requests'],
    queryFn: () => getRequests().then((r) => r.data),
    refetchInterval: 5000,
  });

  const { data: datasets } = useQuery({
    queryKey: ['datasets'],
    queryFn: () => getDatasets().then((r) => r.data),
  });

  const { data: models } = useQuery({
    queryKey: ['models'],
    queryFn: () => getModels().then((r) => r.data),
    refetchInterval: 5000,
  });

  // Map dataset IDs to filenames
  const datasetMap = useMemo(() => {
    if (!datasets) return {};
    const map = {};
    datasets.forEach((ds) => {
      map[ds._id] = ds.filename;
    });
    return map;
  }, [datasets]);

  // Map request IDs to models
  const modelMap = useMemo(() => {
    if (!models) return {};
    const map = {};
    models.forEach((m) => {
      if (m.request_id) {
        map[m.request_id] = m;
      }
    });
    return map;
  }, [models]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (learningFilter && r.learning_type !== learningFilter) return false;
      return true;
    });
  }, [data, statusFilter, learningFilter]);

  const handleDownload = async (model) => {
    setDownloading(model._id);
    try {
      await downloadModel(model._id);
      toast.success('Model downloaded successfully');
    } catch {
      toast.error('Failed to download model');
    } finally {
      setDownloading(null);
    }
  };

  const columns = [
    {
      key: 'dataset_id',
      label: 'Dataset',
      render: (val) => (
        <span className="text-sm font-medium">{datasetMap[val] || 'Unknown'}</span>
      ),
    },
    {
      key: 'learning_type',
      label: 'Type',
      render: (val) => <span className="capitalize">{val}</span>,
    },
    {
      key: 'problem_type',
      label: 'Problem',
      render: (val) => <span className="capitalize">{val || '—'}</span>,
    },
    {
      key: 'model',
      label: 'Model',
      render: (_, row) => {
        const model = row.classification_model || row.regression_model || row.unsupervised_model;
        return MODEL_DISPLAY_NAMES[model] || '—';
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      key: 'trained_model',
      label: 'Trained Model',
      sortable: false,
      render: (_, row) => {
        const trainedModel = modelMap[row._id];
        if (!trainedModel) return <span className="text-dark/30 dark:text-surface-light/30 text-xs">—</span>;
        const modelKey = trainedModel.model_type || trainedModel.classification_model || trainedModel.regression_model || trainedModel.unsupervised_model;
        const tier = MODEL_TIER_MAP[modelKey] || 'Unknown';
        return (
          <div className="flex items-center gap-2">
            <Badge variant={tier.toLowerCase()}>{tier}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(trainedModel);
              }}
              disabled={downloading === trainedModel._id}
            >
              {downloading === trainedModel._id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        );
      },
    },
    {
      key: 'metrics',
      label: 'Metrics',
      sortable: false,
      render: (_, row) => {
        const trainedModel = modelMap[row._id];
        const metrics = trainedModel?.metrics || row.metrics || row.results?.metrics;
        if (!metrics || typeof metrics !== 'object') return <span className="text-dark/30 dark:text-surface-light/30 text-xs">—</span>;
        const entries = Object.entries(metrics);
        return (
          <div className="space-y-0.5">
            {entries.map(([k, v]) => (
              <span key={k} className="block text-xs">
                {k.replace(/_/g, ' ')}: <span className="font-semibold">{typeof v === 'number' ? v.toFixed(3) : v}</span>
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (val) => <span className="text-xs">{formatDate(val)}</span>,
    },
  ];

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="w-48">
          <Select
            placeholder="All Statuses"
            options={[{ value: '', label: 'All Statuses' }, ...REQUEST_STATUS_OPTIONS]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select
            placeholder="All Learning Types"
            options={[{ value: '', label: 'All Learning Types' }, ...LEARNING_TYPE_OPTIONS]}
            value={learningFilter}
            onChange={(e) => setLearningFilter(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <SkeletonTable rows={8} cols={8} />
      ) : (
        <DataTable
          data={filtered}
          columns={columns}
          searchable
          searchKeys={['learning_type', 'status']}
          onRowClick={(row) => navigate(`/requests/${row._id}`)}
          emptyTitle="No requests found"
          emptyDescription="Create your first training request to get started."
        />
      )}
    </div>
  );
}
