import { Model } from '../types/model';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertCircle, Calendar, TrendingUp, Shield } from 'lucide-react';

interface ModelCardProps {
  model: Model;
  onViewDetails: (modelId: string) => void;
  onValidate: (modelId: string) => void;
}

export function ModelCard({ model, onViewDetails, onValidate }: ModelCardProps) {
  const getRiskTierColor = (tier: string) => {
    switch (tier) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending Validation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Validated': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Deployment': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = model.status === 'Overdue';
  const hasAlerts = model.alerts.length > 0;

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow ${isOverdue ? 'border-red-300' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="cursor-pointer hover:text-primary" onClick={() => onViewDetails(model.id)}>
              {model.name}
            </h3>
            {hasAlerts && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
          <p className="text-muted-foreground text-sm">{model.id}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={getRiskTierColor(model.riskTier)}>
            {model.riskTier} Risk
          </Badge>
          <Badge className={getStatusColor(model.status)}>
            {model.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Owner:</span>
          <span>{model.businessOwner}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Line of Business:</span>
          <span>{model.lineOfBusiness}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Last Validation:</span>
          <span>{new Date(model.lastValidationDate).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Next Validation:</span>
          <span className={isOverdue ? 'text-red-600' : ''}>
            {new Date(model.nextValidationDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Frequency:</span>
          <span>{model.validationFrequency}</span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Regulatory Scope:</span>
          <span className="ml-2">{model.regulatoryScope}</span>
        </div>
      </div>

      {hasAlerts && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm">
            <span className="text-red-800">
              {model.alerts.length} Alert{model.alerts.length > 1 ? 's' : ''}:
            </span>
            <span className="ml-2 text-red-700">{model.alerts[0].message}</span>
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => onViewDetails(model.id)}>
          View Details
        </Button>
        <Button 
          className="flex-1" 
          onClick={() => onValidate(model.id)}
          variant={isOverdue ? 'destructive' : 'default'}
        >
          {isOverdue ? 'Validate Now' : 'Launch Validation'}
        </Button>
      </div>
    </Card>
  );
}
