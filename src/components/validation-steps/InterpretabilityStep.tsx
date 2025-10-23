import { useState } from 'react';
import { Model, Finding } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { FileText, Upload } from 'lucide-react';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';

interface InterpretabilityStepProps {
  model: Model;
  onComplete: () => void;
  onAddFinding: (finding: Omit<Finding, 'id'>) => void;
  onSave?: () => void;
  onSaveAndContinue?: () => void;
  onCancel?: () => void;
}

// Mocked Feature Importance Data
const featureImportance = [
  { feature: 'credit_score', training: 0.38, lastValidation: 0.36, production: 0.35 },
  { feature: 'debt_to_income', training: 0.25, lastValidation: 0.27, production: 0.28 },
  { feature: 'employment_length', training: 0.20, lastValidation: 0.19, production: 0.18 },
  { feature: 'loan_amount', training: 0.10, lastValidation: 0.11, production: 0.12 },
  { feature: 'annual_income', training: 0.07, lastValidation: 0.07, production: 0.07 }
];

// List of techniques
const explainabilityTechniques = [
  'SHAP',
  'LIME',
  'Permutation Feature Importance',
  'Partial Dependence Plots',
  'Integrated Gradients',
  'Counterfactual Explanations',
  'Feature Ablation'
];

// Feature list
const availableFeatures = [
  'credit_score',
  'debt_to_income',
  'employment_length',
  'loan_amount',
  'annual_income'
];

export function InterpretabilityStep({ model, onComplete, onAddFinding, onSave, onSaveAndContinue, onCancel }: InterpretabilityStepProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>(['Production']); // Production preselected
  const [prodStartDate, setProdStartDate] = useState('2024-09-01');
  const [prodEndDate, setProdEndDate] = useState('2024-09-30');
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showGraphs, setShowGraphs] = useState(false);

  interface Observation {
    feature: string;
    change: string;
    acceptability: string;
    remarks: string;
  }

  const [observations, setObservations] = useState<Observation[]>([
    { feature: 'credit_score', change: '-7.9%', acceptability: '', remarks: '' },
    { feature: 'debt_to_income', change: '+12.0%', acceptability: '', remarks: '' },
  ]);

  const handleGenerate = () => {
    setShowGraphs(true);
  };

  const addObservationRow = () => {
    setObservations([...observations, { feature: '', change: '', acceptability: '', remarks: '' }]);
  };

  const updateObservation = (index: number, field: keyof Observation, value: string) => {
    const updated = [...observations];
    updated[index][field] = value;
    setObservations(updated);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-blue-600" />
          <h2>Interpretability & Explainability</h2>
        </div>

        <p className="text-muted-foreground mb-6">
          Review interpretability metrics, explainability techniques, and feature importance behavior across data sources.
        </p>

        {/* ---------------- Data Source Selection ---------------- */}
        <div className="mb-4">
          <Label>Select Data Sources</Label>
          <div className="space-y-2 mt-2">
            {['Training', 'Last Validation', 'Production'].map(source => (
              <div key={source} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedSources.includes(source)}
                  onCheckedChange={() => {
                    setSelectedSources(prev => prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]);
                  }}
                />
                <span>{source}</span>
                {selectedSources.includes(source) && source !== 'Production' && (
                  <Input
                    value={source === 'Training' ? '2023-01-01' : model.lastValidationDate}
                    disabled
                    className="w-32 ml-2"
                  />
                )}
                {selectedSources.includes(source) && source === 'Production' && (
                  <div className="grid grid-cols-2 gap-4 ml-4">
                    <div>
                      <Label>Production Start Date (auto-fetched from Outcome Analysis)</Label>
                      <Input
                        className="w-40"
                        type="date"
                        value={prodStartDate}
                        onChange={(e) => setProdStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Production End Date (auto-fetched from Outcome Analysis)</Label>
                      <Input
                        className="w-40"
                        type="date"
                        value={prodEndDate}
                        onChange={(e) => setProdEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Technique Selection ---------------- */}
        <div className="mb-4">
          <Label>Select Explainability Techniques</Label>
          <Select
            onValueChange={(value) => {
              if (value === 'select-all') {
                setSelectedTechniques(explainabilityTechniques);
              } else {
                setSelectedTechniques((prev) =>
                  prev.includes(value)
                    ? prev.filter((t) => t !== value)
                    : [...prev, value]
                );
              }
            }}
          >
            <SelectTrigger className="min-h-[40px]">
              <SelectValue>
                {selectedTechniques.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTechniques.map((t) => (
                      <span key={t} className="bg-muted text-sm px-2 py-0.5 rounded-md border">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select techniques</span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select-all">Select All Techniques</SelectItem>
              {explainabilityTechniques.map((tech) => (
                <SelectItem key={tech} value={tech}>
                  {tech}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-muted-foreground text-sm ml-2 text-red-600">
            *System Recommendation: <br />
            <span className="ml-4 text-muted-foreground">
              • SHAP – used during model approval. <br />
              • LIME – used during last validation. <br />
              • Counterfactual Explanations – generally recommended for this model type.
            </span>
          </span>
        </div>

        {/* ---------------- Feature Selection ---------------- */}
        <div className="mb-4">
          <Label>Select Features</Label>
          <Select
            onValueChange={(value) => {
              if (value === 'select-all') {
                setSelectedFeatures(availableFeatures);
              } else {
                setSelectedFeatures((prev) =>
                  prev.includes(value)
                    ? prev.filter((f) => f !== value)
                    : [...prev, value]
                );
              }
            }}
          >
            <SelectTrigger className="min-h-[40px]">
              <SelectValue>
                {selectedFeatures.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedFeatures.map((f) => (
                      <span key={f} className="bg-muted text-sm px-2 py-0.5 rounded-md border">
                        {f}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select features</span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select-all">Select All Features</SelectItem>
              {availableFeatures.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ---------------- Generate ---------------- */}
        <Button
          onClick={handleGenerate}
          disabled={
            selectedSources.length === 0 ||
            selectedTechniques.length === 0 ||
            selectedFeatures.length === 0
          }
        >
          Generate
        </Button>

        {/* ---------------- Charts ---------------- */}
        {showGraphs && (
          <div className="mt-8">
            <h3 className="mb-2">Feature Importance Comparison  {" "}
  <span className="text-muted-foreground text-sm text-red-600">
    (Below is an example graph. Generate graphs for each selected Feature vs Technique)
    <br/>
    Render the most suitable chart type (Line, Bar, or Step) based on the comparison.
  </span></h3>
<span className="text-muted-foreground text-sm text-red-600">
              *Requirement: Interactive charts – can select/deselect entities in the legend to customize the view.
            </span><br/>
           

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureImportance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedSources.includes('Training') && (
                  <Bar dataKey="training" fill="#10b981" name="Training" />
                )}
                {selectedSources.includes('Last Validation') && (
                  <Bar dataKey="lastValidation" fill="#f59e0b" name="Last Validation" />
                )}
                {selectedSources.includes('Production') && (
                  <Bar dataKey="production" fill="#3b82f6" name="Production" />
                )}
              </BarChart>
            </ResponsiveContainer>
            
            {/* ---------------- Observation Table ---------------- */}
            <div className="mt-6">
              <h4 className="mb-3">Observation Table</h4>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <Button onClick={addObservationRow} variant="outline" style={{ padding: "8px 16px", backgroundColor:"black", color:"#fff" }}>
                  Add Observation +
                </Button>
              </div>
              <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead>Change %</TableHead>
                      <TableHead>Acceptable / Not Acceptable / NA <span className="text-red-500">*</span></TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {observations.map((obs, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <input
                          type="text"
                          value={obs.feature}
                          onChange={(e) => updateObservation(index, 'feature', e.target.value)}
                          className="border rounded p-1 w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={obs.change}
                          onChange={(e) => updateObservation(index, 'change', e.target.value)}
                          className="border rounded p-1 w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={obs.acceptability}
                          onValueChange={(val) => updateObservation(index, 'acceptability', val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
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
                          onChange={(e) => updateObservation(index, 'remarks', e.target.value)}
                          className="border rounded p-1 w-full"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* <Button onClick={addObservationRow} variant="outline" className="mt-4">
                Add Observation
              </Button> */}
            </div>
          </div>
        )}


        {/* ---------------- Remarks ---------------- */}
        <div className="mt-6">
          <Label>Validator Remarks / Interpretability Assessment Notes</Label>
          <Textarea
            placeholder="Document interpretability observations, findings, and validation remarks..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
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
  );
}
