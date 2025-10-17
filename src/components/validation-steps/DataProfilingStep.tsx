import { useState } from 'react';
import { Model, Finding } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Database, TrendingUp, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';

interface DataProfilingStepProps {
  model: Model;
  onComplete: () => void;
  onAddFinding: (finding: Omit<Finding, 'id'>) => void;
}

// Mock data
const dataQualityMetrics = [
  { metric: 'Completeness', production: 98.5, training: 99.2, threshold: 95 },
  { metric: 'Validity', production: 97.8, training: 98.5, threshold: 95 },
  { metric: 'Consistency', production: 96.2, training: 98.1, threshold: 95 },
  { metric: 'Timeliness', production: 99.1, training: 99.0, threshold: 95 }
];

const distributionData = [
  { range: '0-10', production: 120, training: 115 },
  { range: '10-20', production: 230, training: 245 },
  { range: '20-30', production: 340, training: 325 },
  { range: '30-40', production: 280, training: 295 },
  { range: '40-50', production: 190, training: 185 },
  { range: '50+', production: 140, training: 135 }
];

const missingDataStats = [
  { variable: 'credit_score', missing: 2.1, action: 'Imputed with median' },
  { variable: 'income', missing: 3.5, action: 'Imputed with mean' },
  { variable: 'employment_length', missing: 5.2, action: 'Categorical imputation' },
  { variable: 'debt_ratio', missing: 1.8, action: 'Imputed with median' }
];

export function DataProfilingStep({ model, onComplete, onAddFinding }: DataProfilingStepProps) {
  const [notes, setNotes] = useState('');

  const handleAutoCheck = () => {
    // Simulate automated data quality check
    const hasIssues = dataQualityMetrics.some(m => m.production < m.threshold);
    if (hasIssues) {
      onAddFinding({
        category: 'Data Quality',
        severity: 'Medium',
        description: 'Data quality metrics below threshold detected',
        recommendation: 'Review data pipeline and address quality issues',
        status: 'Open',
        dateIdentified: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <h2>Data Input & Profiling</h2>
          </div>
          <Button onClick={handleAutoCheck} variant="outline">
            Run Auto-Check
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">
          Compare production data to reference/training data, analyze distributions and data quality
        </p>

        <Tabs defaultValue="quality" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quality">Data Quality</TabsTrigger>
            <TabsTrigger value="distribution">Distributions</TabsTrigger>
            <TabsTrigger value="missing">Missing Data</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          </TabsList>

          <TabsContent value="quality" className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm">
                <strong>Data Source:</strong> Production database (Oct 2024) vs Training dataset (Jan-Dec 2023)
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataQualityMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis domain={[90, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="production" fill="#3b82f6" name="Production" />
                <Bar dataKey="training" fill="#10b981" name="Training" />
                <Bar dataKey="threshold" fill="#ef4444" name="Threshold" />
              </BarChart>
            </ResponsiveContainer>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Production</TableHead>
                  <TableHead>Training</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataQualityMetrics.map((metric) => (
                  <TableRow key={metric.metric}>
                    <TableCell>{metric.metric}</TableCell>
                    <TableCell>{metric.production}%</TableCell>
                    <TableCell>{metric.training}%</TableCell>
                    <TableCell>{metric.threshold}%</TableCell>
                    <TableCell>
                      {metric.production >= metric.threshold ? (
                        <Badge className="bg-green-100 text-green-800">Pass</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Fail</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Comparing distribution of key variables between production and training data
            </p>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="production" fill="#3b82f6" name="Production" />
                <Bar dataKey="training" fill="#10b981" name="Training" />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Production Mean</p>
                <p className="text-2xl">28.4</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Training Mean</p>
                <p className="text-2xl">27.8</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Production Std Dev</p>
                <p className="text-2xl">12.6</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Training Std Dev</p>
                <p className="text-2xl">12.3</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="missing" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variable</TableHead>
                  <TableHead>Missing %</TableHead>
                  <TableHead>Imputation Strategy</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {missingDataStats.map((stat) => (
                  <TableRow key={stat.variable}>
                    <TableCell>{stat.variable}</TableCell>
                    <TableCell>{stat.missing}%</TableCell>
                    <TableCell>{stat.action}</TableCell>
                    <TableCell>
                      {stat.missing < 5 ? (
                        <Badge className="bg-green-100 text-green-800">Acceptable</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="anomalies" className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h4>Detected Anomalies</h4>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm">Outliers detected in debt_ratio variable</p>
                  <p className="text-xs text-muted-foreground mt-1">142 records (0.8%) with values {'>'}3 std deviations</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm">No anomalies in credit_score distribution</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm">Income distribution within expected range</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Comments Section */}
        <div className="mb-6">
          <label className="block mb-2">Validator Notes & Comments</label>
          <Textarea
            placeholder="Document any observations, concerns, or additional context about the data..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => {
            onAddFinding({
              category: 'Data Quality',
              severity: 'Low',
              description: 'Minor data quality observation',
              recommendation: 'Monitor in ongoing validation',
              status: 'Open',
              dateIdentified: new Date().toISOString()
            });
          }}>
            Log Finding
          </Button>
          <Button onClick={onComplete}>
            Complete Step
          </Button>
        </div>
      </Card>
    </div>
  );
}
