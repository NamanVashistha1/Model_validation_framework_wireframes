import { useState } from 'react';
import { Model, Finding } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CloudOff, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { FileText, Upload } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface DataProfilingStepProps {
  model: Model;
  onComplete: () => void;
  onAddFinding: (finding: Omit<Finding, 'id'>) => void;
  onSave?: () => void;
  onSaveAndContinue?: () => void;
  onCancel?: () => void;
}

export function DataProfilingStep({ model, onComplete, onAddFinding, onSave, onSaveAndContinue, onCancel }: DataProfilingStepProps) {
  const dataSources = ['Training', 'Last Validation', 'Production'];
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
const [prodStartDate, setProdStartDate] = useState('');
const [prodEndDate, setProdEndDate] = useState('');

  const mockPastProductions = [
    { date: '2023-09-01' },
    { date: '2023-08-01' },
    { date: '2023-07-01' }
  ];
  const [selectedProductionDate, setSelectedProductionDate] = useState('');

  const [generated, setGenerated] = useState(false);

  const features = ['credit_score', 'income', 'debt_ratio', 'employment_length'];
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(features);

  const mockDistributions: { [feature: string]: { [source: string]: { range: string; count: number }[] } } = {
    credit_score: {
      Training: [{ range: '0-300', count: 40 }, { range: '300-600', count: 220 }, { range: '600-900', count: 380 }, { range: '900+', count: 110 }],
      'Last Validation': [{ range: '0-300', count: 45 }, { range: '300-600', count: 210 }, { range: '600-900', count: 390 }, { range: '900+', count: 105 }],
      Production: [{ range: '0-300', count: 50 }, { range: '300-600', count: 200 }, { range: '600-900', count: 400 }, { range: '900+', count: 100 }]
    },
    income: {
      Training: [{ range: '0-50k', count: 250 }, { range: '50k-100k', count: 450 }, { range: '100k+', count: 140 }],
      'Last Validation': [{ range: '0-50k', count: 280 }, { range: '50k-100k', count: 420 }, { range: '100k+', count: 150 }],
      Production: [{ range: '0-50k', count: 300 }, { range: '50k-100k', count: 400 }, { range: '100k+', count: 150 }]
    },
    debt_ratio: {
      Training: [{ range: '0-0.2', count: 220 }, { range: '0.2-0.4', count: 280 }, { range: '0.4+', count: 270 }],
      'Last Validation': [{ range: '0-0.2', count: 210 }, { range: '0.2-0.4', count: 290 }, { range: '0.4+', count: 260 }],
      Production: [{ range: '0-0.2', count: 200 }, { range: '0.2-0.4', count: 300 }, { range: '0.4+', count: 250 }]
    },
    employment_length: {
      Training: [{ range: '0-5', count: 300 }, { range: '5-10', count: 250 }, { range: '10+', count: 150 }],
      'Last Validation': [{ range: '0-5', count: 280 }, { range: '5-10', count: 260 }, { range: '10+', count: 160 }],
      Production: [{ range: '0-5', count: 310 }, { range: '5-10', count: 240 }, { range: '10+', count: 150 }]
    }
  };

interface Drift {
  feature: string;
  driftValue: number;
  acceptability: string;
  remarks: string;
  isSystem: boolean;
}

const mockDrifts: Drift[] = features.map(feature => ({
  feature,
  driftValue: Math.random() * 0.5,
  acceptability: '',
  remarks: '',
  isSystem: true
}));
  const [drifts, setDrifts] = useState<Drift[]>(mockDrifts);

  const handleSourceToggle = (source: string) => {
    setSelectedSources(prev => prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]);
    if (source !== 'Production') setSelectedProductionDate('');
  };

  const handleGenerate = () => {
    setGenerated(true);
  };

const updateDrift = (index: number, field: 'feature' | 'acceptability' | 'remarks' | 'driftValue', value: string) => {
  const newDrifts = [...drifts];
  if (field === 'driftValue') {
    newDrifts[index].driftValue = parseFloat(value) || 0;
  } else {
    newDrifts[index][field] = value;
  }
  setDrifts(newDrifts);
};

const addDrift = () => {
  setDrifts([...drifts, { feature: '', driftValue: 0, acceptability: '', remarks: '', isSystem: false }]);
};

  const getChartData = (feature: string) => {
    const ranges = mockDistributions[feature].Training.map(d => d.range);
    return ranges.map(range => {
      const dataPoint: { range: string; [key: string]: string | number } = { range };
      selectedSources.forEach(source => {
        const sourceData = mockDistributions[feature][source];
        const matching = sourceData.find(d => d.range === range);
        dataPoint[source] = matching ? matching.count : 0;
      });
      return dataPoint;
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Database className="w-5 h-5" />
          <h2>Data Input & Profiling</h2>
        </div>

        <div className="space-y-6">
          <div>
            <Label>Select Data Sources</Label>
             <br/><span className="text-muted-foreground text-sm ml-2 text-red-600">*Date automatically fetched for Training & Last Validation.</span>
            <div className="space-y-2 mt-2"> 
              {dataSources.map(source => (
                <div key={source} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedSources.includes(source)}
                    onCheckedChange={() => handleSourceToggle(source)}
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
                    // <Select value={selectedProductionDate} onValueChange={setSelectedProductionDate}>
                    //   <SelectTrigger className="w-48 ml-2">
                    //     <SelectValue placeholder="Select production date" />
                    //   </SelectTrigger>
                    //   <SelectContent>
                    //     {mockPastProductions.map(prod => (
                    //       <SelectItem key={prod.date} value={prod.date}>{prod.date}</SelectItem>
                    //     ))}
                    //   </SelectContent>
                    // </Select>
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
                  {/* {selectedSources.includes(source) && <span className="text-muted-foreground text-sm ml-2">Comment : Date automatically fetched for Training/Validation.</span>} */}
                </div>
              ))}
            </div>
          </div>
{/* 
<Button 
  onClick={handleGenerate} 
  disabled={selectedSources.length === 0 || (selectedSources.includes('Production') && !selectedProductionDate)}
>
  Generate Data Profile
</Button> */}

    <Button
  onClick={handleGenerate}
  disabled={
    selectedSources.length === 0 ||
    (selectedSources.includes('Production') && (!prodStartDate || !prodEndDate))
  }
>
  Generate
</Button>

{generated && (
  <>
    <p className="text-red-600 mb-4">
      *Show the data profile as in MMG for each feature/each input. Also Insights of drifts detected (already available in MMG)
      <br/>
      Render the most suitable chart type (Line, Bar, or Step) based on the dataset characteristics.
    </p>

    {/* <div>
      <Label>Select Features (select/unselect to filter graphs)</Label>
      <Select multiple value={selectedFeatures} onValueChange={setSelectedFeatures}>
        <SelectTrigger>
          <SelectValue placeholder="Select features" />
        </SelectTrigger>
        <SelectContent>
              <SelectItem value="select-all">Select All Features</SelectItem>
              {features.map(f => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
        </SelectContent>
      </Select>
    </div> */}

              {selectedFeatures.map(feature => (
                <div key={feature} className="mb-8">
                  <h4 className="mb-4">{feature} Distribution Comparison</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getChartData(feature)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {selectedSources.map((source, idx) => (
                        <Bar key={source} dataKey={source} fill={['#8884d8', '#82ca9d', '#ffc658'][idx % 3]} />
                      ))}
                    </BarChart>
                    <span className="text-muted-foreground text-sm ml-2 text-red-600">*Requirement: Interactive chart - can select or deselect entities in the chart legend to customize the view. </span><br/>
                    <br/>
                  </ResponsiveContainer>
                </div>
              ))}

              <div>
                <h3 className="mb-4">Detected Drifts</h3>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <Button onClick={addDrift} variant="outline" style={{ padding: "8px 16px", backgroundColor:"black", color:"#fff" }}>
                  Add Drift +
                </Button>
              </div>
              
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead>Drift Value</TableHead>
                      <TableHead>Acceptable/Not Acceptable/NA <span className="text-red-500">*</span></TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
<TableBody>
  {drifts.map((drift, index) => (
    <TableRow key={index}>
      <TableCell>
        {drift.isSystem ? (
          drift.feature
        ) : (
          <Select value={drift.feature} onValueChange={value => updateDrift(index, 'feature', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a feature" />
            </SelectTrigger>
            <SelectContent>
           
                <SelectItem key="Other" value="Other">Other Feature</SelectItem>
         
            </SelectContent>
          </Select>
        )}
      </TableCell>
      <TableCell>
        {drift.isSystem ? (
          drift.driftValue.toFixed(2)
        ) : (
          <Input 
            type="number"
            value={drift.driftValue.toFixed(2)} 
            onChange={e => updateDrift(index, 'driftValue', e.target.value)} 
          />
        )}
      </TableCell>
      <TableCell>
        <Select value={drift.acceptability} onValueChange={value => updateDrift(index, 'acceptability', value)}>
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
          value={drift.remarks} 
          onChange={e => updateDrift(index, 'remarks', e.target.value)} 
          placeholder="Remarks" 
        />
      </TableCell>
    </TableRow>
  ))}
</TableBody>
                </Table>
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
            // className="bg-red-500 hover:bg-red-600 text-white"
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
            // className="bg-blue-500 hover:bg-blue-600 text-white"
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
            // className="bg-green-500 hover:bg-green-600 text-white"
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
