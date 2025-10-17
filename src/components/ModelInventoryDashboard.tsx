import { useState } from 'react';
import { Model, ModelRiskTier, ModelStatus } from '../types/model';
import { ModelCard } from './ModelCard';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter } from 'lucide-react';
import { Badge } from './ui/badge';

interface ModelInventoryDashboardProps {
  models: Model[];
  onViewDetails: (modelId: string) => void;
  onValidate: (modelId: string) => void;
}

export function ModelInventoryDashboard({ models, onViewDetails, onValidate }: ModelInventoryDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLOB, setFilterLOB] = useState<string>('all');
  const [filterRiskTier, setFilterRiskTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const linesOfBusiness = Array.from(new Set(models.map(m => m.lineOfBusiness)));
  
  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLOB = filterLOB === 'all' || model.lineOfBusiness === filterLOB;
    const matchesRisk = filterRiskTier === 'all' || model.riskTier === filterRiskTier;
    const matchesStatus = filterStatus === 'all' || model.status === filterStatus;
    
    return matchesSearch && matchesLOB && matchesRisk && matchesStatus;
  });

  const stats = {
    total: models.length,
    overdue: models.filter(m => m.status === 'Overdue').length,
    pendingValidation: models.filter(m => m.status === 'Pending Validation').length,
    highRisk: models.filter(m => m.riskTier === 'High').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Model Validation Workbench</h1>
          <p className="text-muted-foreground">
            Centralized platform for managing model validation activities
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-muted-foreground text-sm mb-1">Total Models</p>
            <p className="text-3xl">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-muted-foreground text-sm mb-1">Overdue</p>
            <p className="text-3xl text-red-600">{stats.overdue}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-muted-foreground text-sm mb-1">Pending Validation</p>
            <p className="text-3xl text-orange-600">{stats.pendingValidation}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-muted-foreground text-sm mb-1">High Risk Models</p>
            <p className="text-3xl text-blue-600">{stats.highRisk}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h3>Search and Filter</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterLOB} onValueChange={setFilterLOB}>
              <SelectTrigger>
                <SelectValue placeholder="Line of Business" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lines of Business</SelectItem>
                {linesOfBusiness.map(lob => (
                  <SelectItem key={lob} value={lob}>{lob}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterRiskTier} onValueChange={setFilterRiskTier}>
              <SelectTrigger>
                <SelectValue placeholder="Risk Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Tiers</SelectItem>
                <SelectItem value="High">High Risk</SelectItem>
                <SelectItem value="Medium">Medium Risk</SelectItem>
                <SelectItem value="Low">Low Risk</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Pending Validation">Pending Validation</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Validated">Validated</SelectItem>
                <SelectItem value="In Deployment">In Deployment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(filterLOB !== 'all' || filterRiskTier !== 'all' || filterStatus !== 'all' || searchTerm) && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filterLOB !== 'all' && <Badge variant="secondary">{filterLOB}</Badge>}
              {filterRiskTier !== 'all' && <Badge variant="secondary">{filterRiskTier} Risk</Badge>}
              {filterStatus !== 'all' && <Badge variant="secondary">{filterStatus}</Badge>}
              {searchTerm && <Badge variant="secondary">Search: "{searchTerm}"</Badge>}
            </div>
          )}
        </div>

        {/* Model Cards Grid */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {filteredModels.length} of {models.length} models
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredModels.map(model => (
            <ModelCard
              key={model.id}
              model={model}
              onViewDetails={onViewDetails}
              onValidate={onValidate}
            />
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-muted-foreground">No models found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
