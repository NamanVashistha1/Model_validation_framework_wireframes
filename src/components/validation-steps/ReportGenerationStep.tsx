import { useState } from 'react';
import { Model, Finding } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, Download, Send, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';

interface ReportGenerationStepProps {
  model: Model;
  findings: Finding[];
  steps: { id: string; title: string; status: string }[];
  onComplete: () => void;
}

export function ReportGenerationStep({ model, findings, steps, onComplete }: ReportGenerationStepProps) {
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const allStepsCompleted = completedSteps === steps.length - 1; // Exclude report step itself

  const handleGenerateReport = () => {
    // In a real app, this would generate a PDF/Excel
    console.log('Generating validation report...');
  };

  const handleSubmitReport = () => {
    setIsSubmitted(true);
    onComplete();
  };

  const getSeverityStats = () => {
    return {
      critical: findings.filter(f => f.severity === 'Critical').length,
      high: findings.filter(f => f.severity === 'High').length,
      medium: findings.filter(f => f.severity === 'Medium').length,
      low: findings.filter(f => f.severity === 'Low').length,
      open: findings.filter(f => f.status === 'Open').length
    };
  };

  const stats = getSeverityStats();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" />
          <h2>Report Generation & Submission</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Generate comprehensive validation report and submit for review and approval
        </p>

        {!allStepsCompleted && (
          <Alert className="mb-6">
            <AlertDescription>
              Complete all validation steps before generating the final report.
              ({completedSteps}/{steps.length - 1} steps completed)
            </AlertDescription>
          </Alert>
        )}

        {isSubmitted && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Validation report successfully submitted for review and approval!
            </AlertDescription>
          </Alert>
        )}

        {/* Report Preview */}
        <div className="border rounded-lg p-6 mb-6 bg-white">
          <h3 className="mb-6">Validation Report Preview</h3>

          {/* Header Section */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Model Name</p>
                <p>{model.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Model ID</p>
                <p>{model.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Risk Tier</p>
                <Badge className={
                  model.riskTier === 'High' ? 'bg-red-100 text-red-800' :
                  model.riskTier === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }>
                  {model.riskTier}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Validation Date</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Validator</p>
                <p>Current User</p>
              </div>
              <div>
                <p className="text-muted-foreground">Business Owner</p>
                <p>{model.businessOwner}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Executive Summary */}
          <div className="mb-6">
            <h4 className="mb-3">Executive Summary</h4>
            <Textarea
              placeholder="Provide a high-level summary of the validation outcome, key findings, and overall assessment..."
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
              rows={4}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              This summary will appear at the beginning of the validation report
            </p>
          </div>

          <Separator className="my-6" />

          {/* Validation Activities Summary */}
          <div className="mb-6">
            <h4 className="mb-3">Validation Activities Completed</h4>
            <div className="space-y-2">
              {steps.filter(s => s.id !== 'report').map((step, index) => (
                <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span>{index + 1}. {step.title}</span>
                  </div>
                  <Badge variant={step.status === 'completed' ? 'default' : 'secondary'}>
                    {step.status === 'completed' ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Findings Summary */}
          <div className="mb-6">
            <h4 className="mb-3">Findings Summary</h4>
            
            <div className="grid grid-cols-5 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded text-center">
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-xl">7</p>
              </div>
              <div className="p-3 bg-orange-50 rounded text-center">
                <p className="text-sm text-muted-foreground mb-1">Acceptable</p>
                <p className="text-xl text-orange-600">{stats.high}</p>
              </div>
              <div className="p-3 bg-red-50 rounded text-center">
                <p className="text-sm text-muted-foreground mb-1">Non-Acceptable</p>
                <p className="text-xl text-red-600">5</p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded text-center">
                <p className="text-sm text-muted-foreground mb-1">Tracked</p>
                <p className="text-xl text-yellow-600">{stats.medium}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded text-center">
                <p className="text-sm text-muted-foreground mb-1">Model Score</p>
                <p className="text-xl text-blue-600">Tier 3</p>
              </div>
            </div>

</div>
{/* ===========================
    TRACKED OBSERVATIONS TABLE
=========================== */}
<div className="mb-10">
  <h4 className="mb-3">Tracked Observations</h4>

  {findings.filter(f => f.trackAsObservation).length > 0 ? (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Step</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Validator Remarks</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {findings.filter(f => f.trackAsObservation).map((finding) => (
            <tr key={finding.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{finding.id}</td>
              <td className="px-4 py-2">{finding.step || '-'}</td>
              <td className="px-4 py-2">{finding.category}</td>
              <td className="px-4 py-2">{finding.description}</td>
              <td className="px-4 py-2">{finding.recommendation}</td>
              <td className="px-4 py-2">{finding.status}</td>
              <td className="px-4 py-2">{new Date(finding.dateIdentified).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    // Dummy placeholder if no tracked ones yet
    <div className="border rounded-lg p-4 bg-gray-50">
      <p className="text-sm text-muted-foreground mb-2">
        (Tracked observations from findings.)
      </p>
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Step</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Validator Remarks</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              id: 'T-001',
              step: 'Drift Analysis',
              category: 'Data Drift',
              description: 'Feature “loan_amount” showing moderate shift vs last validation',
              recommendation: 'Monitor in next cycle; drift within control limits.',
              status: 'Acceptable',
              date: '2025-10-10'
            },
            {
              id: 'T-002',
              step: 'Outcome Analysis',
              category: 'Performance Stability',
              description: 'Slight AUC decline in production; needs follow-up analysis.',
              recommendation: 'Include in next validation checkpoint.',
              status: 'Non-Acceptable',
              date: '2025-10-12'
            }
          ].map((dummy) => (
            <tr key={dummy.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{dummy.id}</td>
              <td className="px-4 py-2">{dummy.step}</td>
              <td className="px-4 py-2">{dummy.category}</td>
              <td className="px-4 py-2">{dummy.description}</td>
              <td className="px-4 py-2">{dummy.recommendation}</td>
              <td className="px-4 py-2">{dummy.status}</td>
              <td className="px-4 py-2">{dummy.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>


          <Separator className="my-6" />

          {/* Conclusion & Recommendation */}
          <div className="mb-6">
            <h4 className="mb-3">Conclusion & Recommendation</h4>
            <Textarea
              placeholder="Provide overall conclusion and recommendation (e.g., Approved, Conditionally Approved, Not Approved)..."
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              rows={4}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              Include overall validation outcome and any conditions for approval
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleGenerateReport}
            disabled={!allStepsCompleted}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF Report
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGenerateReport}
            disabled={!allStepsCompleted}
          >
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>

          <div className="flex-1" />

          <Button
            onClick={handleSubmitReport}
            disabled={!allStepsCompleted || isSubmitted}
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitted ? 'Report Submitted' : 'Submit for Approval'}
          </Button>
        </div>
        <p className="text-red-600 mb-4">
      Note: The Download PDF Report button should generate a PDF that includes all recorded observations, findings, and comments from every step of the process.
    </p>
        {!allStepsCompleted && (
          <p className="text-sm text-muted-foreground mt-4 text-right">
            Complete all validation steps to enable report submission
          </p>
        )}
      </Card>
    </div>
  );
}
