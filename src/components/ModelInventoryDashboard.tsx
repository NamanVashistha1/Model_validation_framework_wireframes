import { useState, useMemo } from 'react';
import { Model, ModelRiskTier, ModelStatus } from '../types/model';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Search,
  Filter,
  Download,
  Calendar,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  PieChart,
  Map,
  Bookmark,
  Settings,
  Eye,
  FileText,
  Activity,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface ModelInventoryDashboardProps {
  models: Model[];
  onViewDetails: (modelId: string) => void;
  onValidate: (modelId: string) => void;
  onViewModel360?: (modelId: string) => void;
  onOpenValidationReport?: (modelId: string) => void;
  onViewMonitoringResults?: (modelId: string) => void;
  onTrackObservations?: (modelId: string) => void;
  onViewDocumentation?: (modelId: string) => void;
}

// Mock data for findings/observations
const mockFindings = [
  { id: 'F001', modelId: 'M001', severity: 'High', status: 'Open', dueDate: '2025-12-01' },
  { id: 'F002', modelId: 'M002', severity: 'Medium', status: 'Resolved', dueDate: '2025-11-15' },
  { id: 'F003', modelId: 'M003', severity: 'Low', status: 'Open', dueDate: '2025-12-15' },
];

export function ModelInventoryDashboard({
  models,
  onViewDetails,
  onValidate,
  onViewModel360,
  onOpenValidationReport,
  onViewMonitoringResults,
  onTrackObservations,
  onViewDocumentation
}: ModelInventoryDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    modelId: '',
    modelName: '',
    riskTier: 'all',
    lineOfBusiness: 'all',
    businessOwner: 'all',
    validationDueDate: '',
    regulatoryScope: 'all',
    modelStatus: 'all',
    lifecycleStatus: 'all'
  });

  // Advanced filtering logic
  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const matchesSearch = !searchTerm ||
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (filters.modelId === '' || model.id.toLowerCase().includes(filters.modelId.toLowerCase())) &&
        (filters.modelName === '' || model.name.toLowerCase().includes(filters.modelName.toLowerCase())) &&
        (filters.riskTier === 'all' || model.riskTier === filters.riskTier) &&
        (filters.lineOfBusiness === 'all' || model.lineOfBusiness === filters.lineOfBusiness) &&
        (filters.businessOwner === 'all' || model.businessOwner === filters.businessOwner || model.developer === filters.businessOwner) &&
        (filters.regulatoryScope === 'all' || model.regulatoryScope === filters.regulatoryScope) &&
        (filters.modelStatus === 'all' || model.status === filters.modelStatus) &&
        (filters.lifecycleStatus === 'all' || model.lifecycleStatus === filters.lifecycleStatus);

      return matchesSearch && matchesFilters;
    });
  }, [models, searchTerm, filters]);

  // KPI Calculations
  const kpis = useMemo(() => {
    const totalActive = models.filter(m => m.lifecycleStatus !== 'Retired').length;
    const overdue = models.filter(m => m.status === 'Overdue').length;
    const overduePercentage = totalActive > 0 ? Math.round((overdue / totalActive) * 100) : 0;

    const upcoming30 = models.filter(m => {
      const dueDate = new Date(m.nextValidationDate || '');
      const now = new Date();
      const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return daysDiff >= 0 && daysDiff <= 30;
    }).length;

    const upcoming60 = models.filter(m => {
      const dueDate = new Date(m.nextValidationDate || '');
      const now = new Date();
      const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return daysDiff > 30 && daysDiff <= 60;
    }).length;

    const upcoming90 = models.filter(m => {
      const dueDate = new Date(m.nextValidationDate || '');
      const now = new Date();
      const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return daysDiff > 60 && daysDiff <= 90;
    }).length;

    const withOpenFindings = models.filter(m =>
      mockFindings.some(f => f.modelId === m.id && f.status === 'Open')
    ).length;
    const findingsPercentage = totalActive > 0 ? Math.round((withOpenFindings / totalActive) * 100) : 0;

    return {
      totalActive,
      overdue,
      overduePercentage,
      upcoming30,
      upcoming60,
      upcoming90,
      withOpenFindings,
      findingsPercentage
    };
  }, [models]);

  // Distribution data for visualizations
  const distributions = useMemo(() => {
    const byLOB = models.reduce((acc, model) => {
      acc[model.lineOfBusiness] = (acc[model.lineOfBusiness] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byRiskTier = models.reduce((acc, model) => {
      acc[model.riskTier] = (acc[model.riskTier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byOwner = models.reduce((acc, model) => {
      const owner = model.businessOwner || model.developer;
      acc[owner] = (acc[owner] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = models.reduce((acc, model) => {
      acc[model.status] = (acc[model.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byRegulatoryScope = models.reduce((acc, model) => {
      if (model.regulatoryScope) {
        // regulatoryScope is a string, so we'll count it as-is
        acc[model.regulatoryScope] = (acc[model.regulatoryScope] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return { byLOB, byRiskTier, byOwner, byStatus, byRegulatoryScope };
  }, [models]);

  // Upcoming validations
  const upcomingValidations = useMemo(() => {
    const now = new Date();
    return models
      .filter(model => model.nextValidationDate)
      .map(model => ({
        ...model,
        daysUntilDue: Math.ceil((new Date(model.nextValidationDate!).getTime() - now.getTime()) / (1000 * 3600 * 24))
      }))
      .filter(model => model.daysUntilDue >= 0 && model.daysUntilDue <= 90)
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  }, [models]);

  // Findings summary
  const findingsSummary = useMemo(() => {
    const open = mockFindings.filter(f => f.status === 'Open').length;
    const resolved = mockFindings.filter(f => f.status === 'Resolved').length;
    const dueSoon = mockFindings.filter(f => {
      const dueDate = new Date(f.dueDate);
      const now = new Date();
      return dueDate > now && dueDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }).length;

    return { open, resolved, dueSoon };
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    // Mock export functionality
    console.log(`Exporting to ${format}...`);
    // In real implementation, this would trigger file download
  };

  const getRiskColor = (days: number) => {
    if (days < 0) return 'text-red-600 bg-red-50';
    if (days <= 30) return 'text-orange-600 bg-orange-50';
    if (days <= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Model Risk Management Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive oversight of model inventory and validation pipeline</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <Bookmark className="w-4 h-4 mr-2" />
              Bookmark
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Customize
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="list">Model List View</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Active Models</p>
                    <p className="text-2xl font-bold">{kpis.totalActive}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue Validations</p>
                    <p className="text-2xl font-bold text-red-600">{kpis.overdue}</p>
                    <p className="text-xs text-muted-foreground">{kpis.overduePercentage}% of total</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming (30/60/90 days)</p>
                    <p className="text-2xl font-bold text-orange-600">{kpis.upcoming30}/{kpis.upcoming60}/{kpis.upcoming90}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Models with Open Findings</p>
                    <p className="text-2xl font-bold text-purple-600">{kpis.withOpenFindings}</p>
                    <p className="text-xs text-muted-foreground">{kpis.findingsPercentage}% of total</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-purple-500" />
                </div>
              </Card>
            </div>

            {/* Revalidation Triggers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilters({...filters, modelStatus: 'Overdue'})}>
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-medium">Overdue Validations</p>
                    <p className="text-sm text-muted-foreground">{kpis.overdue} models require attention</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="font-medium">Performance Breaches</p>
                    <p className="text-sm text-muted-foreground">3 models with consecutive breaches</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  <div>
                    <p className="font-medium">Repeated Findings</p>
                    <p className="text-sm text-muted-foreground">2 models with unresolved issues</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Distribution Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Models by Line of Business</h3>
                <div className="space-y-3">
                  {Object.entries(distributions.byLOB).map(([lob, count]) => (
                    <div key={lob} className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                         onClick={() => handleFilterChange('lineOfBusiness', lob)}>
                      <span>{lob}</span>
                      <Badge>{count}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Models by Risk Tier</h3>
                <div className="space-y-3">
                  {Object.entries(distributions.byRiskTier).map(([tier, count]) => (
                    <div key={tier} className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                         onClick={() => handleFilterChange('riskTier', tier)}>
                      <span className={`px-2 py-1 rounded text-xs ${
                        tier === 'High' ? 'bg-red-100 text-red-800' :
                        tier === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>{tier} Risk</span>
                      <Badge>{count}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Validation Calendar & Findings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Upcoming Validations (Next 90 Days)</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {upcomingValidations.slice(0, 10).map((model) => (
                    <div key={model.id} className={`p-3 rounded border cursor-pointer hover:shadow-sm ${getRiskColor(model.daysUntilDue)}`}
                         onClick={() => onViewDetails?.(model.id)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{model.name}</p>
                          <p className="text-sm">{model.id} • {model.riskTier} Risk</p>
                        </div>
                        <Badge variant={model.daysUntilDue <= 30 ? "destructive" : "secondary"}>
                          {model.daysUntilDue <= 0 ? 'Overdue' : `${model.daysUntilDue} days`}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Observations & Findings</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{findingsSummary.open}</p>
                    <p className="text-sm text-muted-foreground">To Resolve</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{findingsSummary.resolved}</p>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{findingsSummary.dueSoon}</p>
                    <p className="text-sm text-muted-foreground">Due Soon</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Risk Heatmap Placeholder */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Risk Heatmap: Risk Tier vs Validation Compliance</h3>
              <div className="grid grid-cols-4 gap-2">
                {['High', 'Medium', 'Low'].map(riskTier => (
                  ['Compliant', 'Overdue', 'Upcoming', 'Not Due'].map(status => (
                    <div key={`${riskTier}-${status}`}
                         className={`p-4 text-center text-sm font-medium rounded ${
                           riskTier === 'High' && status === 'Overdue' ? 'bg-red-200 text-red-800' :
                           riskTier === 'High' ? 'bg-red-100 text-red-700' :
                           riskTier === 'Medium' && status === 'Overdue' ? 'bg-orange-200 text-orange-800' :
                           riskTier === 'Medium' ? 'bg-orange-100 text-orange-700' :
                           'bg-green-100 text-green-700'
                         }`}>
                      {riskTier} Risk<br/>{status}
                    </div>
                  ))
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Model List View Tab */}
          <TabsContent value="list" className="space-y-6">
            {/* Advanced Filters */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Advanced Filters</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Input
                  placeholder="Model ID"
                  value={filters.modelId}
                  onChange={(e) => handleFilterChange('modelId', e.target.value)}
                />
                <Input
                  placeholder="Model Name"
                  value={filters.modelName}
                  onChange={(e) => handleFilterChange('modelName', e.target.value)}
                />
                <Select value={filters.riskTier} onValueChange={(value: string) => handleFilterChange('riskTier', value)}>
                  <SelectTrigger><SelectValue placeholder="Risk Tier" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Tiers</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.lineOfBusiness} onValueChange={(value: string) => handleFilterChange('lineOfBusiness', value)}>
                  <SelectTrigger><SelectValue placeholder="Line of Business" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Lines</SelectItem>
                    {/* Add LOB options dynamically */}
                  </SelectContent>
                </Select>
                <Select value={filters.businessOwner} onValueChange={(value: string) => handleFilterChange('businessOwner', value)}>
                  <SelectTrigger><SelectValue placeholder="Owner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Owners</SelectItem>
                    {/* Add owner options dynamically */}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  placeholder="Validation Due Date"
                  value={filters.validationDueDate}
                  onChange={(e) => handleFilterChange('validationDueDate', e.target.value)}
                />
                <Select value={filters.regulatoryScope} onValueChange={(value: string) => handleFilterChange('regulatoryScope', value)}>
                  <SelectTrigger><SelectValue placeholder="Regulatory Scope" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scopes</SelectItem>
                    <SelectItem value="IFRS 9">IFRS 9</SelectItem>
                    <SelectItem value="Basel">Basel</SelectItem>
                    <SelectItem value="Stress Testing">Stress Testing</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.modelStatus} onValueChange={(value: string) => handleFilterChange('modelStatus', value)}>
                  <SelectTrigger><SelectValue placeholder="Model Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Model List Table */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Model Inventory ({filteredModels.length} models)</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model Name</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Risk Tier</TableHead>
                      <TableHead>Validation Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Line of Business</TableHead>
                      <TableHead>Regulatory Scope</TableHead>
                      <TableHead>Last Validation</TableHead>
                      <TableHead>Open Findings</TableHead>
                      <TableHead>Next Review</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModels.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell className="font-medium">{model.name}</TableCell>
                        <TableCell>{model.id}</TableCell>
                        <TableCell>{model.businessOwner || model.developer}</TableCell>
                        <TableCell>
                          <Badge variant={
                            model.riskTier === 'High' ? 'destructive' :
                            model.riskTier === 'Medium' ? 'secondary' : 'outline'
                          }>
                            {model.riskTier}
                          </Badge>
                        </TableCell>
                        <TableCell>{model.nextValidationDate || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={
                            model.status === 'Overdue' ? 'destructive' :
                            model.status === 'Pending Validation' ? 'secondary' : 'outline'
                          }>
                            {model.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{model.lineOfBusiness}</TableCell>
                        <TableCell>{model.regulatoryScope || 'N/A'}</TableCell>
                        <TableCell>{model.lastValidationDate || 'N/A'}</TableCell>
                        <TableCell>
                          {mockFindings.filter(f => f.modelId === model.id && f.status === 'Open').length}
                        </TableCell>
                        <TableCell>{model.nextValidationDate || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => onViewModel360?.(model.id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onValidate(model.id)}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onOpenValidationReport?.(model.id)}>
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onViewMonitoringResults?.(model.id)}>
                              <Activity className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onTrackObservations?.(model.id)}>
                              <AlertCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onViewDocumentation?.(model.id)}>
                              <FileText className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredModels.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No models found matching your criteria</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
