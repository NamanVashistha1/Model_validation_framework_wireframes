import { useState } from 'react';
import { Card } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import type { CloneResult, ComparableModel, MetricKey } from '../../../types/benchmarking';
import { displayValue, metricOrderForDisplay, metricHeader } from './benchmarkingUtils';

interface CloneCurrentModelSectionProps {
  id?: string; // defaults to "clone-section"
  baseline?: ComparableModel;
  clone?: CloneResult;
  mode?: 'config' | 'results';
  onConfigChange?: (config: any) => void;
}

// Modelling techniques for regression and classification
// Note: Add all meaningful techniques here - this should be comprehensive
const MODELLING_TECHNIQUES = [
  // Regression Techniques
  'Linear Regression',
  'Ridge Regression',
  'Lasso Regression',
  'Elastic Net',
  'Polynomial Regression',
  'Support Vector Regression (SVR)',
  'Decision Tree Regression',
  'Random Forest Regression',
  'Gradient Boosting Regression',
  'XGBoost Regression',
  'LightGBM Regression',
  'CatBoost Regression',
  'Neural Network Regression',

  // Classification Techniques
  'Logistic Regression',
  'Support Vector Machine (SVM)',
  'Decision Tree Classifier',
  'Random Forest Classifier',
  'Gradient Boosting Classifier',
  'XGBoost Classifier',
  'LightGBM Classifier',
  'CatBoost Classifier',
  'Neural Network Classifier',
  'K-Nearest Neighbors (KNN)',
  'Naive Bayes'
];

// Common hyperparameters that can be tuned across different techniques
const COMMON_HYPERPARAMETERS = [
  'Learning Rate',
  'Max Depth',
  'Number of Estimators',
  'Min Samples Split',
  'Min Samples Leaf',
  'Max Features',
  'Regularization Strength (C/Alpha)',
  'Kernel Type',
  'Gamma',
  'Degree (for Polynomial)',
  'Hidden Layer Sizes',
  'Activation Function',
  'Solver',
  'Max Iterations'
];

// Dataset features - these should be dynamically loaded from the current dataset
// For now, using sample features that would typically be in a credit risk model
const DATASET_FEATURES = [
  'age',
  'income',
  'employment_length',
  'debt_to_income_ratio',
  'credit_score',
  'loan_amount',
  'loan_term',
  'home_ownership',
  'annual_income',
  'verification_status',
  'purpose',
  'dti',
  'fico_range_low',
  'fico_range_high',
  'inq_last_6mths',
  'open_acc',
  'pub_rec',
  'revol_bal',
  'revol_util',
  'total_acc',
  'collections_12_mths_ex_med',
  'acc_now_delinq',
  'tot_coll_amt',
  'tot_cur_bal',
  'pub_rec_bankruptcies'
];

export function CloneCurrentModelSection({
  id = 'clone-section',
  baseline,
  clone,
  mode = 'results',
  onConfigChange
}: CloneCurrentModelSectionProps) {
  // Independent section toggles - each can be expanded independently
  const [showTechniques, setShowTechniques] = useState(false);
  const [showHyperparameters, setShowHyperparameters] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  // Selection state
  const [selectedModellingTechnique, setSelectedModellingTechnique] = useState<string>(''); // Single selection for modelling technique
  const [selectedHyperparameters, setSelectedHyperparameters] = useState<string[]>([]); // Multi-select hyperparameters
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]); // Multi-select dataset features
  const [selectAllFeaturesChecked, setSelectAllFeaturesChecked] = useState(false); // Master select all for features
  const [hyperparameterInputs, setHyperparameterInputs] = useState<Record<string, string>>({});

  // Toggle functions for multi-select
  const toggleHyperparameter = (hyperparameter: string) => {
    setSelectedHyperparameters(prev =>
      prev.includes(hyperparameter)
        ? prev.filter(h => h !== hyperparameter)
        : [...prev, hyperparameter]
    );
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  // Select all features functionality
  const selectAllFeatures = () => {
    setSelectedFeatures([...DATASET_FEATURES]);
  };

  const deselectAllFeatures = () => {
    setSelectedFeatures([]);
  };

  // Get default values for hyperparameters
  const getHyperparameterDefault = (param: string): string => {
    const defaults: Record<string, string> = {
      'Learning Rate': '0.01, 0.1, 0.2',
      'Max Depth': '3, 5, 7, 10',
      'Number of Estimators': '50, 100, 200',
      'Min Samples Split': '2, 5, 10',
      'Min Samples Leaf': '1, 2, 4',
      'Max Features': 'auto, sqrt, log2',
      'Regularization Strength (C/Alpha)': '0.01, 0.1, 1.0, 10.0',
      'Kernel Type': 'linear, rbf, poly',
      'Gamma': 'scale, auto, 0.001, 0.01, 0.1',
      'Degree (for Polynomial)': '2, 3, 4',
      'Hidden Layer Sizes': '50, 100, (100, 50), (50, 25)',
      'Activation Function': 'relu, tanh, sigmoid',
      'Solver': 'adam, sgd, lbfgs',
      'Max Iterations': '100, 500, 1000'
    };
    return defaults[param] || '';
  };

  // Initialize hyperparameter input when selected
  const handleHyperparameterToggle = (hyperparameter: string) => {
    toggleHyperparameter(hyperparameter);
    if (!selectedHyperparameters.includes(hyperparameter) && !hyperparameterInputs[hyperparameter]) {
      setHyperparameterInputs(prev => ({
        ...prev,
        [hyperparameter]: getHyperparameterDefault(hyperparameter)
      }));
    }
  };

  if (mode === 'config') {
    return (
      <div id={id} className="space-y-4">
        {/* Three independent columns with inline expandable content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Modelling Techniques */}
          <Card className="p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Select Modelling Technique</Label>
                <input
                  type="checkbox"
                  checked={showTechniques}
                  onChange={(e) => setShowTechniques(e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Choose the modelling technique to clone and test variations of.
                <br />
                <strong>Note:</strong> Add all meaningful regression and classification techniques here.
              </p>
            </div>

            {/* Content appears in same column when toggled */}
            {showTechniques && (
              <div className="border-t pt-4">
                <Select value={selectedModellingTechnique} onValueChange={setSelectedModellingTechnique}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a modelling technique" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELLING_TECHNIQUES.map((technique) => (
                      <SelectItem key={technique} value={technique}>
                        {technique}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </Card>

          {/* Column 2: Hyperparameters */}
          <Card className="p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Select Hyperparameters</Label>
                <input
                  type="checkbox"
                  checked={showHyperparameters}
                  onChange={(e) => setShowHyperparameters(e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Choose hyperparameters to test different values.
              </p>
            </div>

            {/* Content appears in same column when toggled */}
            {showHyperparameters && (
              <div className="border-t pt-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {COMMON_HYPERPARAMETERS.map((hyperparameter) => (
                    <div key={hyperparameter} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`hyperparam-${hyperparameter}`}
                          checked={selectedHyperparameters.includes(hyperparameter)}
                          onChange={() => handleHyperparameterToggle(hyperparameter)}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={`hyperparam-${hyperparameter}`} className="text-sm cursor-pointer">
                          {hyperparameter}
                        </Label>
                      </div>

                      {/* Show input field when hyperparameter is selected */}
                      {selectedHyperparameters.includes(hyperparameter) && (
                        <Input
                          value={hyperparameterInputs[hyperparameter] || ''}
                          onChange={(e) => setHyperparameterInputs(prev => ({
                            ...prev,
                            [hyperparameter]: e.target.value
                          }))}
                          placeholder="Enter values (comma-separated)"
                          className="w-full ml-6 text-xs"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Column 3: Dataset Features */}
          <Card className="p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Select Dataset Features</Label>
                <input
                  type="checkbox"
                  checked={showFeatures}
                  onChange={(e) => setShowFeatures(e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Choose features from the current dataset.
              </p>
            </div>

            {/* Content appears in same column when toggled */}
            {showFeatures && (
              <div className="border-t pt-4">
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    Choose features from the current dataset to include in the model.
                    These should be dynamically loaded from the actual dataset.
                  </p>

                  {/* Select All / Deselect All buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllFeatures}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAllFeatures}
                      className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto border rounded p-2">
                  {/* Master select all checkbox */}
                  <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
                    <input
                      type="checkbox"
                      id="select-all-features"
                      checked={selectedFeatures.length === DATASET_FEATURES.length && DATASET_FEATURES.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFeatures([...DATASET_FEATURES]);
                        } else {
                          setSelectedFeatures([]);
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="select-all-features" className="text-sm cursor-pointer font-medium">
                      Select All Features ({DATASET_FEATURES.length})
                    </Label>
                  </div>

                  {/* Individual feature checkboxes */}
                  {DATASET_FEATURES.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`feature-${feature}`}
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor={`feature-${feature}`} className="text-sm cursor-pointer font-mono">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Selection summary */}
                <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                  <strong>Selected:</strong> {selectedFeatures.length} of {DATASET_FEATURES.length} features
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Selection Summary */}
        {(selectedModellingTechnique || selectedHyperparameters.length > 0 || selectedFeatures.length > 0) && (
          <Card className="p-4 bg-gray-50">
            <Label className="text-sm font-medium mb-2 block">Current Selection Summary</Label>
            <div className="text-sm space-y-1">
              {selectedModellingTechnique && (
                <div><strong>Technique:</strong> {selectedModellingTechnique}</div>
              )}
              {selectedHyperparameters.length > 0 && (
                <div><strong>Hyperparameters:</strong> {selectedHyperparameters.join(', ')}</div>
              )}
              {selectedFeatures.length > 0 && (
                <div><strong>Features:</strong> {selectedFeatures.length} selected</div>
              )}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // Results mode
  if (!baseline || !clone) return null;

  const metrics: MetricKey[] = metricOrderForDisplay();
  const isBest = (row: ComparableModel) => row.id === clone.best.id;

  return (
    <div id={id} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">🔄 Clone Current Model</h3>
        <p className="text-sm text-muted-foreground">Model replication with parameter variations</p>
      </div>

      {/* Parameter Variations Tested */}
      <Card className="p-4">
        <h4 className="font-medium mb-2">Parameter Variations Tested</h4>
        {clone.techniques.length === 0 ? (
          <p className="text-sm text-muted-foreground">No techniques selected.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-64">Technique</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clone.techniques.map((t, idx) => (
                  <TableRow key={`${t}-${idx}`}>
                    <TableCell className="font-medium">{t}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {renderTechniqueDetails(t)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Performance Comparison */}
      <Card className="p-4">
        <h4 className="font-medium mb-2">Performance Comparison</h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-64">Variant</TableHead>
                {metrics.map((m) => (
                  <TableHead key={m}>{metricHeader(m)}</TableHead>
                ))}
                <TableHead>Best</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Baseline */}
              <TableRow>
                <TableCell className="font-medium">Your Model (Baseline)</TableCell>
                {metrics.map((m) => (
                  <TableCell key={`base-${m}`}>{displayValue(baseline.metrics[m], m)}</TableCell>
                ))}
                <TableCell>—</TableCell>
              </TableRow>

              {/* Variants */}
              {clone.variants.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  {metrics.map((m) => (
                    <TableCell key={`${row.id}-${m}`}>{displayValue(row.metrics[m], m)}</TableCell>
                  ))}
                  <TableCell>
                    {isBest(row) ? (
                      <span className="inline-block rounded-full bg-green-600 text-white text-xs px-2 py-0.5">
                        Best (AUC)
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Key Findings */}
      <Card className="p-4">
        <h4 className="font-medium mb-2">Key Findings</h4>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          {clone.techniques.length === 0 ? (
            <li>No techniques were selected. Please configure and re-run.</li>
          ) : (
            <>
              <li>
                Best variant: <strong>{clone.best.name}</strong> with AUC {displayValue(clone.best.metrics.auc, 'auc')}.
              </li>
              <li>
                Techniques tested: {clone.techniques.join(', ')}.
              </li>
              <li>
                Review tradeoffs across Precision/Recall and validate stability on out-of-time splits.
              </li>
            </>
          )}
        </ul>
      </Card>
    </div>
  );
}

function renderTechniqueDetails(tech: string) {
  if (/Regularization/i.test(tech)) return 'L1/L2 penalty grid: {0.0, 0.01, 0.1, 1.0}';
  if (/Feature Subset/i.test(tech)) return 'Subset sizes tested: 60%, 75%, 90% of features';
  if (/Threshold Optimization/i.test(tech)) return 'Threshold sweep: 0.2 → 0.8 (step 0.05)';
  if (/Class Weight/i.test(tech)) return 'Balanced class weights and tuned ratios';
  if (/Hyperparameter Grid/i.test(tech)) return 'Grid search on depth/trees/learning rate';
  if (/Cross-Validation/i.test(tech)) return 'CV folds: 3, 5, 10 with stratification';
  return 'Configured variant.';
}
