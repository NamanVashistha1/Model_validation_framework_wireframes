import { useState, useEffect } from 'react';
import { Finding, FindingSeverity } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircle, Plus, Trash2, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { FileText, Upload } from 'lucide-react';

interface FindingsStepProps {
  findings: Finding[];
  onComplete: () => void;
  onUpdateFindings: (findings: Finding[]) => void;
  onSave?: () => void;
  onSaveAndContinue?: () => void;
  onCancel?: () => void;
}

export function FindingsStep({ findings, onComplete, onUpdateFindings, onSave, onSaveAndContinue, onCancel }: FindingsStepProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddSummaryOpen, setIsAddSummaryOpen] = useState(false);
 const [summaryRows, setSummaryRows] = useState<any[]>([
  {
    step: 'Conceptual Soundness Assessment',
    observation:
      'Model logic broadly aligns with documented design; minor parameter naming inconsistency noted between documentation and implementation.',
    remarks:
      'Conceptually sound overall; ensure documentation reflects the latest approved configuration.',
    date: '2025-10-14',
  },
  {
    step: 'Data Quality Checks',
    observation:
      'Missing values in income and employment_length exceed acceptable limits; outlier capping applied inconsistently across retraining datasets.',
    remarks:
      'Requires data preprocessing improvements and consistent imputation strategy before next retraining cycle.',
    date: '2025-10-15',
  },
  {
    step: 'Drift Analysis',
    observation:
      'Moderate drift detected in loan_amount and feature X distribution; PSI values remain within control limits.',
    remarks:
      'Monitor features quarterly; no immediate retraining required but capture drift trend in monitoring dashboard.',
    date: '2025-10-15',
  },
  {
    step: 'Outcome Analysis',
    observation:
      'AUC dropped marginally from 0.82 to 0.79; KS statistic deviation acceptable; stability in rank ordering maintained.',
    remarks:
      'Model performance acceptable; recommend continued monitoring with enhanced data sampling checks.',
    date: '2025-10-16',
  },
  {
    step: 'Interpretability & Explainability',
    observation:
      'Feature “debt_to_income” impact increased by 12%; SHAP values consistent with expected business behavior overall.',
    remarks:
      'No concept drift detected; feature-level explanations remain aligned with underwriting logic.',
    date: '2025-10-16',
  },
  {
    step: 'Performance Monitoring',
    observation:
      'Population Stability Index (PSI) nearing alert threshold (0.18); minor deterioration observed in low-income segment predictions.',
    remarks:
      'Acceptable for current cycle; flag for deeper analysis before next model validation.',
    date: '2025-10-17',
  },
  {
    step: 'Benchmark Comparison',
    observation:
      'Model outperforms challenger in predictive power but shows higher sensitivity to macroeconomic changes.',
    remarks:
      'Retain current model but initiate investigation into macro factor dependencies for next model version.',
    date: '2025-10-17',
  },
  {
    step: 'Implementation & Change Log Review',
    observation:
      'All recent parameter updates and data source changes documented; no unauthorized code edits found.',
    remarks:
      'Change management process compliant; ensure automated change log integration with validation workflow.',
    date: '2025-10-17',
  },
  {
    step: 'Governance & Approval Summary',
    observation:
      'Validation evidence complete; all required attachments and testing results recorded in MMG.',
    remarks:
      'Ready for model risk committee review and final approval. No open critical findings.',
    date: '2025-10-18',
  },
]);


  const [newSummary, setNewSummary] = useState({
    step: '',
    observation: '',
    remarks: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [newFinding, setNewFinding] = useState<Omit<Finding, 'id'> & { step?: string; trackAsObservation?: boolean }>({
    category: 'Data Input & Profiling',
    severity: 'Medium',
    description: '',
    recommendation: '',
    status: 'Open',
    dateIdentified: new Date().toISOString(),
    assignedTo: '',
    step: '',
    trackAsObservation: false
  });

  useEffect(() => {
    const aggregatedFindings: Finding[] = [
      // Data Input & Profiling
      {
        id: 'F-DP-001',
        category: 'Data Input & Profiling',
        severity: 'Medium',
        description: 'Missing values in income and employment_length exceed acceptable limits across recent batches.',
        recommendation: 'Implement a consistent imputation strategy and enforce source-level data QA checks.',
        status: 'Open',
        dateIdentified: '2025-10-10',
        assignedTo: 'Data Engineering',
        step: 'Data Profiling',
        trackAsObservation: false
      },
      {
        id: 'F-DP-002',
        category: 'Data Input & Profiling',
        severity: 'Low',
        description: 'Outlier capping applied inconsistently across retraining datasets.',
        recommendation: 'Standardize outlier handling with documented winsorization thresholds.',
        status: 'Open',
        dateIdentified: '2025-10-11',
        assignedTo: 'Data Science',
        step: 'Data Profiling',
        trackAsObservation: false
      },

      // Outcome Analysis & Backtesting
      {
        id: 'F-OA-001',
        category: 'Outcome Analysis & Backtesting',
        severity: 'High',
        description: 'AUC dropped from 0.82 to 0.79; rank ordering stability marginally impacted.',
        recommendation: 'Investigate sampling, temporal effects, and threshold calibration; consider segment-specific thresholds.',
        status: 'Open',
        dateIdentified: '2025-10-12',
        assignedTo: 'Model Validation',
        step: 'Outcome Analysis',
        trackAsObservation: false
      },
      {
        id: 'F-OA-002',
        category: 'Outcome Analysis & Backtesting',
        severity: 'Medium',
        description: 'KS statistic deviation trending upward though within tolerance.',
        recommendation: 'Enhance backtesting with rolling windows and monitor KS trend weekly.',
        status: 'Open',
        dateIdentified: '2025-10-13',
        assignedTo: 'Model Validation',
        step: 'Backtesting',
        trackAsObservation: false
      },

      // Interpretability & Monitoring
      {
        id: 'F-IM-001',
        category: 'Interpretability & Monitoring',
        severity: 'Low',
        description: 'Feature “debt_to_income” impact increased by 12% per SHAP analysis.',
        recommendation: 'Continue monitoring; review interaction terms with employment_length.',
        status: 'Open',
        dateIdentified: '2025-10-14',
        assignedTo: 'Data Science',
        step: 'Interpretability',
        trackAsObservation: false
      },
      {
        id: 'F-IM-002',
        category: 'Interpretability & Monitoring',
        severity: 'Medium',
        description: 'SHAP explanations show inconsistency for low-income segment predictions.',
        recommendation: 'Review pre-processing and re-check monotonic constraints; add segment-specific diagnostics.',
        status: 'Open',
        dateIdentified: '2025-10-14',
        assignedTo: 'Model Validation',
        step: 'Monitoring',
        trackAsObservation: false
      },

      // Benchmarking
      {
        id: 'F-BM-001',
        category: 'Benchmarking',
        severity: 'Medium',
        description: 'Model underperforms best AutoML challenger on F1 by 2.1%.',
        recommendation: 'Evaluate class threshold optimization and revisit class-weighting.',
        status: 'Open',
        dateIdentified: '2025-10-15',
        assignedTo: 'Data Science',
        step: 'Benchmarking',
        trackAsObservation: false
      },
      {
        id: 'F-BM-002',
        category: 'Benchmarking',
        severity: 'Low',
        description: 'Peer comparison shows similar AUC but lower recall at chosen threshold.',
        recommendation: 'Assess recall–precision trade-off and consider operational impact of missed positives.',
        status: 'Open',
        dateIdentified: '2025-10-15',
        assignedTo: 'Model Owner',
        step: 'Peer Comparison',
        trackAsObservation: false
      },

      // Sensitivity Analysis
      {
        id: 'F-SA-001',
        category: 'Sensitivity Analysis',
        severity: 'High',
        description: 'Outputs highly sensitive to 10% degradation in income data quality.',
        recommendation: 'Strengthen upstream data validation and consider robust training with noise augmentation.',
        status: 'Open',
        dateIdentified: '2025-10-16',
        assignedTo: 'Data Engineering',
        step: 'Sensitivity Analysis',
        trackAsObservation: false
      },
      {
        id: 'F-SA-002',
        category: 'Sensitivity Analysis',
        severity: 'Medium',
        description: 'Scenario testing indicates resilience to moderate interest rate hikes.',
        recommendation: 'Document scenario assumptions; no immediate recalibration required.',
        status: 'Open',
        dateIdentified: '2025-10-16',
        assignedTo: 'Model Validation',
        step: 'Scenario Testing',
        trackAsObservation: false
      },

      // Conceptual Analysis
      {
        id: 'F-CA-001',
        category: 'Conceptual Analysis',
        severity: 'Medium',
        description: 'Documentation mismatch with implementation parameter names detected.',
        recommendation: 'Align documentation with current code/config and add change log references.',
        status: 'Open',
        dateIdentified: '2025-10-17',
        assignedTo: 'Model Owner',
        step: 'Conceptual Review',
        trackAsObservation: false
      },
      {
        id: 'F-CA-002',
        category: 'Conceptual Analysis',
        severity: 'Low',
        description: 'Assumptions list incomplete for two key risk drivers.',
        recommendation: 'Complete assumptions section and add validation evidence links.',
        status: 'Open',
        dateIdentified: '2025-10-17',
        assignedTo: 'Model Owner',
        step: 'Conceptual Review',
        trackAsObservation: false
      }
    ];
    if (findings.length === 0) onUpdateFindings(aggregatedFindings);
  }, []);

  const getSeverityColor = (severity: FindingSeverity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddFinding = () => {
    const finding = {
      ...newFinding,
      id: `F-${Date.now()}`,
      category: newFinding.category && newFinding.category.trim() !== '' ? newFinding.category : 'Data Input & Profiling'
    };
    onUpdateFindings([...findings, finding]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteFinding = (id: string) => {
    onUpdateFindings(findings.filter(f => f.id !== id));
  };

  const handleToggleObservation = (id: string, checked: boolean) => {
    onUpdateFindings(findings.map(f => f.id === id ? { ...f, trackAsObservation: checked } : f));
  };

  const handleAddSummary = () => {
    setSummaryRows([...summaryRows, newSummary]);
    setNewSummary({
      step: '',
      observation: '',
      remarks: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsAddSummaryOpen(false);
  };

  const sections = [
    { key: 'data', label: 'Data Input & Profiling' },
    { key: 'outcomes', label: 'Outcome Analysis & Backtesting' },
    { key: 'interpretability', label: 'Interpretability & Monitoring' },
    { key: 'benchmarking', label: 'Benchmarking' },
    { key: 'sensitivity', label: 'Sensitivity Analysis' },
    { key: 'conceptual', label: 'Conceptual Analysis' }
  ];

  const normalizeSectionLabel = (f: Finding): string => {
    const c = (f.category || '').toLowerCase();
    const s = (f.step || '').toLowerCase();
    if (!c && !s) return 'Data Input & Profiling';
    const text = c || s;
    if (text.includes('outcome') || text.includes('backtest')) return 'Outcome Analysis & Backtesting';
    if (text.includes('interpret') || text.includes('explain') || text.includes('monitor')) return 'Interpretability & Monitoring';
    if (text.includes('benchmark') || text.includes('peer') || text.includes('challenger')) return 'Benchmarking';
    if (text.includes('sensitivity')) return 'Sensitivity Analysis';
    if (text.includes('concept')) return 'Conceptual Analysis';
    return 'Data Input & Profiling';
  };

  const findingsBySection = (label: string) =>
    findings
      .map(f => ({
        ...f,
        category: f.category && f.category.trim() !== '' ? f.category : 'Data Input & Profiling'
      }))
      .filter(f => normalizeSectionLabel(f) === label);

  // Reusable table renderer (replica of original columns/actions)
  const renderFindingsTable = (items: Finding[]) => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Track</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Step</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description / Observation</TableHead>
            <TableHead>Validator Remarks</TableHead>
            <TableHead>Observation</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((finding) => (
            <TableRow key={finding.id}>
              <TableCell>
                <Checkbox
                  checked={finding.trackAsObservation || false}
                  onCheckedChange={(checked) =>
                    onUpdateFindings(
                      findings.map(f =>
                        f.id === finding.id ? { ...f, trackAsObservation: checked as boolean } : f
                      )
                    )
                  }
                />
              </TableCell>
              <TableCell>{finding.id}</TableCell>
              <TableCell>{finding.step || '-'}</TableCell>
              <TableCell>{finding.category || 'Data Input & Profiling'}</TableCell>
              <TableCell>{finding.description}</TableCell>
              <TableCell>{finding.recommendation}</TableCell>
              <TableCell>
                <Badge className={getSeverityColor(finding.severity)}>{finding.severity}</Badge>
              </TableCell>
              <TableCell>{finding.status}</TableCell>
              <TableCell>{new Date(finding.dateIdentified).toLocaleDateString()}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4 text-blue-600" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteFinding(finding.id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  placeholder="Add comment..."
                  value={finding.validatorComment || ''}
                  onChange={(e) =>
                    onUpdateFindings(
                      findings.map(f =>
                        f.id === finding.id ? { ...f, validatorComment: e.target.value } : f
                      )
                    )
                  }
                  className="w-48"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const trackedObservations = findings.filter(f => f.trackAsObservation);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <h2>Observations</h2>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Observation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Observation</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newFinding.category}
                      onValueChange={(value) => setNewFinding({ ...newFinding, category: value })}
                    >
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Data Input & Profiling">Data Input & Profiling</SelectItem>
                        <SelectItem value="Outcome Analysis & Backtesting">Outcome Analysis & Backtesting</SelectItem>
                        <SelectItem value="Interpretability & Monitoring">Interpretability & Monitoring</SelectItem>
                        <SelectItem value="Benchmarking">Benchmarking</SelectItem>
                        <SelectItem value="Sensitivity Analysis">Sensitivity Analysis</SelectItem>
                        <SelectItem value="Conceptual Analysis">Conceptual Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Severity</Label>
                    <Select
                      value={newFinding.severity}
                      onValueChange={(value: FindingSeverity) => setNewFinding({ ...newFinding, severity: value })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newFinding.description}
                    onChange={(e) => setNewFinding({ ...newFinding, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Remarks</Label>
                  <Textarea
                    value={newFinding.recommendation}
                    onChange={(e) => setNewFinding({ ...newFinding, recommendation: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Step Origin</Label>
                  <Input
                    placeholder="e.g., Drift Analysis"
                    value={newFinding.step}
                    onChange={(e) => setNewFinding({ ...newFinding, step: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddFinding}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sectioned replica tables */}
        <div className="space-y-6">
          {sections.map((sec) => {
            const items = findingsBySection(sec.label);
            return (
              <Card key={sec.key} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium">{sec.label}</h3>
                  <Badge>{items.length}</Badge>
                </div>
                {renderFindingsTable(items)}
              </Card>
            );
          })}
        </div>
        <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Validator Final Comments Summary</h3>

          <Dialog open={isAddSummaryOpen} onOpenChange={setIsAddSummaryOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" /> Add New Comment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Validator Comment</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div>
                  <Label>Step</Label>
                  <Input
                    value={newSummary.step}
                    onChange={(e) => setNewSummary({ ...newSummary, step: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Key Observations</Label>
                  <Textarea
                    value={newSummary.observation}
                    onChange={(e) => setNewSummary({ ...newSummary, observation: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Validator Remarks</Label>
                  <Textarea
                    value={newSummary.remarks}
                    onChange={(e) => setNewSummary({ ...newSummary, remarks: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddSummaryOpen(false)}>Cancel</Button>
                <Button onClick={handleAddSummary}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead>Key Observations</TableHead>
                <TableHead>Validator Remarks</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryRows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.step}</TableCell>
                  <TableCell>{row.observation}</TableCell>
                  <TableCell>{row.remarks}</TableCell>
                  <TableCell>{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ===========================
    TRACKED OBSERVATIONS TABLE
=========================== */}
{trackedObservations.length > 0 && (
  <div className="mt-10">
    <h3 className="text-lg font-medium mb-4">Tracked as Observations</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Items marked for tracking by the validator are summarized here for follow-up or audit purposes.
    </p>

    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Step</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Validator Remarks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Comment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trackedObservations.map((finding) => (
            <TableRow key={finding.id}>
              <TableCell>{finding.id}</TableCell>
              <TableCell>{finding.step}</TableCell>
              <TableCell>{finding.category}</TableCell>
              <TableCell>{finding.description}</TableCell>
              <TableCell>{finding.recommendation}</TableCell>
              <TableCell>{finding.status}</TableCell>
              <TableCell>{new Date(finding.dateIdentified).toLocaleDateString()}</TableCell>
              <TableCell>
                <Input
                  type="text"
                  placeholder="Add comment..."
                  value={finding.validatorComment || ''}
                  onChange={(e) =>
                    onUpdateFindings(
                      findings.map(f =>
                        f.id === finding.id ? { ...f, validatorComment: e.target.value } : f
                      )
                    )
                  }
                  className="w-48"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
)}

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

      {/* Final Validator Comments Table */}
      
    </div>
  );
}
