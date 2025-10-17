import { useState } from 'react';
import { Model, Finding } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface OutcomeAnalysisStepProps {
  model: Model;
  onComplete: () => void;
  onAddFinding: (finding: Omit<Finding, 'id'>) => void;
}

// Mock performance metrics over time
const performanceTrend = [
  { month: 'Apr', gini: 0.52, ks: 0.38, auc: 0.76 },
  { month: 'May', gini: 0.51, ks: 0.37, auc: 0.755 },
  { month: 'Jun', gini: 0.50, ks: 0.36, auc: 0.75 },
  { month: 'Jul', gini: 0.49, ks: 0.35, auc: 0.745 },
  { month: 'Aug', gini: 0.47, ks: 0.34, auc: 0.735 },
  { month: 'Sep', gini: 0.45, ks: 0.32, auc: 0.725 }
];

// Mock metrics comparison
const metricsComparison = [
  { metric: 'Gini Coefficient', development: 0.55, production: 0.45, threshold: 0.45, status: 'borderline' },
  { metric: 'KS Statistic', development: 0.42, production: 0.32, threshold: 0.30, status: 'pass' },
  { metric: 'AUC-ROC', development: 0.78, production: 0.725, threshold: 0.70, status: 'pass' },
  { metric: 'Precision', development: 0.82, production: 0.78, threshold: 0.75, status: 'pass' },
  { metric: 'Recall', development: 0.75, production: 0.71, threshold: 0.65, status: 'pass' },
  { metric: 'F1 Score', development: 0.78, production: 0.74, threshold: 0.70, status: 'pass' }
];

// Mock ROC curve data
const rocData = Array.from({ length: 20 }, (_, i) => ({
  fpr: i / 20,
  tpr: Math.min(1, (i / 20) * 1.5 + Math.random() * 0.1)
}));

export function OutcomeAnalysisStep({ model, onComplete, onAddFinding }: OutcomeAnalysisStepProps) {
  const [notes, setNotes] = useState('');
  const hasPerformanceDrop = performanceTrend[performanceTrend.length - 1].gini < 0.45;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5" />
          <h2>Outcome Analysis & Backtesting</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Evaluate model performance metrics, trends, and conduct backtesting analysis
        </p>

        <Tabs defaultValue="metrics" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
            <TabsTrigger value="trends">Performance Trends</TabsTrigger>
            <TabsTrigger value="backtest">Backtesting</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            {/* Current Metrics */}
            <div>
              <h3 className="mb-4">Model Performance Comparison</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Development</TableHead>
                    <TableHead>Production</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metricsComparison.map((metric) => (
                    <TableRow key={metric.metric}>
                      <TableCell>{metric.metric}</TableCell>
                      <TableCell>{metric.development.toFixed(3)}</TableCell>
                      <TableCell>{metric.production.toFixed(3)}</TableCell>
                      <TableCell>{metric.threshold.toFixed(3)}</TableCell>
                      <TableCell>
                        {metric.production >= metric.threshold ? (
                          <Badge className="bg-green-100 text-green-800">Pass</Badge>
                        ) : metric.status === 'borderline' ? (
                          <Badge className="bg-yellow-100 text-yellow-800">Borderline</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Fail</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* ROC Curve */}
            <div>
              <h3 className="mb-4">ROC Curve</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fpr" name="False Positive Rate" domain={[0, 1]} />
                  <YAxis dataKey="tpr" name="True Positive Rate" domain={[0, 1]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter name="ROC Curve" data={rocData} fill="#3b82f6" line />
                  <Scatter name="Random Classifier" data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]} fill="#94a3b8" line />
                </ScatterChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  <strong>AUC-ROC:</strong> 0.725 (Production) vs 0.78 (Development)
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div>
              <h3 className="mb-4">Performance Degradation Analysis</h3>
              
              {hasPerformanceDrop && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    ⚠ Performance degradation detected: Gini coefficient dropped from 0.52 to 0.45 over 6 months
                  </p>
                </div>
              )}

              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="gini" stroke="#3b82f6" strokeWidth={2} name="Gini" />
                  <Line type="monotone" dataKey="ks" stroke="#10b981" strokeWidth={2} name="KS Statistic" />
                  <Line type="monotone" dataKey="auc" stroke="#f59e0b" strokeWidth={2} name="AUC-ROC" />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Gini - 6 Month Change</p>
                  <p className="text-2xl text-red-600">-13.5%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">KS - 6 Month Change</p>
                  <p className="text-2xl text-red-600">-15.8%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">AUC - 6 Month Change</p>
                  <p className="text-2xl text-yellow-600">-4.8%</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="backtest" className="space-y-6">
            <div>
              <h3 className="mb-4">Backtesting Results</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4>Out-of-Time Validation</h4>
                      <p className="text-sm text-muted-foreground">Q3 2024 holdout data</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Pass</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Gini Coefficient</p>
                      <p>0.47</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">KS Statistic</p>
                      <p>0.34</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4>Cross-Validation Results</h4>
                      <p className="text-sm text-muted-foreground">5-Fold CV on training data</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Pass</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Mean AUC</p>
                      <p>0.76 ± 0.02</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mean F1</p>
                      <p>0.75 ± 0.03</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4>Actual vs Predicted Analysis</h4>
                      <p className="text-sm text-muted-foreground">Default rate calibration</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Actual Default Rate</p>
                      <p>3.8%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Predicted Default Rate</p>
                      <p>3.2%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Validator Notes */}
        <div className="mb-6">
          <label className="block mb-2">Performance Assessment Notes</label>
          <Textarea
            placeholder="Document observations about model performance, degradation patterns, and recommendations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => {
            if (hasPerformanceDrop) {
              onAddFinding({
                category: 'Model Performance',
                severity: 'High',
                description: 'Significant performance degradation: Gini dropped 13.5% over 6 months',
                recommendation: 'Consider model recalibration or redevelopment',
                status: 'Open',
                dateIdentified: new Date().toISOString()
              });
            }
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
