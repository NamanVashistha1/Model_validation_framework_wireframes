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
                <p className="text-xl">{findings.length}</p>
              </div>
              <div className="p-3 bg-red-50 rounded text-center">
                <p className="text-sm text-muted-foreground mb-1">Critical</p>
                <p className="text-xl text-red-600">{stats.critical}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded text-center">
                <p className="text-sm text-muted-foreground mb-1">High</p>
                <p className="text-xl text-orange-600">{stats.high}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded text-center">
                <p className="text-sm text-muted-foreground mb-1">Medium</p>
                <p className="text-xl text-yellow-600">{stats.medium}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded text-center">
                <p className="text-sm text-muted-foreground mb-1">Low</p>
                <p className="text-xl text-blue-600">{stats.low}</p>
              </div>
            </div>

            {findings.length > 0 && (
              <div className="space-y-2">
                {findings.slice(0, 3).map((finding) => (
                  <div key={finding.id} className="p-3 border rounded">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={
                        finding.severity === 'Critical' || finding.severity === 'High'
                          ? 'bg-red-100 text-red-800'
                          : finding.severity === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }>
                        {finding.severity}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{finding.category}</span>
                    </div>
                    <p className="text-sm">{finding.description}</p>
                  </div>
                ))}
                {findings.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    + {findings.length - 3} more findings in full report
                  </p>
                )}
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

        {!allStepsCompleted && (
          <p className="text-sm text-muted-foreground mt-4 text-right">
            Complete all validation steps to enable report submission
          </p>
        )}
      </Card>
    </div>
  );
}
