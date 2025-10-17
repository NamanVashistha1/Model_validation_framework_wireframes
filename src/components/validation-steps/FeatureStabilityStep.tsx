import { useState } from 'react';
import { Model, Finding } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Activity, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';

interface FeatureStabilityStepProps {
  model: Model;
  onComplete: () => void;
  onAddFinding: (finding: Omit<Finding, 'id'>) => void;
}

// Mock PSI trend data
const psiTrendData = [
  { month: 'Apr', psi: 0.08 },
  { month: 'May', psi: 0.12 },
  { month: 'Jun', psi: 0.15 },
  { month: 'Jul', psi: 0.18 },
  { month: 'Aug', psi: 0.22 },
  { month: 'Sep', psi: 0.28 }
];

// Mock feature stability metrics
const featureMetrics = [
  { feature: 'credit_score', psi: 0.08, csi: 0.05, iv: 2.45, status: 'stable' },
  { feature: 'debt_to_income', psi: 0.12, csi: 0.08, iv: 1.85, status: 'stable' },
  { feature: 'employment_length', psi: 0.28, csi: 0.24, iv: 1.32, status: 'drift' },
  { feature: 'loan_amount', psi: 0.15, csi: 0.11, iv: 1.98, status: 'stable' },
  { feature: 'annual_income', psi: 0.19, csi: 0.14, iv: 2.12, status: 'warning' }
];

export function FeatureStabilityStep({ model, onComplete, onAddFinding }: FeatureStabilityStepProps) {
  const [notes, setNotes] = useState('');
  const driftDetected = featureMetrics.some(f => f.status === 'drift');

  const getPSIStatus = (psi: number) => {
    if (psi < 0.1) return { label: 'Stable', color: 'bg-green-100 text-green-800' };
    if (psi < 0.25) return { label: 'Warning', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Drift', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5" />
          <h2>Feature & Stability Checks</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Population Stability Index (PSI), Characteristic Stability Index (CSI), and feature drift analysis
        </p>

        {driftDetected && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Feature drift detected! employment_length shows PSI of 0.28 (threshold: 0.25)
            </AlertDescription>
          </Alert>
        )}

        {/* PSI Trend */}
        <div className="mb-6">
          <h3 className="mb-4">Population Stability Index (PSI) Trend</h3>
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex justify-between text-sm">
              <span>Threshold Guidelines:</span>
              <div className="flex gap-4">
                <span className="text-green-600">{'<'} 0.10: Stable</span>
                <span className="text-yellow-600">0.10 - 0.25: Monitor</span>
                <span className="text-red-600">{'>'} 0.25: Significant Drift</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={psiTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 0.3]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="psi" stroke="#3b82f6" strokeWidth={2} name="PSI" />
              <Line type="monotone" dataKey={(v) => 0.1} stroke="#22c55e" strokeDasharray="5 5" name="Stable Threshold" />
              <Line type="monotone" dataKey={(v) => 0.25} stroke="#ef4444" strokeDasharray="5 5" name="Drift Threshold" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Stability Table */}
        <div className="mb-6">
          <h3 className="mb-4">Feature-Level Stability Metrics</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>PSI</TableHead>
                <TableHead>CSI</TableHead>
                <TableHead>Information Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featureMetrics.map((feature) => {
                const status = getPSIStatus(feature.psi);
                return (
                  <TableRow key={feature.feature}>
                    <TableCell>{feature.feature}</TableCell>
                    <TableCell>{feature.psi.toFixed(3)}</TableCell>
                    <TableCell>{feature.csi.toFixed(3)}</TableCell>
                    <TableCell>{feature.iv.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={status.color}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* WoE Analysis */}
        <div className="mb-6">
          <h3 className="mb-4">Weight of Evidence (WoE) Stability</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Average WoE Shift</p>
              <p className="text-2xl">0.08</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Within Tolerance</Badge>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Max WoE Shift</p>
              <p className="text-2xl">0.15</p>
              <Badge className="mt-2 bg-yellow-100 text-yellow-800">Monitor</Badge>
            </div>
          </div>
        </div>

        {/* Feature Importance Comparison */}
        <div className="mb-6">
          <h3 className="mb-4">Feature Importance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureMetrics.map(f => ({ 
              name: f.feature, 
              current: f.iv,
              baseline: f.iv * (0.9 + Math.random() * 0.2)
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="baseline" fill="#94a3b8" name="Baseline IV" />
              <Bar dataKey="current" fill="#3b82f6" name="Current IV" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Validator Notes */}
        <div className="mb-6">
          <label className="block mb-2">Stability Assessment Notes</label>
          <Textarea
            placeholder="Document observations about feature stability, drift patterns, and recommendations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => {
            if (driftDetected) {
              onAddFinding({
                category: 'Feature Stability',
                severity: 'High',
                description: 'Significant feature drift detected in employment_length (PSI: 0.28)',
                recommendation: 'Investigate cause of drift and consider model recalibration',
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
