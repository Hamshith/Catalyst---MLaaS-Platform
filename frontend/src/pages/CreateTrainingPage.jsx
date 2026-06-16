import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { uploadDataset, getDatasets } from '../api/datasets';
import { createTrainingRequest } from '../api/requests';
import { generateRecommendation } from '../api/recommendations';
import { validateCredits } from '../api/credits';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import FileUpload from '../components/common/FileUpload';
import toast from 'react-hot-toast';
import {
  Upload,
  Settings,
  Cpu,
  Eye,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Sparkles,
  Check,
  X,
  AlertTriangle,
  Coins,
  BarChart3,
} from 'lucide-react';
import {
  LEARNING_TYPE_OPTIONS,
  PROBLEM_TYPE_OPTIONS,
  CLASSIFICATION_MODEL_OPTIONS,
  REGRESSION_MODEL_OPTIONS,
  UNSUPERVISED_MODEL_OPTIONS,
  MISSING_VALUE_OPTIONS,
  ENCODING_METHOD_OPTIONS,
  FEATURE_SELECTION_OPTIONS,
  SCALING_METHOD_OPTIONS,
  MODEL_DISPLAY_NAMES,
} from '../constants/request';

const stepIcons = [Upload, BarChart3, Settings, Cpu, Eye];
const stepLabels = ['Dataset', 'Data Overview', 'Configure', 'Model & Preprocessing', 'Review'];

export default function CreateTrainingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [datasetId, setDatasetId] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [profile, setProfile] = useState(null);
  const [useExisting, setUseExisting] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [recGoal, setRecGoal] = useState('');
  const [creditError, setCreditError] = useState(null);

  // Credit costs matching backend MODEL_CREDITS
  const MODEL_CREDITS = {
    logistic_regression: 5, linear_regression: 5, kmeans: 5,
    random_forest_classifier: 10, random_forest_regressor: 10,
    xgboost_classifier: 15, xgboost_regressor: 15,
    svm_classifier: 20, svr: 20, dbscan: 20,
  };

  const { data: existingDatasets } = useQuery({
    queryKey: ['datasets'],
    queryFn: () => getDatasets().then((r) => r.data),
  });

  const uploadMut = useMutation({
    mutationFn: (f) => uploadDataset(f),
    onSuccess: (res) => {
      setDatasetId(res.data.dataset_id);
      setDatasetName(file?.name || 'Uploaded Dataset');
      setProfile(res.data.profile);
      toast.success('Dataset uploaded!');
      setStep(1);
    },
  });

  const createMut = useMutation({
    mutationFn: (data) => createTrainingRequest(data),
    onSuccess: () => {
      toast.success('Training request created!');
      navigate('/requests');
    },
  });

  const recommendMut = useMutation({
    mutationFn: (data) => generateRecommendation(data),
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      learning_type: '',
      problem_type: '',
      target_column: '',
      classification_model: '',
      regression_model: '',
      unsupervised_model: '',
      missing_value_strategy: 'none',
      encoding_method: 'none',
      feature_selection_method: 'none',
      scaling_method: 'none',
      pca: false,
    },
  });

  const learningType = watch('learning_type');
  const problemType = watch('problem_type');
  const allValues = watch();

  const handleUpload = () => {
    if (file) uploadMut.mutate(file);
  };

  const handleSelectExisting = (ds) => {
    setDatasetId(ds._id);
    setDatasetName(ds.filename);
    setProfile(ds.profile);
    setStep(1);
  };

  const handleRecommend = async () => {
    if (!datasetId) return;
    try {
      const { data } = await recommendMut.mutateAsync({
        dataset_id: datasetId,
        goal: recGoal || null,
        target_column: allValues.target_column || null,
      });
      setRecommendation(data);
      toast.success('AI recommendation generated!');
    } catch {
      // Error already handled by interceptor
    }
  };

  const handleAcceptRecommendation = () => {
    if (!recommendation) return;
    const data = recommendation;
    if (data.learning_type) setValue('learning_type', data.learning_type);
    if (data.problem_type) setValue('problem_type', data.problem_type);
    if (data.target_column) setValue('target_column', data.target_column);
    if (data.classification_model) setValue('classification_model', data.classification_model);
    if (data.regression_model) setValue('regression_model', data.regression_model);
    if (data.unsupervised_model) setValue('unsupervised_model', data.unsupervised_model);
    if (data.missing_value_strategy) setValue('missing_value_strategy', data.missing_value_strategy);
    if (data.encoding_method) setValue('encoding_method', data.encoding_method);
    if (data.feature_selection_method) setValue('feature_selection_method', data.feature_selection_method);
    if (data.scaling_method) setValue('scaling_method', data.scaling_method);
    if (data.pca !== undefined) setValue('pca', data.pca);
    toast.success('Recommendation applied to form!');
    setRecommendation(null);
  };

  const onSubmit = async (data) => {
    const payload = {
      dataset_id: datasetId,
      learning_type: data.learning_type,
      missing_value_strategy: data.missing_value_strategy,
      encoding_method: data.encoding_method,
      feature_selection_method: data.feature_selection_method,
      scaling_method: data.scaling_method,
      pca: data.pca,
    };

    let selectedModel;
    if (data.learning_type === 'supervised') {
      payload.problem_type = data.problem_type;
      payload.target_column = data.target_column;
      if (data.problem_type === 'classification') {
        payload.classification_model = data.classification_model;
        selectedModel = data.classification_model;
      } else {
        payload.regression_model = data.regression_model;
        selectedModel = data.regression_model;
      }
    } else {
      payload.unsupervised_model = data.unsupervised_model;
      selectedModel = data.unsupervised_model;
    }

    // Validate credits before submitting
    setCreditError(null);
    try {
      await validateCredits(selectedModel);
    } catch (err) {
      const cost = MODEL_CREDITS[selectedModel] || '?';
      setCreditError({ model: selectedModel, cost });
      return;
    }

    createMut.mutate(payload);
  };

  const modelOptions =
    learningType === 'unsupervised'
      ? UNSUPERVISED_MODEL_OPTIONS
      : problemType === 'classification'
        ? CLASSIFICATION_MODEL_OPTIONS
        : problemType === 'regression'
          ? REGRESSION_MODEL_OPTIONS
          : [];

  const modelFieldName =
    learningType === 'unsupervised'
      ? 'unsupervised_model'
      : problemType === 'classification'
        ? 'classification_model'
        : 'regression_model';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-2">
        {stepLabels.map((label, idx) => {
          const Icon = stepIcons[idx];
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                    ${idx <= step
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-black/5 dark:bg-white/5 text-dark/30 dark:text-surface-light/30'
                    }`}
                >
                  {idx < step ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-medium mt-1.5 ${idx <= step ? 'text-primary' : 'text-dark/30 dark:text-surface-light/30'}`}>
                  {label}
                </span>
              </div>
              {idx < stepLabels.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 mt-[-16px]">
                  <div className={`h-full rounded-full ${idx < step ? 'bg-primary' : 'bg-black/10 dark:bg-white/10'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div>
        {/* Step 0: Dataset */}
        {step === 0 && (
          <Card className="animate-slide-up">
            <h3 className="text-lg font-bold text-dark dark:text-surface-light mb-4">Upload Dataset</h3>

            <div className="flex gap-3 mb-6">
              <Button type="button" variant={!useExisting ? 'primary' : 'ghost'} size="sm" onClick={() => setUseExisting(false)}>
                Upload New
              </Button>
              <Button type="button" variant={useExisting ? 'primary' : 'ghost'} size="sm" onClick={() => setUseExisting(true)}>
                Use Existing
              </Button>
            </div>

            {!useExisting ? (
              <>
                <FileUpload file={file} onFileSelect={setFile} onClear={() => setFile(null)} />
                <Button
                  type="button"
                  onClick={handleUpload}
                  loading={uploadMut.isPending}
                  disabled={!file}
                  className="mt-4"
                >
                  <Upload className="w-4 h-4" /> Upload & Continue
                </Button>
              </>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                {existingDatasets?.map((ds) => (
                  <button
                    key={ds._id}
                    type="button"
                    onClick={() => handleSelectExisting(ds)}
                    className="w-full text-left p-3 rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10 border border-black/5 dark:border-white/5 transition-colors"
                  >
                    <p className="text-sm font-medium text-dark dark:text-surface-light">{ds.filename}</p>
                    <p className="text-xs text-dark/40 dark:text-surface-light/40">
                      {ds.profile?.rows} rows • {ds.profile?.columns} columns
                    </p>
                  </button>
                ))}
                {existingDatasets?.length === 0 && (
                  <p className="text-sm text-dark/40 dark:text-surface-light/40 text-center py-8">No datasets found</p>
                )}
              </div>
            )}

            {/* Dataset Profile Preview */}
            {profile && (
              <div className="mt-6 p-4 rounded-xl bg-black/3 dark:bg-white/3 animate-scale-in">
                <h4 className="text-sm font-semibold text-dark dark:text-surface-light mb-3">Dataset Profile</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-primary">{profile.rows}</p>
                    <p className="text-xs text-dark/40 dark:text-surface-light/40">Rows</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-secondary">{profile.columns}</p>
                    <p className="text-xs text-dark/40 dark:text-surface-light/40">Columns</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-info">{profile.numerical_columns}</p>
                    <p className="text-xs text-dark/40 dark:text-surface-light/40">Numerical</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-warning">{profile.missing_percentage}%</p>
                    <p className="text-xs text-dark/40 dark:text-surface-light/40">Missing</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Step 1: Data Overview */}
        {step === 1 && profile && (
          <Card className="animate-slide-up space-y-6">
            <h3 className="text-lg font-bold text-dark dark:text-surface-light">Data Overview</h3>

            {/* Stat Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Rows', value: profile.rows, color: 'text-primary' },
                { label: 'Total Columns', value: profile.columns, color: 'text-secondary' },
                { label: 'Numerical', value: profile.numerical_columns, color: 'text-info' },
                { label: 'Categorical', value: profile.categorical_columns, color: 'text-warning' },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl bg-black/3 dark:bg-white/3 text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value?.toLocaleString()}</p>
                  <p className="text-xs text-dark/40 dark:text-surface-light/40 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Missing Data */}
            <div>
              <h4 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70 mb-3">Missing Data</h4>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-black/3 dark:bg-white/3">
                <p className={`text-3xl font-black ${
                  profile.missing_percentage === 0 ? 'text-success' :
                  profile.missing_percentage <= 10 ? 'text-warning' : 'text-danger'
                }`}>
                  {profile.missing_percentage}%
                </p>
                <div>
                  <p className="text-sm font-medium text-dark dark:text-surface-light">
                    {profile.missing_percentage === 0 ? 'No missing values!' : 'Missing values detected'}
                  </p>
                  <p className="text-xs text-dark/40 dark:text-surface-light/40">
                    {profile.missing_percentage === 0
                      ? 'Your dataset is complete'
                      : 'Consider a missing value strategy in preprocessing'}
                  </p>
                </div>
              </div>

              {/* Per-column missing values */}
              {profile.missing_percentage > 0 && profile.missing_values_per_column && (
                <div className="mt-3 space-y-1.5">
                  {Object.entries(profile.missing_values_per_column)
                    .filter(([, count]) => count > 0)
                    .sort((a, b) => b[1] - a[1])
                    .map(([col, count]) => {
                      const pct = ((count / profile.rows) * 100).toFixed(1);
                      return (
                        <div key={col} className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/2 dark:bg-white/2">
                          <span className="text-sm font-medium text-dark dark:text-surface-light">{col}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  parseFloat(pct) <= 5 ? 'bg-warning' : 'bg-danger'
                                }`}
                                style={{ width: `${Math.min(parseFloat(pct), 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-dark/50 dark:text-surface-light/50 w-20 text-right">
                              {count} ({pct}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Column Details Table */}
            <div>
              <h4 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70 mb-3">Column Details</h4>
              <div className="overflow-x-auto rounded-xl border border-black/5 dark:border-white/5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-black/3 dark:bg-white/3">
                      <th className="text-left px-4 py-2.5 font-semibold text-dark/60 dark:text-surface-light/60">Column</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-dark/60 dark:text-surface-light/60">Type</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-dark/60 dark:text-surface-light/60">Unique</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-dark/60 dark:text-surface-light/60">Missing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.column_metadata?.map((col, i) => (
                      <tr
                        key={col.name}
                        className={`border-t border-black/3 dark:border-white/3 ${i % 2 === 0 ? '' : 'bg-black/1 dark:bg-white/1'}`}
                      >
                        <td className="px-4 py-2.5 font-medium text-dark dark:text-surface-light">{col.name}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                            ['int64', 'float64', 'int32', 'float32'].includes(col.dtype)
                              ? 'bg-info/10 text-info'
                              : 'bg-warning/10 text-warning'
                          }`}>
                            {col.dtype}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-dark/60 dark:text-surface-light/60">
                          {col.unique_values}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={col.missing_count > 0 ? 'text-danger font-semibold' : 'text-dark/30 dark:text-surface-light/30'}>
                            {col.missing_count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Configure */}
        {step === 2 && (
          <Card className="animate-slide-up space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-dark dark:text-surface-light">Configure Learning</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleRecommend} loading={recommendMut.isPending}>
                <Sparkles className="w-4 h-4" /> AI Recommend
              </Button>
            </div>

            {/* Goal input for AI Recommendation */}
            <Input
              label="Goal (for AI Recommendation)"
              placeholder="e.g., Predict customer churn, Cluster similar products"
              value={recGoal}
              onChange={(e) => setRecGoal(e.target.value)}
            />

            {/* AI Recommendation Result Card */}
            {recommendation && (
              <div className="p-5 rounded-2xl border-2 border-primary/20 bg-primary/3 dark:bg-primary/5 animate-scale-in space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-success" />
                    </div>
                    <h4 className="text-base font-bold text-dark dark:text-surface-light">AI Recommendation</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRecommendation(null)}
                    className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-dark/40 dark:text-surface-light/40" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Learning Type', recommendation.learning_type],
                    ['Problem Type', recommendation.problem_type || 'N/A'],
                    ['Target Column', recommendation.target_column || 'Auto'],
                    [
                      'Model',
                      MODEL_DISPLAY_NAMES[
                        recommendation.classification_model || recommendation.regression_model || recommendation.unsupervised_model
                      ] || 'N/A',
                    ],
                    ['Missing Values', recommendation.missing_value_strategy],
                    ['Encoding', recommendation.encoding_method],
                    ['Scaling', recommendation.scaling_method],
                    ['PCA', recommendation.pca ? 'Yes' : 'No'],
                  ].map(([label, value]) => (
                    <div key={label} className="p-3 rounded-xl bg-white/60 dark:bg-white/5">
                      <p className="text-xs text-dark/40 dark:text-surface-light/40 mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-dark dark:text-surface-light capitalize">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Reasoning */}
                {recommendation.reasoning && recommendation.reasoning.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70">AI Reasoning</h4>
                    {recommendation.reasoning.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-dark/70 dark:text-surface-light/70">{reason}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="button" onClick={handleAcceptRecommendation} className="flex-1">
                    <Check className="w-4 h-4" /> Accept & Auto-fill
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setRecommendation(null)} className="flex-1">
                    Dismiss
                  </Button>
                </div>
              </div>
            )}

            <Select label="Learning Type" options={LEARNING_TYPE_OPTIONS} {...register('learning_type')} error={errors.learning_type?.message} />

            {learningType === 'supervised' && (
              <>
                <Select label="Problem Type" options={PROBLEM_TYPE_OPTIONS} {...register('problem_type')} />
                <Select
                  label="Target Column"
                  options={(profile?.column_names || []).map((c) => ({ value: c, label: c }))}
                  {...register('target_column')}
                />
              </>
            )}
          </Card>
        )}

        {/* Step 3: Model & Preprocessing */}
        {step === 3 && (
          <Card className="animate-slide-up space-y-5">
            <h3 className="text-lg font-bold text-dark dark:text-surface-light">Model & Preprocessing</h3>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-dark/70 dark:text-surface-light/70 mb-3">
                Select Model
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {modelOptions.map((opt) => {
                  const currentVal = watch(modelFieldName);
                  const isSelected = currentVal === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue(modelFieldName, opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200
                        ${isSelected
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                          : 'border-black/5 dark:border-white/5 hover:border-primary/30'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-dark dark:text-surface-light">{opt.label}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md
                          ${opt.tier === 'Low' ? 'bg-success/10 text-success' : opt.tier === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                          {opt.tier}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-black/5 dark:border-white/5 pt-5">
              <h4 className="text-sm font-semibold text-dark/70 dark:text-surface-light/70 mb-4">Preprocessing</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Missing Values" options={MISSING_VALUE_OPTIONS} {...register('missing_value_strategy')} />
                <Select label="Encoding" options={ENCODING_METHOD_OPTIONS} {...register('encoding_method')} />
                <Select label="Feature Selection" options={FEATURE_SELECTION_OPTIONS} {...register('feature_selection_method')} />
                <Select label="Scaling" options={SCALING_METHOD_OPTIONS} {...register('scaling_method')} />
              </div>
              <label className="flex items-center gap-3 mt-4 cursor-pointer">
                <input type="checkbox" {...register('pca')} className="w-4 h-4 rounded border-black/20 text-primary focus:ring-primary/30" />
                <span className="text-sm text-dark/70 dark:text-surface-light/70">Apply PCA (Principal Component Analysis)</span>
              </label>
            </div>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <Card className="animate-slide-up space-y-4">
            <h3 className="text-lg font-bold text-dark dark:text-surface-light">Review & Submit</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Dataset', datasetName || 'Selected Dataset'],
                ['Learning Type', allValues.learning_type],
                ['Problem Type', allValues.problem_type || 'N/A'],
                ['Target Column', allValues.target_column || 'N/A'],
                ['Model', MODEL_DISPLAY_NAMES[allValues[modelFieldName]] || allValues[modelFieldName] || 'N/A'],
                ['Missing Values', allValues.missing_value_strategy],
                ['Encoding', allValues.encoding_method],
                ['Scaling', allValues.scaling_method],
                ['Feature Selection', allValues.feature_selection_method],
                ['PCA', allValues.pca ? 'Yes' : 'No'],
              ].map(([label, value]) => (
                <div key={label} className="p-3 rounded-xl bg-black/3 dark:bg-white/3">
                  <p className="text-xs text-dark/40 dark:text-surface-light/40 mb-0.5">{label}</p>
                  <p className="font-medium text-dark dark:text-surface-light capitalize">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={
                (step === 0 && !datasetId) ||
                (step === 2 && !learningType)
              }
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <div className="space-y-3">
              {creditError && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-warning/10 border border-warning/20 animate-slide-down">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-warning">Insufficient Credits</p>
                    <p className="text-dark/60 dark:text-surface-light/60 mt-0.5">
                      This model requires <span className="font-bold">{creditError.cost} credits</span>.{' '}
                      <Link to="/credits" className="text-primary font-semibold hover:underline">
                        View your balance →
                      </Link>
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Button type="button" onClick={handleSubmit(onSubmit)} loading={createMut.isPending}>
                  <Cpu className="w-4 h-4" /> Submit Training Request
                </Button>
                {(() => {
                  const m = allValues.classification_model || allValues.regression_model || allValues.unsupervised_model;
                  const cost = MODEL_CREDITS[m];
                  return cost ? (
                    <span className="flex items-center gap-1.5 text-xs text-dark/40 dark:text-surface-light/40">
                      <Coins className="w-3.5 h-3.5" /> {cost} credits
                    </span>
                  ) : null;
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
