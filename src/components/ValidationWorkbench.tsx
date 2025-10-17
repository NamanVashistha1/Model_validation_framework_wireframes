import { useState } from 'react';
import { Model, Finding, ValidationStepStatus } from '../types/model';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { ArrowLeft, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { ConceptualSoundnessStep } from './validation-steps/ConceptualSoundnessStep';
import { DataProfilingStep } from './validation-steps/DataProfilingStep';
import { FeatureStabilityStep } from './validation-steps/FeatureStabilityStep';
import { OutcomeAnalysisStep } from './validation-steps/OutcomeAnalysisStep';
import { InterpretabilityStep } from './validation-steps/InterpretabilityStep';
import { FindingsStep } from './validation-steps/FindingsStep';
import { ReportGenerationStep } from './validation-steps/ReportGenerationStep';

interface ValidationWorkbenchProps {
  model: Model;
  onBack: () => void;
}

interface ValidationStepState {
  id: string;
  title: string;
  status: ValidationStepStatus;
}

export function ValidationWorkbench({ model, onBack }: ValidationWorkbenchProps) {
  const [steps, setSteps] = useState<ValidationStepState[]>([
    { id: 'conceptual', title: 'Conceptual Soundness', status: 'not-started' },
    { id: 'data', title: 'Data Input & Profiling', status: 'not-started' },
    { id: 'features', title: 'Feature & Stability Checks', status: 'not-started' },
    { id: 'outcomes', title: 'Outcome Analysis & Backtesting', status: 'not-started' },
    { id: 'interpretability', title: 'Interpretability & Monitoring', status: 'not-started' },
    { id: 'findings', title: 'Findings & Issues', status: 'not-started' },
    { id: 'report', title: 'Report Generation', status: 'not-started' }
  ]);

  const [currentStep, setCurrentStep] = useState('conceptual');
  const [findings, setFindings] = useState<Finding[]>([]);

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const updateStepStatus = (stepId: string, status: ValidationStepStatus) => {
    setSteps(steps.map(s => s.id === stepId ? { ...s, status } : s));
  };

  const addFinding = (finding: Omit<Finding, 'id'>) => {
    const newFinding: Finding = {
      ...finding,
      id: `F-${Date.now()}`
    };
    setFindings([...findings, newFinding]);
  };

  const getStepIcon = (status: ValidationStepStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Circle className="w-5 h-5 text-blue-600 fill-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="mb-1">Validation Workbench</h1>
              <p className="text-muted-foreground">{model.name} ({model.id})</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Progress</p>
              <p>{completedSteps} of {steps.length} steps completed</p>
            </div>
          </div>

          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Step Navigator */}
          <div className="col-span-3">
            <Card className="p-4 sticky top-28">
              <h3 className="mb-4">Validation Steps</h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentStep === step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getStepIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{index + 1}. {step.title}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {findings.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <p className="text-sm">Findings Log</p>
                  </div>
                  <p className="text-2xl">{findings.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {findings.filter(f => f.severity === 'Critical' || f.severity === 'High').length} High/Critical
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            <Tabs value={currentStep} onValueChange={setCurrentStep}>
              <TabsContent value="conceptual">
                <ConceptualSoundnessStep
                  model={model}
                  onComplete={() => updateStepStatus('conceptual', 'completed')}
                  onAddFinding={addFinding}
                />
              </TabsContent>

              <TabsContent value="data">
                <DataProfilingStep
                  model={model}
                  onComplete={() => updateStepStatus('data', 'completed')}
                  onAddFinding={addFinding}
                />
              </TabsContent>

              <TabsContent value="features">
                <FeatureStabilityStep
                  model={model}
                  onComplete={() => updateStepStatus('features', 'completed')}
                  onAddFinding={addFinding}
                />
              </TabsContent>

              <TabsContent value="outcomes">
                <OutcomeAnalysisStep
                  model={model}
                  onComplete={() => updateStepStatus('outcomes', 'completed')}
                  onAddFinding={addFinding}
                />
              </TabsContent>

              <TabsContent value="interpretability">
                <InterpretabilityStep
                  model={model}
                  onComplete={() => updateStepStatus('interpretability', 'completed')}
                  onAddFinding={addFinding}
                />
              </TabsContent>

              <TabsContent value="findings">
                <FindingsStep
                  findings={findings}
                  onComplete={() => updateStepStatus('findings', 'completed')}
                  onUpdateFindings={setFindings}
                />
              </TabsContent>

              <TabsContent value="report">
                <ReportGenerationStep
                  model={model}
                  findings={findings}
                  steps={steps}
                  onComplete={() => updateStepStatus('report', 'completed')}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
