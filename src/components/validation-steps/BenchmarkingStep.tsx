import { useMemo, useState } from 'react';
import type { Model, Finding } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import type { BenchmarkResult } from '../../types/benchmarking';
import { makeBaseline, makePeerResult, makeAutomlResult, makeCloneResult } from './benchmarking/benchmarkingUtils';
import { PeerComparisonSection } from './benchmarking/PeerComparisonSection';
import { AutoMLChallengerSection } from './benchmarking/AutoMLChallengerSection';
import { CloneCurrentModelSection } from './benchmarking/CloneCurrentModelSection';
import { IntegratedSummarySection } from './benchmarking/IntegratedSummarySection';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { FileText, Upload } from 'lucide-react';
import { Textarea } from '../ui/textarea';

interface BenchmarkingStepProps {
  model: Model;
  onComplete: () => void;
  onAddFinding: (finding: Omit<Finding, 'id'>) => void;
  onSave?: () => void;
  onSaveAndContinue?: () => void;
  onCancel?: () => void;
}

const PEER_OPTIONS = [
  'Personal Loan PD Model',
  'Auto Loan PD Model',
  'Mortgage PD Model',
  'Credit Card v2.1 Model',
  'Small Business Loan Model',
];

const AUTOML_PERIODS = [
  'Last 3 months',
  'Last 6 months',
  'Last 12 months',
  'Last 24 months',
  'Custom range', // no date-picker now; future enhancement
];

const AUTOML_METRICS = [
  'Gini Coefficient',
  'KS Statistic',
  'AUC',
  'F1 Score',
  'Precision',
  'Recall',
];

const AUTOML_ALGOS_DEFAULT: Record<string, boolean> = {
  'Logistic Regression': true,
  'XGBoost': true,
  'Random Forest': true,
  'Neural Network': false,
  'LightGBM': false,
  'CatBoost': false,
};

const CLONE_TECHNIQUES = [
  'Regularization Tuning (Adjust L1/L2 penalty)',
  'Feature Subset Selection (Test reduced feature sets)',
  'Threshold Optimization (Adjust classification threshold)',
  'Class Weight Adjustment (Balance class weights)',
  'Hyperparameter Grid Search (Test parameter combinations)',
  'Cross-Validation Fold Changes (Adjust CV strategy)',
];

export function BenchmarkingStep({ model, onComplete, onAddFinding, onSave, onSaveAndContinue, onCancel }: BenchmarkingStepProps) {
  // Checkbox flags (defaults per spec)
  const [peer, setPeer] = useState(false);
  const [automl, setAutoml] = useState(true);
  const [cloneModel, setCloneModel] = useState(false);

  // Global configuration error (no method selected on Compare)
  const [showError, setShowError] = useState(false);

  // Per-panel form state and validation flags
  // A) Peer
  const [peerSelected, setPeerSelected] = useState<string[]>([]);
  const [peerError, setPeerError] = useState(false);

  // B) AutoML
  const [period, setPeriod] = useState<string>('Last 12 months');
  const [observations, setObservations] = useState<number>(50000); // 10K .. 100K
  const [algorithms, setAlgorithms] = useState<Record<string, boolean>>({ ...AUTOML_ALGOS_DEFAULT });
  const [metric, setMetric] = useState<string>('Gini Coefficient');
  const [automlError, setAutomlError] = useState(false);

  // C) Clone
  const [cloneTechniques, setCloneTechniques] = useState<Record<string, boolean>>(
    Object.fromEntries(CLONE_TECHNIQUES.map(t => [t, false]))
  );
  const [cloneError, setCloneError] = useState(false);

  // Results after Compare
  const [ran, setRan] = useState(false);
  const [result, setResult] = useState<BenchmarkResult | null>(null);

  // Benchmarking Observation Table state (copied pattern from Interpretability, adapted)
  type BmObservation = {
    area: string;           // e.g., "Peer vs Avg (AUC)" or "Best AutoML vs Baseline"
    delta: string;          // e.g., "-6.8%" or "+1.5%"
    acceptability: string;  // "Acceptable" | "Not Acceptable" | "NA"
    remarks: string;
  };
  const [bmObservations, setBmObservations] = useState<BmObservation[]>([
    { area: 'Peer vs Avg (AUC)', delta: '-6.8%', acceptability: '', remarks: '' },
    { area: 'Best AutoML vs Baseline', delta: '-8.8%', acceptability: '', remarks: '' },
  ]);

  const addBmObservationRow = () => {
    setBmObservations([...bmObservations, { area: '', delta: '', acceptability: '', remarks: '' }]);
  };

  const updateBmObservation = (index: number, field: keyof BmObservation, value: string) => {
    const updated = [...bmObservations];
    updated[index][field] = value;
    setBmObservations(updated);
  };

  // Derived
  const observationsK = useMemo(() => Math.round(observations / 1000), [observations]);
  const selectedAlgoCount = useMemo(
    () => Object.values(algorithms).filter(Boolean).length,
    [algorithms]
  );

  const estimatedRuntime = useMemo(() => {
    // Simple heuristic for estimated runtime:
    // base 6 min + 1.2 min per algorithm + 1 min per 20K extra observations beyond 10K
    const base = 6;
    const algoFactor = selectedAlgoCount * 1.2;
    const obsFactor = Math.max(0, Math.ceil((observations - 10000) / 20000));
    const runtime = base + algoFactor + obsFactor;
    const low = Math.max(3, Math.round(runtime - 1));
    const high = Math.round(runtime + 1);
    return `~${low}-${high} minutes`;
  }, [selectedAlgoCount, observations]);

  // Handlers
  const toggleArraySelection = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const handlePeerToggle = (v: boolean | 'indeterminate') => {
    const nv = Boolean(v);
    setPeer(nv);
    if (!nv) {
      setPeerSelected([]);
      setPeerError(false);
    }
  };

  const handleAutomlToggle = (v: boolean | 'indeterminate') => {
    const nv = Boolean(v);
    setAutoml(nv);
    if (!nv) {
      // keep selections but clear error
      setAutomlError(false);
    }
  };

  const handleCloneToggle = (v: boolean | 'indeterminate') => {
    const nv = Boolean(v);
    setCloneModel(nv);
    if (!nv) {
      // reset techniques and error
      setCloneTechniques(Object.fromEntries(CLONE_TECHNIQUES.map(t => [t, false])));
      setCloneError(false);
    }
  };

  const handleObservationsInput = (val: string) => {
    const parsed = parseInt(val.replace(/[^\d]/g, ''), 10);
    if (isNaN(parsed)) return;
    const clamped = Math.min(100000, Math.max(10000, parsed));
    setObservations(clamped);
  };

  const handleObservationsSlider = (vals: number[]) => {
    const v = Array.isArray(vals) ? vals[0] : 50000;
    // Slider here is configured with absolute numbers, not K
    setObservations(v);
  };

  const handleCompare = () => {
    const anySelected = peer || automl || cloneModel;
    if (!anySelected) {
      setShowError(true);
      return;
    }
    setShowError(false);

    // Validate selected panels
    let valid = true;

    if (peer) {
      const ok = peerSelected.length > 0;
      setPeerError(!ok);
      if (!ok) valid = false;
    } else {
      setPeerError(false);
    }

    if (automl) {
      const ok = selectedAlgoCount > 0;
      setAutomlError(!ok);
      if (!ok) valid = false;
    } else {
      setAutomlError(false);
    }

    if (cloneModel) {
      const count = Object.values(cloneTechniques).filter(Boolean).length;
      const ok = count > 0;
      setCloneError(!ok);
      if (!ok) valid = false;
    } else {
      setCloneError(false);
    }


    // If validations failed, stop here
    if (!valid) return;

    // Build results for selected sections
    const baseline = makeBaseline(model);

    const peerRes = peer ? makePeerResult(baseline, peerSelected) : undefined;

    const automlRes = automl
      ? makeAutomlResult(
          baseline,
          algorithms,
          metric,
          period,
          observations,
          estimatedRuntime
        )
      : undefined;

    const cloneRes = cloneModel ? makeCloneResult(baseline, cloneTechniques) : undefined;

    setResult({
      baseline,
      peer: peerRes,
      automl: automlRes,
      clone: cloneRes,
    });
    setRan(true);
  };

  const handleReset = () => {
    // Reset flags
    setPeer(false);
    setAutoml(true);
    setCloneModel(false);
    setShowError(false);

    // Reset forms
    setPeerSelected([]);
    setPeerError(false);

    setPeriod('Last 12 months');
    setObservations(50000);
    setAlgorithms({ ...AUTOML_ALGOS_DEFAULT });
    setMetric('Gini Coefficient');
    setAutomlError(false);

    setCloneTechniques(Object.fromEntries(CLONE_TECHNIQUES.map(t => [t, false])));
    setCloneError(false);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-semibold">📊 Benchmarking Configuration</h2>
      </div>

      {/* Configuration Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-base font-medium">Select Comparison Methods</h3>

        {/* Peer Models */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Checkbox id="peer" checked={peer} onCheckedChange={handlePeerToggle} />
            <Label htmlFor="peer">Peer Models (Internal comparison)</Label>
          </div>

          {peer && (
            <div className="ml-6 mt-2 p-4 rounded-md border space-y-3">
              <div className="text-sm font-medium">Select Peer Models to Compare</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {PEER_OPTIONS.map((opt) => {
                  const id = `peer-${opt}`;
                  const checked = peerSelected.includes(opt);
                  return (
                    <div key={opt} className="flex items-center gap-2">
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={() => toggleArraySelection(opt, peerSelected, setPeerSelected)}
                      />
                      <Label htmlFor={id} className="text-sm">
                        {opt}
                      </Label>
                    </div>
                  );
                })}
              </div>
              {peerError && (
                <div className="text-sm text-red-600" role="alert">
                  Select at least one peer model
                </div>
              )}
            </div>
          )}
        </div>

        {/* AutoML Challenger */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Checkbox id="automl" checked={automl} onCheckedChange={handleAutomlToggle} />
            <Label htmlFor="automl">AutoML Challenger (Generate alternatives)</Label>
          </div>

          {automl && (
            <div className="ml-6 mt-2 p-4 rounded-md border space-y-4">
              {/* Data Source */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Select Data Period</Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {AUTOML_PERIODS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="obs">Number of Observations</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="obs"
                      type="number"
                      min={10000}
                      max={100000}
                      step={1000}
                      value={observations}
                      onChange={(e) => handleObservationsInput(e.target.value)}
                      className="w-36"
                    />
                    <div className="flex-1">
                      <Slider
                        min={10000}
                        max={100000}
                        step={1000}
                        value={[observations]}
                        onValueChange={handleObservationsSlider}
                      />
                    </div>
                    <div className="w-16 text-right text-sm text-muted-foreground">{observationsK}K</div>
                  </div>
                </div>
              </div>

              {/* Algorithms */}
              <div className="space-y-2">
                <Label>Select Algorithms</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.keys(algorithms).map((algo) => {
                    const id = `algo-${algo}`;
                    const checked = Boolean(algorithms[algo]);
                    return (
                      <div key={algo} className="flex items-center gap-2">
                        <Checkbox
                          id={id}
                          checked={checked}
                          onCheckedChange={(v) =>
                            setAlgorithms((prev) => ({ ...prev, [algo]: Boolean(v) }))
                          }
                        />
                        <Label htmlFor={id} className="text-sm">
                          {algo}
                        </Label>
                      </div>
                    );
                  })}
                </div>
                {automlError && (
                  <div className="text-sm text-red-600" role="alert">
                    Select at least one algorithm
                  </div>
                )}
              </div>

              {/* Optimization Metric */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Optimization Metric</Label>
                  <Select value={metric} onValueChange={setMetric}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {AUTOML_METRICS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Estimated Runtime</Label>
                  <div className="text-sm text-muted-foreground">{estimatedRuntime}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clone Current Model */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Checkbox id="clone" checked={cloneModel} onCheckedChange={handleCloneToggle} />
            <Label htmlFor="clone">Clone Current Model (Parameter variations)</Label>
          </div>

          {cloneModel && (
            <div className="ml-6 mt-2 p-4 rounded-md border space-y-3">
              <div className="text-sm font-medium">Select Optimization Techniques</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {CLONE_TECHNIQUES.map((t) => {
                  const id = `clone-${t}`;
                  const checked = Boolean(cloneTechniques[t]);
                  return (
                    <div key={t} className="flex items-center gap-2">
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={(v) =>
                          setCloneTechniques((prev) => ({ ...prev, [t]: Boolean(v) }))
                        }
                      />
                      <Label htmlFor={id} className="text-sm">
                        {t}
                      </Label>
                    </div>
                  );
                })}
              </div>
              {cloneError && (
                <div className="text-sm text-red-600" role="alert">
                  Select at least one technique
                </div>
              )}
            </div>
          )}
        </div>

        {/* Global error when no method is selected */}
        {showError && (
          <div className="text-sm text-red-600" role="alert">
            ⚠️ Please select at least one comparison method
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            onClick={handleCompare}
            className="bg-[#0067b8] hover:bg-[#005a9e] text-white"
          >
            Compare
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Three Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <Button
          className="bg-red-500 hover:bg-red-600 text-white"
          onClick={() => {
            // Cancel functionality - could reset state or go back
            if (onCancel) onCancel();
          }}
        >
          Cancel
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => {
            // Save functionality - save current progress
            if (onSave) onSave();
          }}
        >
          Save
        </Button>
        <Button
          className="bg-green-500 hover:bg-green-600 text-white"
          onClick={() => {
            // Save and continue to next step
            if (onSaveAndContinue) onSaveAndContinue();
          }}
        >
          Save and Continue
        </Button>
      </div>

      {/* Results Sections */}
      {ran && result && (
        <div className="space-y-6 mt-2">
          {peer && result.peer && (
            <PeerComparisonSection baseline={result.baseline} peer={result.peer} />
          )}

          {automl && result.automl && (
            <AutoMLChallengerSection baseline={result.baseline} automl={result.automl} />
          )}

          {cloneModel && result.clone && (
            <CloneCurrentModelSection baseline={result.baseline} clone={result.clone} />
          )}

          {(peer || automl || cloneModel) && (
            <IntegratedSummarySection
              peerEnabled={Boolean(result.peer)}
              automlEnabled={Boolean(result.automl)}
              cloneEnabled={Boolean(result.clone)}
            />
          )}

          {/* Benchmarking Observation Table (copied from Interpretability & adapted) */}
          <Card className="p-6">
            <h4 className="mb-3">Benchmarking Observation Table</h4>
            <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Benchmark Area</TableHead>
                      <TableHead>Gap / Delta %</TableHead>
                      <TableHead>Acceptable / Not Acceptable / NA <span className="text-red-500">*</span></TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
              <TableBody>
                {bmObservations.map((obs, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <input
                        type="text"
                        value={obs.area}
                        onChange={(e) => updateBmObservation(index, 'area', e.target.value)}
                        className="border rounded p-1 w-full"
                        placeholder="e.g., Peer vs Avg (AUC), Best AutoML vs Baseline"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        value={obs.delta}
                        onChange={(e) => updateBmObservation(index, 'delta', e.target.value)}
                        className="border rounded p-1 w-full"
                        placeholder="+/- %"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={obs.acceptability}
                        onValueChange={(val) => updateBmObservation(index, 'acceptability', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Acceptable">Acceptable</SelectItem>
                          <SelectItem value="Not Acceptable">Not Acceptable</SelectItem>
                          <SelectItem value="NA">NA</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        value={obs.remarks}
                        onChange={(e) => updateBmObservation(index, 'remarks', e.target.value)}
                        className="border rounded p-1 w-full"
                        placeholder="Add notes, next steps, or owners"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={addBmObservationRow} variant="outline" className="mt-4">
              Add Observation
            </Button>


<div className="mb-6">
  <Label htmlFor="validator-notes">Validator Overall Step Comment</Label>
  <Textarea
    id="validator-notes"
    placeholder="Input overall comments here for this step.."
    rows={4}
    className="mt-2"
  />
</div>


        {/* Evidence Upload */}
        <div className="mb-6">
          <Label>Supporting Evidence</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-muted-foreground mb-1">Upload documentation</p>
            <p className="text-xs text-muted-foreground">Model design docs, methodology papers, regulatory mappings</p>
            <Input type="file" className="hidden" multiple />
          </div>
        </div>

             <div className="flex justify-end gap-3 mt-6">
          <Button
           style={{
      backgroundColor: "red", // blue-500
      color: "white",
      fontSize: "14px",
      fontWeight: 500,
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    }}
            onClick={() => {
              // Cancel functionality - could reset state or go back
              if (onCancel) onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
           style={{
      backgroundColor: "#3b82f6", // blue-500
      color: "white",
      fontSize: "14px",
      fontWeight: 500,
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    }}
            onClick={() => {
              // Save functionality - save current progress
              if (onSave) onSave();
            }}
          >
            Save
          </Button>
          <Button
           style={{
      backgroundColor: "green", // blue-500
      color: "white",
      fontSize: "14px",
      fontWeight: 500,
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    }}
            onClick={() => {
              // Save and continue to next step
              if (onSaveAndContinue) onSaveAndContinue();
            }}
          >
            Save and Continue
          </Button>
        </div>
          </Card>
        </div>
      )}
    </div>
  );
}
