import { useState } from 'react';
import { Model, Finding } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Brain, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';

interface InterpretabilityStepProps {
  model: Model;
  onComplete: () => void;
  onAddFinding: (finding: Omit<Finding, 'id'>) => void;
}

// Mock SHAP values
const shapValues = [
  { feature: 'credit_score', importance: 0.35, direction: 'positive' },
  { feature: 'debt_to_income', importance: 0.28, direction: 'negative' },
  { feature: 'employment_length', importance: 0.18, direction: 'positive' },
  { feature: 'loan_amount', importance: 0.12, direction: 'negative' },
  { feature: 'annual_income', importance: 0.07, direction: 'positive' }
];

// Mock feature importance comparison
const featureImportance = [
  { feature: 'credit_score', current: 0.35, baseline: 0.38 },
  { feature: 'debt_to_income', current: 0.28, baseline: 0.25 },
  { feature: 'employment_length', current: 0.18, baseline: 0.20 },
  { feature: 'loan_amount', current: 0.12, baseline: 0.10 },
  { feature: 'annual_income', current: 0.07, baseline: 0.07 }
];

export function InterpretabilityStep({ model, onComplete, onAddFinding }: InterpretabilityStepProps) {
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5" />
          <h2>Interpretability & Explainability</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Model explainability using SHAP values, feature importance, and interpretability metrics
        </p>

        <Tabs defaultValue="shap" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shap">SHAP Analysis</TabsTrigger>
            <TabsTrigger value="importance">Feature Importance</TabsTrigger>
            <TabsTrigger value="monitoring">Ongoing Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="shap" className="space-y-6">
            <div>
              <h3 className="mb-4">Global Feature Importance (SHAP Values)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Average absolute SHAP values showing global feature impact on model predictions
              </p>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={shapValues} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 0.4]} />
                  <YAxis dataKey="feature" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="importance" fill="#3b82f6" name="SHAP Value" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 gap-3">
                {shapValues.map((feature) => (
                  <div key={feature.feature} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>{feature.feature}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          Impact: {(feature.importance * 100).toFixed(1)}%
                        </span>
                        <Badge className={
                          feature.direction === 'positive' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }>
                          {feature.direction === 'positive' ? '↑ Increases Score' : '↓ Decreases Score'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="mb-2">Interpretation Summary</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>credit_score is the strongest predictor (35% of model decisions)</li>
                <li>debt_to_income ratio shows expected negative relationship</li>
                <li>Feature interactions are minimal and well-understood</li>
                <li>No unexpected or unexplainable patterns detected</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="importance" className="space-y-6">
            <div>
              <h3 className="mb-4">Feature Importance Stability</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comparing current feature importance with baseline (development) values
              </p>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={featureImportance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="feature" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 0.4]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="baseline" fill="#94a3b8" name="Baseline (Development)" />
                  <Bar dataKey="current" fill="#3b82f6" name="Current (Production)" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="mb-3">Importance Shifts</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>credit_score:</span>
                    <span className="text-red-600">-7.9% (0.38 → 0.35)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>debt_to_income:</span>
                    <span className="text-green-600">+12.0% (0.25 → 0.28)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>employment_length:</span>
                    <span className="text-red-600">-10.0% (0.20 → 0.18)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>loan_amount:</span>
                    <span className="text-green-600">+20.0% (0.10 → 0.12)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>annual_income:</span>
                    <span className="text-gray-600">No change (0.07)</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div>
              <h3 className="mb-4">Interpretability Monitoring Dashboard</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-muted-foreground">Model Transparency Score</p>
                  </div>
                  <p className="text-3xl">8.5/10</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">High</Badge>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <p className="text-sm text-muted-foreground">Explainability Coverage</p>
                  </div>
                  <p className="text-3xl">94%</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">Excellent</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="mb-2">Prediction Explanations</h4>
                  <p className="text-sm text-muted-foreground">
                    94% of predictions can be explained within 2 standard deviations of SHAP values
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="mb-2">Feature Contribution Consistency</h4>
                  <p className="text-sm text-muted-foreground">
                    Feature contributions remain consistent across different population segments
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="mb-2">Decision Boundary Clarity</h4>
                  <p className="text-sm text-muted-foreground">
                    Clear separation between approval and rejection zones with minimal ambiguity
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="mb-2">Counterfactual Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Average of 2.3 feature changes required to flip prediction outcome
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="mb-2">Monitoring Alerts</h4>
              <p className="text-sm">
                ⚠ debt_to_income feature importance increased by 12% - Monitor for potential overfitting
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Validator Notes */}
        <div className="mb-6">
          <label className="block mb-2">Interpretability Assessment Notes</label>
          <Textarea
            placeholder="Document observations about model explainability, feature importance shifts, and interpretability concerns..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => {
            onAddFinding({
              category: 'Interpretability',
              severity: 'Low',
              description: 'Feature importance shift detected in debt_to_income (+12%)',
              recommendation: 'Continue monitoring for stability',
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
