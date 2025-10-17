import { Model } from '../types/model';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ArrowLeft, AlertCircle, FileText, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ModelOverviewProps {
  model: Model;
  onBack: () => void;
  onLaunchValidation: (modelId: string) => void;
}

export function ModelOverview({ model, onBack, onLaunchValidation }: ModelOverviewProps) {
  const lifecycleSteps = ['Commissioned', 'Validated', 'Deployed', 'Monitored', 'Retired'];
  const currentStepIndex = lifecycleSteps.indexOf(model.lifecycleStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="mb-2">{model.name}</h1>
              <p className="text-muted-foreground">{model.id}</p>
            </div>
            <Button onClick={() => onLaunchValidation(model.id)} size="lg">
              Launch Validation Workbench
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {model.alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {model.alerts.map(alert => (
              <Alert key={alert.id} variant={alert.severity === 'Critical' || alert.severity === 'High' ? 'destructive' : 'default'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <span>{alert.message}</span>
                  <span className="ml-2 text-sm">({new Date(alert.date).toLocaleDateString()})</span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Model Metadata */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5" />
            <h2>Model Metadata</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Purpose</p>
              <p>{model.purpose}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Line of Business</p>
              <p>{model.lineOfBusiness}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Business Owner</p>
              <p>{model.businessOwner}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Developer</p>
              <p>{model.developer}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Risk Tier</p>
              <Badge className={
                model.riskTier === 'High' ? 'bg-red-100 text-red-800' :
                model.riskTier === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }>
                {model.riskTier} Risk
              </Badge>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Regulatory Scope</p>
              <p>{model.regulatoryScope}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Validation Frequency</p>
              <p>{model.validationFrequency}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Status</p>
              <Badge>{model.status}</Badge>
            </div>
          </div>
        </Card>

        {/* Lifecycle Status */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5" />
            <h2>Model Lifecycle</h2>
          </div>
          
          <div className="flex items-center justify-between">
            {lifecycleSteps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStepIndex ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {index < currentStepIndex ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <p className="text-sm mt-2">{step}</p>
                </div>
                {index < lifecycleSteps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Validation History */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5" />
              <h2>Validation History</h2>
            </div>
            
            {model.validationHistory.length > 0 ? (
              <div className="space-y-4">
                {model.validationHistory.map(record => (
                  <div key={record.id} className="border-l-2 border-primary pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <p>{new Date(record.date).toLocaleDateString()}</p>
                      <Badge variant="outline">{record.outcome}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Validator: {record.validator}</p>
                    <p className="text-sm text-muted-foreground">Findings: {record.findings}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No validation history available</p>
            )}
          </Card>

          {/* Monitoring Alerts */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5" />
              <h2>Recent Monitoring Alerts</h2>
            </div>
            
            {model.monitoringAlerts.length > 0 ? (
              <div className="space-y-4">
                {model.monitoringAlerts.map(alert => (
                  <div key={alert.id} className={`p-3 rounded border ${
                    alert.value > alert.threshold ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex justify-between items-start mb-1">
                      <p>{alert.metric}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(alert.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span>Value: <strong>{alert.value.toFixed(3)}</strong></span>
                      <span>Threshold: <strong>{alert.threshold.toFixed(3)}</strong></span>
                    </div>
                    {alert.value > alert.threshold && (
                      <p className="text-sm text-red-600 mt-1">⚠ Threshold exceeded</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No monitoring alerts</p>
            )}
          </Card>
        </div>

        {/* Validation Dates */}
        <Card className="p-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Validation Date</p>
              <p className="text-lg">{new Date(model.lastValidationDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Next Validation Date</p>
              <p className={`text-lg ${model.status === 'Overdue' ? 'text-red-600' : ''}`}>
                {new Date(model.nextValidationDate).toLocaleDateString()}
                {model.status === 'Overdue' && <span className="ml-2 text-sm">(Overdue)</span>}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
