import { useState } from 'react';
import { Model, Finding } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { FileText, Upload } from 'lucide-react';
import { Textarea } from '../ui/textarea';

interface OutcomeAnalysisStepProps {
  model: Model;
  onComplete: () => void;
  onAddFinding: (finding: Omit<Finding, 'id'>) => void;
  onSave?: () => void;
  onSaveAndContinue?: () => void;
  onCancel?: () => void;
}

export function OutcomeAnalysisStep({ model, onComplete, onAddFinding, onSave, onSaveAndContinue, onCancel }: OutcomeAnalysisStepProps) {
  const todaysDate = new Date().toISOString().split('T')[0];

  // New: selection between Training, Last Validation, Production
const dataSources = ['Training', 'Last Validation', 'Production'];
const [selectedSources, setSelectedSources] = useState<string[]>([]);

const [prodStartDate, setProdStartDate] = useState('');
const [prodEndDate, setProdEndDate] = useState('');

  // Expanded techniques list
  const techniques = [
    'Accuracy', 'Precision', 'Recall', 'F1 Score', 'F-test', 'P-test',
    'ROC Curve', 'KS Statistic', 'AUC', 'Gini Coefficient', 'Chi-square',
    'Lift Chart', 'Confusion Matrix', 'Population Stability Index (PSI)', 'Characteristic Stability Index (CSI)', 'Concordance/Discordance',  'Rate of Conservatism', 
  ];

  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);

  const [deviations, setDeviations] = useState([
    { metric: 'Accuracy Deviation', deviationFromLV: 0.05, deviationFromTraining: 0.08,  acceptability: '', comments: '', isSystem: true },
    { metric: 'Precision Deviation', deviationFromLV: 0.03, deviationFromTraining: 0.06, acceptability: '', comments: '', isSystem: true },
  ]);

  // Mock graph data
 // Enhanced mock graph data
const mockGraphs = {
  Accuracy: [
    { name: 'Jan', Production: 0.91, 'Last Validation': 0.93, Training: 0.95 },
    { name: 'Feb', Production: 0.89, 'Last Validation': 0.92, Training: 0.94 },
    { name: 'Mar', Production: 0.90, 'Last Validation': 0.91, Training: 0.93 },
  ],
  Precision: [
    { name: 'Jan', Production: 0.84, 'Last Validation': 0.86, Training: 0.88 },
    { name: 'Feb', Production: 0.82, 'Last Validation': 0.85, Training: 0.87 },
    { name: 'Mar', Production: 0.83, 'Last Validation': 0.84, Training: 0.86 },
  ],
  Recall: [
    { name: 'Jan', Production: 0.78, 'Last Validation': 0.80, Training: 0.82 },
    { name: 'Feb', Production: 0.76, 'Last Validation': 0.79, Training: 0.81 },
    { name: 'Mar', Production: 0.77, 'Last Validation': 0.78, Training: 0.80 },
  ],
  F1Score: [
    { name: 'Jan', Production: 0.81, 'Last Validation': 0.83, Training: 0.85 },
    { name: 'Feb', Production: 0.79, 'Last Validation': 0.82, Training: 0.84 },
    { name: 'Mar', Production: 0.80, 'Last Validation': 0.81, Training: 0.83 },
  ],
  ROC: [
    { name: 'Jan', Production: 0.92, 'Last Validation': 0.94, Training: 0.96 },
    { name: 'Feb', Production: 0.91, 'Last Validation': 0.93, Training: 0.95 },
    { name: 'Mar', Production: 0.90, 'Last Validation': 0.92, Training: 0.94 },
  ],
};


  const handleGenerate = () => {
    setGenerated(true);
  };

  const updateDeviation = (
    index: number,
    field: 'metric' | 'deviationFromLV' | 'deviationFromTraining' | 'deviationFromProd' | 'acceptability' | 'comments',
    value: string
  ) => {
    const newDeviations = [...deviations];
    if (field === 'deviationFromLV' || field === 'deviationFromTraining') {
      newDeviations[index][field] = parseFloat(value) || 0;
    } else {
      newDeviations[index][field] = value;
    }
    setDeviations(newDeviations);
  };

  const addDeviation = () => {
    setDeviations([...deviations, { metric: '', deviationFromLV: 0, deviationFromTraining: 0, acceptability: '', comments: '', isSystem: false }]);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5" />
          <h2>Outcome Analysis</h2>
        </div>

        <div className="space-y-6">
          {/* Select Production Window */}
        <div>
          <Label>Select Data Source</Label>
          <br/><span className="text-muted-foreground text-sm ml-2 text-red-600">*Date automatically fetched for Training & Last Validation.</span>
          <div className="space-y-2 mt-2">
            {dataSources.map(source => (
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
                     {/* <br/> */}
                               <Label>Select Production window</Label>
                               <br/>

                    <div>
                      <Label>Production Date</Label>
                      <Input
                        className="w-40"
                        type="date"
                        value={prodStartDate}
                        onChange={(e) => setProdStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Actual Values Date</Label>
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

     


{/* Technique selection */}
<div>
  <Label>Select Techniques</Label>
 {/* Technique selection */}
  <br />
  <span
    style={{
      color: "#dc2626",
      fontSize: "13px",
      marginLeft: "8px",
    }}
  >
    *System Recommendation shown below
  </span>

  {/* Custom dynamic box that grows with content */}
  <div
    style={{
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "8px",
      marginTop: "8px",
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      alignItems: "flex-start",
      minHeight: "40px",
      backgroundColor: "#fff",
      cursor: "pointer",
    }}
    onClick={(e) => {
      const dropdown = document.getElementById("techniquesDropdown");
      if (dropdown) dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    }}
  >
    {selectedTechniques.length > 0 ? (
      selectedTechniques.map((t) => (
        <span
          key={t}
          style={{
            backgroundColor: "#f3f4f6",
            fontSize: "13px",
            padding: "2px 8px",
            borderRadius: "4px",
            border: "1px solid #d1d5db",
          }}
        >
          {t}
        </span>
      ))
    ) : (
      <span style={{ color: "#6b7280" }}>Select one or more techniques</span>
    )}
  </div>

  {/* Dropdown that appears below */}
  <div
    id="techniquesDropdown"
    style={{
      display: "none",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      backgroundColor: "white",
      marginTop: "4px",
      padding: "6px",
      position: "absolute",
      zIndex: 20,
      maxHeight: "200px",
      overflowY: "auto",
      width: "100%",
    }}
  >
    <div
      style={{
        padding: "4px 8px",
        fontWeight: "500",
        cursor: "pointer",
      }}
      onClick={() => setSelectedTechniques(techniques)}
    >
      <input
    type="checkbox"
    checked={selectedTechniques.length === techniques.length}
    readOnly
  />
  <span>Select All Techniques</span>
    </div>
    {techniques.map((t) => (
      <div
        key={t}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px 8px",
          cursor: "pointer",
        }}
        onClick={() => {
          setSelectedTechniques((prev) =>
            prev.includes(t)
              ? prev.filter((x) => x !== t)
              : [...prev, t]
          );
        }}
      >
        <input
          type="checkbox"
          checked={selectedTechniques.includes(t)}
          readOnly
        />
        {t}
      </div>
    ))}
  </div>




  {/* <Select
    onValueChange={(value) => {
      if (value === 'select-all') {
        setSelectedTechniques(techniques);
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
              <span
                key={t}
                className="bg-muted text-sm px-2 py-0.5 rounded-md border"
              >
                {t}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">Select one or more techniques</span>
        )}
      </SelectValue>
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="select-all">Select All Techniques</SelectItem>
      {techniques.map((t) => (
        <SelectItem key={t} value={t}>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={selectedTechniques.includes(t)} readOnly />
            {t}
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select> */}
  <span className="text-muted-foreground text-sm ml-2 text-red-600">
  System Recommendation:  
  <br />
  <span className="ml-4 text-muted-foreground">
    • <strong>Accuracy, Precision</strong> – generally used for this model type. <br />
  </span>
</span>
</div>



              <Button
  onClick={handleGenerate}
  disabled={
    selectedSources.length === 0 ||
    selectedTechniques.length === 0 ||
    (selectedSources.includes('Production') && (!prodStartDate || !prodEndDate))
  }
>
  Generate
</Button>

          {generated && (
            <>
              {/* Graph note same as data input page */}
              <br/>
              <span className="text-muted-foreground text-sm ml-2 text-red-600">*Requirement: Interactive charts - can select or deselect entities in the chart legend to customize the view. 
                <br/>     Render the most suitable chart type (Line, Bar, or Step) based on the dataset characteristics.
</span><br/>


            {selectedTechniques.map((technique) => (
      <div key={technique} className="mb-8">
        <h4 className="mb-4">{technique} Graph</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockGraphs[technique] || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Production" stroke="#8884d8" />
            <Line type="monotone" dataKey="Last Validation" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Training" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    ))}
 

              {/* Deviation table */}
              <div>
                <h3 className="mb-4">Performance Comparison from Training, Last Validation vs Current Review</h3>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <Button onClick={addDeviation} variant="outline" style={{ padding: "8px 16px", backgroundColor:"black", color:"#fff"}}>
                  Add Analysis +
                </Button>
              </div>
                <Table> 
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Deviation from Training</TableHead>
                      <TableHead>Deviation from  Last Validation</TableHead>
                      {/* <TableHead>Deviation from Production</TableHead> */}
                      <TableHead>Acceptable/Not Acceptable/NA <span className="text-red-500">*</span></TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deviations.map((dev, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {dev.isSystem ? dev.metric : (
                            <Input value={dev.metric} onChange={e => updateDeviation(index, 'metric', e.target.value)} />
                          )}
                        </TableCell>
                        <TableCell>
                          {dev.isSystem ? dev.deviationFromTraining.toFixed(2) : (
                            <Input type="number" value={dev.deviationFromTraining} onChange={e => updateDeviation(index, 'deviationFromTraining', e.target.value)} />
                          )}
                        </TableCell>
                        <TableCell>
                          {dev.isSystem ? dev.deviationFromLV.toFixed(2) : (
                            <Input type="number" value={dev.deviationFromLV} onChange={e => updateDeviation(index, 'deviationFromLV', e.target.value)} />
                          )}
                        </TableCell>
                        
                        {/* <TableCell>
                          {dev.isSystem ? dev.deviationFromProd.toFixed(2) : (
                            <Input type="number" value={dev.deviationFromProd} onChange={e => updateDeviation(index, 'deviationFromTraining', e.target.value)} />
                          )}
                        </TableCell> */}
                        <TableCell>
                          <Select value={dev.acceptability} onValueChange={value => updateDeviation(index, 'acceptability', value)}>
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
                          <Input
                            value={dev.comments}
                            onChange={e => updateDeviation(index, 'comments', e.target.value)}
                            placeholder="Comments"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* <Button onClick={addDeviation} variant="outline" className="mt-4">
                  Add Deviation
                </Button> */}
              </div>
            </>
          )}
        </div>

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
  );
}
