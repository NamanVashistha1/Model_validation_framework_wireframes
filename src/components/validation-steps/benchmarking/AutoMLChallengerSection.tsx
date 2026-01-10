import { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import type { AutomlResult, ComparableModel, MetricKey } from '../../../types/benchmarking';
import { displayValue, metricOrderForDisplay, metricHeader } from './benchmarkingUtils';

interface AutoMLChallengerSectionProps {
  id?: string; // defaults to "automl-section"
  baseline?: ComparableModel;
  automl?: AutomlResult;
  mode?: 'config' | 'results';
  onConfigChange?: (config: {
    period?: string;
    observations?: number;
    algorithms?: Record<string, boolean>;
    metric?: string;
  }) => void;
}

export function AutoMLChallengerSection({ id = 'automl-section', baseline, automl }: AutoMLChallengerSectionProps) {
  const metrics: MetricKey[] = metricOrderForDisplay();

  const isBest = (row: ComparableModel) => row?.id === automl?.best.id;

  // New state for AutoML configuration
  const [modelCode, setModelCode] = useState('');
  const [description, setDescription] = useState('');
  const [pythonRuntime, setPythonRuntime] = useState('default');
  const [task, setTask] = useState('classification');
  const [configurePipeline, setConfigurePipeline] = useState(false);
  const [datasetFormat, setDatasetFormat] = useState('pandas');
  const [scoringMetric, setScoringMetric] = useState('negative_log_loss');
  const [randomState, setRandomState] = useState('');
  const [numAlgosToTune, setNumAlgosToTune] = useState('');
  const [optimizationLevel, setOptimizationLevel] = useState('10');
  const [minFeatures, setMinFeatures] = useState('');
  const [adaptiveSampling, setAdaptiveSampling] = useState('true');
  const [modelTechniques, setModelTechniques] = useState<string[]>([]);
  const [preprocessing, setPreprocessing] = useState('true');
  const [searchSpace, setSearchSpace] = useState('');
  const [maxTuningTrials, setMaxTuningTrials] = useState('');
  const [searchStrategy, setSearchStrategy] = useState('');

  const scoringMetricOptions = [
    'negative_log_loss',
    'f1_samples',
    'f1_macro',
    'f1_micro',
    'f1_weighted',
    'precision_samples',
    'precision_macro',
    'precision_micro',
    'precision_weighted',
    'recall_samples',
    'recall_macro',
    'recall_micro',
    'recall_weighted',
    'roc_auc',
    'accuracy'
  ];

  const modelTechniqueOptions = [
    'Logistic Regression',
    'Random Forest',
    'XGBoost',
    'LightGBM',
    'CatBoost',
    'Neural Network',
    'SVM',
    'KNN',
    'Naive Bayes'
  ];

  const toggleModelTechnique = (technique: string) => {
    setModelTechniques(prev =>
      prev.includes(technique)
        ? prev.filter(t => t !== technique)
        : [...prev, technique]
    );
  };

  const handleBuildModel = () => {
    // Handle build model logic here
    console.log('Building AutoML model with config:', {
      modelCode,
      description,
      pythonRuntime,
      task,
      configurePipeline,
      ...(configurePipeline && {
        datasetFormat,
        scoringMetric,
        randomState,
        numAlgosToTune,
        optimizationLevel,
        minFeatures,
        adaptiveSampling,
        modelTechniques,
        preprocessing,
        searchSpace,
        maxTuningTrials,
        searchStrategy
      })
    });
  };

  return (
    <div id={id} className="space-y-4">
      {/* <div>
        <h3 className="text-lg font-semibold">🤖 AutoML Challenger Generation</h3>
        <p className="text-sm text-muted-foreground">Automatically test alternative algorithms</p>
      </div> */}

      {/* AutoML Model Configuration Form */}
      <Card className="p-6 space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          *Note: This section mimics the AutoML model creation screen from MMG
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Model Code</Label>
            <Input
              value={modelCode}
              onChange={(e) => setModelCode(e.target.value)}
              placeholder="Enter model code"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter model description"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Python Runtime</Label>
            <Select value={pythonRuntime} onValueChange={setPythonRuntime}>
              <SelectTrigger>
                <SelectValue placeholder="Select runtime" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="python3.8">Python 3.8</SelectItem>
                <SelectItem value="python3.9">Python 3.9</SelectItem>
                <SelectItem value="python3.10">Python 3.10</SelectItem>
                <SelectItem value="python3.11">Python 3.11</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Task</Label>
            <Select value={task} onValueChange={setTask}>
              <SelectTrigger>
                <SelectValue placeholder="Select task" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classification">Classification</SelectItem>
                <SelectItem value="regression">Regression</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Configure AutoML Pipeline Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="configure-pipeline"
            checked={configurePipeline}
            onCheckedChange={(checked: boolean | 'indeterminate') => setConfigurePipeline(Boolean(checked))}
          />
          <Label htmlFor="configure-pipeline">Configure AutoML Pipeline</Label>
        </div>

        {/* Advanced Configuration Fields - shown when checkbox is ticked */}
        {configurePipeline && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dataset Format</Label>
                <Select value={datasetFormat} onValueChange={setDatasetFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pandas">Pandas</SelectItem>
                    <SelectItem value="numpy">NumPy</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Scoring Metric</Label>
                <Select value={scoringMetric} onValueChange={setScoringMetric}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {scoringMetricOptions.map(metric => (
                      <SelectItem key={metric} value={metric}>
                        {metric}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Random State</Label>
                <Input
                  type="number"
                  value={randomState}
                  onChange={(e) => setRandomState(e.target.value)}
                  placeholder="Enter random state"
                />
              </div>
              <div className="space-y-2">
                <Label>No. of Algos to be Tuned</Label>
                <Input
                  type="number"
                  value={numAlgosToTune}
                  onChange={(e) => setNumAlgosToTune(e.target.value)}
                  placeholder="Enter number of algorithms"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Optimization Level</Label>
                <Input
                  type="number"
                  value={optimizationLevel}
                  onChange={(e) => setOptimizationLevel(e.target.value)}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Features</Label>
                <Input
                  type="number"
                  value={minFeatures}
                  onChange={(e) => setMinFeatures(e.target.value)}
                  placeholder="Enter minimum features"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Adaptive Sampling?</Label>
              <RadioGroup value={adaptiveSampling} onValueChange={setAdaptiveSampling}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="adaptive-true" />
                  <Label htmlFor="adaptive-true">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="adaptive-false" />
                  <Label htmlFor="adaptive-false">False</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Model Techniques</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {modelTechniqueOptions.map(technique => (
                  <div key={technique} className="flex items-center space-x-2">
                    <Checkbox
                      id={`technique-${technique}`}
                      checked={modelTechniques.includes(technique)}
                      onCheckedChange={() => toggleModelTechnique(technique)}
                    />
                    <Label htmlFor={`technique-${technique}`} className="text-sm">
                      {technique}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preprocessing</Label>
              <RadioGroup value={preprocessing} onValueChange={setPreprocessing}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="preprocessing-true" />
                  <Label htmlFor="preprocessing-true">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="preprocessing-false" />
                  <Label htmlFor="preprocessing-false">False</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Search Space</Label>
                <Input
                  value={searchSpace}
                  onChange={(e) => setSearchSpace(e.target.value)}
                  placeholder="Enter search space"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Tuning Trials</Label>
                <Input
                  type="number"
                  value={maxTuningTrials}
                  onChange={(e) => setMaxTuningTrials(e.target.value)}
                  placeholder="Enter max tuning trials"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Search Strategy</Label>
              <Input
                value={searchStrategy}
                onChange={(e) => setSearchStrategy(e.target.value)}
                placeholder="Enter search strategy"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          {/* <Button onClick={handleBuildModel} className="bg-blue-600 hover:bg-blue-700"  
            Build Model
          </Button> */}
          <Button onClick={() => {/* Generate AutoML logic */}} className="bg-green-600 hover:bg-green-700" style={{
      backgroundColor: "black", // blue-500
      color: "white",
      fontSize: "14px",
      fontWeight: 500,
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    }}>
            Generate
          </Button>
        </div>
      </Card>

    </div>
  );
}
