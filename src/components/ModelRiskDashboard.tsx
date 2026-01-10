import React, { useState, useMemo } from 'react';
import { Model, ModelRiskTier, ModelStatus } from '../types/model';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ModelDashboardChart from './ModelDashboardChart';
import ValidationPipelineOverview from './ValidationCalendar';
import RevalidationTriggers from './ExceptionValidationCards';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  Search,
  Filter,
  Download,
  Calendar,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Map,
  Bookmark,
  Settings,
  Eye,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Users,
  Building,
  Target,
  Zap,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// Mock data for findings/observations
const mockFindings = [
  { id: 'F001', modelId: 'M001', severity: 'Critical', status: 'Open', dueDate: '2025-12-01', department: 'Retail' },
  { id: 'F002', modelId: 'M002', severity: 'High', status: 'Open', dueDate: '2025-11-15', department: 'Corporate' },
  { id: 'F003', modelId: 'M003', severity: 'Medium', status: 'Resolved', dueDate: '2025-11-20', department: 'Retail' },
  { id: 'F004', modelId: 'M004', severity: 'Low', status: 'Open', dueDate: '2025-12-15', department: 'SME' },
];

interface ModelRiskDashboardProps {
  models: Model[];
  onViewModel?: (modelId: string) => void;
  onViewDocumentation?: (modelId: string) => void;
  onViewValidationReport?: (modelId: string) => void;
  onMonitorModel?: (modelId: string) => void;
  onInitiateValidation?: (modelId: string) => void;
  onViewModel360?: (modelId: string) => void;
  onNavigateToList?: (filters?: any) => void;
}

export function ModelRiskDashboard({
  models,
  onViewModel,
  onViewDocumentation,
  onViewValidationReport,
  onMonitorModel,
  onInitiateValidation,
  onViewModel360,
  onNavigateToList
}: ModelRiskDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState('overdue');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Local state for KPI tile dropdowns
  const [activeSelectValue, setActiveSelectValue] = useState("");
  const [deployedSelectValue, setDeployedSelectValue] = useState("");
  const [overdueSelectValue, setOverdueSelectValue] = useState("");
  const [dueThisMonthSelectValue, setDueThisMonthSelectValue] = useState("");
  const [filters, setFilters] = useState({
    modelId: '',
    modelName: '',
    riskTier: 'all',
    department: 'all',
    owner: 'all',
    validationDueDate: '',
    validationDueDateStart: '',
    validationDueDateEnd: '',
    regulatoryScope: 'all',
    validationStatus: 'all',
    validationSource: 'all',
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
        (filters.department === 'all' || model.lineOfBusiness === filters.department) &&
        (filters.owner === 'all' || model.businessOwner === filters.owner || model.developer === filters.owner) &&
        (filters.regulatoryScope === 'all' || model.regulatoryScope === filters.regulatoryScope) &&
        (filters.validationStatus === 'all' || model.status === filters.validationStatus) &&
        (filters.validationSource === 'all' || (model as any).validationSource === filters.validationSource);

      return matchesSearch && matchesFilters;
    });
  }, [models, searchTerm, filters]);

  // KPI Calculations
  const kpis = useMemo(() => {
    const totalActive = models.filter(m => m.lifecycleStatus !== 'Retired').length;
    const totalDeployed = models.filter(m => m.lifecycleStatus === 'Deployed').length;

    const overdue = models.filter(m => m.status === 'Overdue').length;
    const overduePercentage = totalActive > 0 ? Math.round((overdue / totalActive) * 100) : 0;

    const thisMonth = new Date();
    const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
    const monthEnd = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 0);

    const dueThisMonth = models.filter(m => {
      if (!m.nextValidationDate) return false;
      const dueDate = new Date(m.nextValidationDate);
      return dueDate >= monthStart && dueDate <= monthEnd;
    }).length;

    const completedThisMonth = models.filter(m => {
      if (!m.lastValidationDate) return false;
      const lastDate = new Date(m.lastValidationDate);
      return lastDate >= monthStart && lastDate <= monthEnd;
    }).length;

    const pendingThisMonth = dueThisMonth - completedThisMonth;

    // Pending validations by source
    const pendingBySource = models
      .filter(m => m.status === 'Pending Validation')
      .reduce((acc, model) => {
        const source = (model as any).validationSource || 'Unknown';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const withOpenFindings = models.filter(m =>
      mockFindings.some(f => f.modelId === m.id && f.status === 'Open')
    ).length;
    const findingsPercentage = totalActive > 0 ? Math.round((withOpenFindings / totalActive) * 100) : 0;

    return {
      totalActive,
      totalDeployed,
      overdue,
      overduePercentage,
      dueThisMonth,
      completedThisMonth,
      pendingThisMonth,
      pendingBySource,
      withOpenFindings,
      findingsPercentage
    };
  }, [models]);

  // Distribution data for charts
  const chartData = useMemo(() => {
    const byTier = Object.entries(models.reduce((acc, model) => {
      acc[model.riskTier] = (acc[model.riskTier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }));

    const byDepartment = Object.entries(models.reduce((acc, model) => {
      acc[model.lineOfBusiness] = (acc[model.lineOfBusiness] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }));

    const byRegulatoryScope = Object.entries(models.reduce((acc, model) => {
      if (model.regulatoryScope) {
        acc[model.regulatoryScope] = (acc[model.regulatoryScope] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }));

    const byValidationSource = Object.entries(models.reduce((acc, model) => {
      const source = (model as any).validationSource || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }));

    const validatedVsDue = [
      { name: 'Validated', value: models.filter(m => m.status === 'Validated').length, color: '#25A900' },
      { name: 'Validation Due', value: models.filter(m => m.status === 'Pending Validation' || m.status === 'Overdue').length, color: '#FF9B21' }
    ];

    // Findings trend data (mock)
    const findingsTrend = [
      { month: 'May', open: 12, resolved: 8 },
      { month: 'Jun', open: 15, resolved: 10 },
      { month: 'Jul', open: 18, resolved: 12 },
      { month: 'Aug', open: 14, resolved: 15 },
      { month: 'Sep', open: 16, resolved: 13 },
      { month: 'Oct', open: 13, resolved: 11 }
    ];

    // Performance monitoring scatter data (mock)
    const performanceData = [
      { model: 'PD Model A', deviation: 2.1, riskTier: 'High', department: 'Retail' },
      { model: 'LGD Model B', deviation: 1.8, riskTier: 'Medium', department: 'Corporate' },
      { model: 'EAD Model C', deviation: 0.9, riskTier: 'Low', department: 'SME' },
      { model: 'Stress Model D', deviation: 3.2, riskTier: 'High', department: 'Retail' },
      { model: 'CCF Model E', deviation: 1.5, riskTier: 'Medium', department: 'Corporate' }
    ];

    return {
      byTier,
      byDepartment,
      byRegulatoryScope,
      byValidationSource,
      validatedVsDue,
      findingsTrend,
      performanceData
    };
  }, [models]);

  // Overdue analytics
  const overdueAnalytics = useMemo(() => {
    const overdueModels = models.filter(m => m.status === 'Overdue');

    const byDepartment = overdueModels.reduce((acc, model) => {
      acc[model.lineOfBusiness] = (acc[model.lineOfBusiness] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byTier = overdueModels.reduce((acc, model) => {
      acc[model.riskTier] = (acc[model.riskTier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Days past due categories
    const byDaysPastDue = overdueModels.reduce((acc, model) => {
      if (model.nextValidationDate) {
        const dueDate = new Date(model.nextValidationDate);
        const now = new Date();
        const daysPast = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));

        if (daysPast <= 30) acc['1-30 days'] = (acc['1-30 days'] || 0) + 1;
        else if (daysPast <= 60) acc['31-60 days'] = (acc['31-60 days'] || 0) + 1;
        else if (daysPast <= 90) acc['61-90 days'] = (acc['61-90 days'] || 0) + 1;
        else acc['90+ days'] = (acc['90+ days'] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total: overdueModels.length,
      byDepartment,
      byTier,
      byDaysPastDue
    };
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
    const notComplied = mockFindings.filter(f => {
      const dueDate = new Date(f.dueDate);
      const now = new Date();
      return dueDate < now && f.status === 'Open';
    }).length;

    return { open, resolved, dueSoon, notComplied };
  }, []);

  // Upcoming validations
  const upcomingValidations = useMemo(() => {
    const now = new Date();
    const validations = models
      .filter(model => model.nextValidationDate)
      .map(model => ({
        ...model,
        daysUntilDue: Math.ceil((new Date(model.nextValidationDate!).getTime() - now.getTime()) / (1000 * 3600 * 24))
      }))
      .filter(model => model.daysUntilDue >= 0 && model.daysUntilDue <= 90)
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

    // Group by time periods
    const byPeriod = {
      'Next 30 days': validations.filter(m => m.daysUntilDue <= 30).length,
      '31-60 days': validations.filter(m => m.daysUntilDue > 30 && m.daysUntilDue <= 60).length,
      '61-90 days': validations.filter(m => m.daysUntilDue > 60 && m.daysUntilDue <= 90).length
    };

    return { models: validations.slice(0, 10), byPeriod };
  }, [models]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Exporting to ${format}...`);
  };

  const getRiskColor = (days: number) => {
    if (days < 0) return 'text-red-600 bg-red-50 border-red-200';
    if (days <= 30) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (days <= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Model Risk Management Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive oversight of model inventory and validation pipeline</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
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

        {/* Global Filters Panel */}
        {showFilters && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Global Filters</h3>
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
              <Select value={filters.department} onValueChange={(value: string) => handleFilterChange('department', value)}>
                <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="SME">SME</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.owner} onValueChange={(value: string) => handleFilterChange('owner', value)}>
                <SelectTrigger><SelectValue placeholder="Owner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
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
                  <SelectItem value="IRB">IRB</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.validationStatus} onValueChange={(value: string) => handleFilterChange('validationStatus', value)}>
                <SelectTrigger><SelectValue placeholder="Validation Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Pending Validation">Pending Validation</SelectItem>
                  <SelectItem value="Validated">Validated</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.validationSource} onValueChange={(value: string) => handleFilterChange('validationSource', value)}>
                <SelectTrigger><SelectValue placeholder="Validation Source" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Exception">Exception</SelectItem>
                  <SelectItem value="Validator Initiated">Validator Initiated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        )}

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Model Risk Dashboard</TabsTrigger>
            <TabsTrigger value="list">Model List View</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* SECTION 1: HEADLINE KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Total Active Models</p>
                    <p className="text-2xl font-bold text-blue-600">{kpis.totalActive}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                    <Select
                      value={activeSelectValue}
                      onValueChange={(val: string) => {
                        if (val === "view") {
                          setSelectedFilter('active');
                          setActiveTab('list');
                        }
                        setActiveSelectValue("");
                      }}
                    >
                      <SelectTrigger className="w-8 h-8 p-0 border-none bg-transparent hover:bg-gray-100 [&>svg]:hidden">
                        <span className="text-gray-500 text-lg">⋯</span>
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="view">View Models</SelectItem>
                   
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Total Models Deployed</p>
                    <p className="text-2xl font-bold text-green-600">{kpis.totalDeployed}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-6 h-6 text-green-500" />
                    <Select
                      value={deployedSelectValue}
                      onValueChange={(val: string) => {
                        if (val === "view") {
                          setSelectedFilter('deployed');
                          setActiveTab('list');
                        }
                        setDeployedSelectValue("");
                      }}
                    >
                      <SelectTrigger className="w-8 h-8 p-0 border-none bg-transparent hover:bg-gray-100 [&>svg]:hidden">
                        <span className="text-gray-500 text-lg">⋯</span>
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="view">View Models</SelectItem>
                   
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">% Models Overdue</p>
                    <p className="text-2xl font-bold text-red-600">{kpis.overduePercentage}%</p>
                    <p className="text-xs text-muted-foreground">{kpis.overdue} models</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <Select
                      value={overdueSelectValue}
                      onValueChange={(val: string) => {
                        if (val === "view") {
                          setSelectedFilter('overdue');
                          setActiveTab('list');
                        }
                        setOverdueSelectValue("");
                      }}
                    >
                      <SelectTrigger className="w-8 h-8 p-0 border-none bg-transparent hover:bg-gray-100 [&>svg]:hidden">
                        <span className="text-gray-500 text-lg">⋯</span>
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="view">View Models</SelectItem>

                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="p-4" >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">This Month: Due vs Completed</p>
                    <p className="text-2xl font-bold text-orange-600">{kpis.dueThisMonth}</p>
                    <p className="text-xs text-muted-foreground">
                      {kpis.completedThisMonth} completed, {kpis.pendingThisMonth} pending
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-6 h-6 text-orange-500" />
                    <Select
                      value={dueThisMonthSelectValue}
                      onValueChange={(val: string) => {
                        if (val === "view") {
                          setSelectedFilter('dueThisMonth');
                          setActiveTab('list');
                        }
                        setDueThisMonthSelectValue("");
                      }}
                    >
                      <SelectTrigger className="w-8 h-8 p-0 border-none bg-transparent hover:bg-gray-100 [&>svg]:hidden">
                        <span className="text-gray-500 text-lg">⋯</span>
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="view">View Models</SelectItem>

                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>

            {/* MODEL DASHBOARD: SUMMARY KPIs & INVENTORY INSIGHTS */}
            <ModelDashboardChart onSwitchToListTab={() => setActiveTab('list')} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: % Models With Open Observations / Findings */}
              {/* <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">% Models With Open Observations / Findings</h3>
                    <Select defaultValue="department">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="department">By Department</SelectItem>
                        <SelectItem value="tier">By Risk Tier</SelectItem>
                        <SelectItem value="owner">By Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-gray-200"></div>
                      <div
                        className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-t-transparent border-r-transparent"
                        style={{
                          borderBottomColor: kpis.findingsPercentage > 40 ? '#DC2626' : kpis.findingsPercentage > 20 ? '#F59E0B' : '#10B981',
                          borderLeftColor: kpis.findingsPercentage > 40 ? '#DC2626' : kpis.findingsPercentage > 20 ? '#F59E0B' : '#10B981',
                          transform: `rotate(${(kpis.findingsPercentage / 100) * 360}deg)`
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${
                          kpis.findingsPercentage > 40 ? 'text-red-600' :
                          kpis.findingsPercentage > 20 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {Math.round((mockFindings.filter(f => f.status === 'Open').length / models.filter(m => m.lifecycleStatus !== 'Retired').length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-muted-foreground">{kpis.withOpenFindings} models with open items</span>
                      <ArrowDown className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">-3% vs last month</span>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">High: </span>
                      <span className="font-medium text-red-600">4</span>
                      <span className="text-muted-foreground mx-2">|</span>
                      <span className="text-muted-foreground">Medium: </span>
                      <span className="font-medium text-yellow-600">6</span>
                      <span className="text-muted-foreground mx-2">|</span>
                      <span className="text-muted-foreground">Low: </span>
                      <span className="font-medium text-green-600">2</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div
                        className={`h-2 rounded-full ${
                          kpis.findingsPercentage > 40 ? 'bg-red-500' :
                          kpis.findingsPercentage > 20 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${kpis.findingsPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card> */}
              {/* <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Revalidation Triggers</h3>
                <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overdue">Overdue Validations</SelectItem>
                    <SelectItem value="performance">Performance Breaches</SelectItem>
                    <SelectItem value="findings">Repeated Findings</SelectItem>
                    <SelectItem value="drift">Parameter Drift</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {selectedTrigger === 'overdue' && (
                  <>
                    <div className="bg-white border-l-6 border-l-red-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Total Overdue</div>
                      <div className="trigger-count text-3xl font-bold text-red-600 mb-1">{overdueAnalytics.total}</div>
                      <div className="trigger-desc text-sm text-gray-600">Models requiring immediate attention</div>
                    </div>
                    <div className="bg-white border-l-6 border-l-red-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Critical Overdue</div>
                      <div className="trigger-count text-3xl font-bold text-red-600 mb-1">{overdueAnalytics.byTier.High || 0}</div>
                      <div className="trigger-desc text-sm text-gray-600">High risk models overdue</div>
                    </div>
                    <div className="bg-white border-l-6 border-l-red-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">30+ Days Overdue</div>
                      <div className="trigger-count text-3xl font-bold text-red-600 mb-1">{(overdueAnalytics.byDaysPastDue['31-60 days'] || 0) + (overdueAnalytics.byDaysPastDue['61-90 days'] || 0) + (overdueAnalytics.byDaysPastDue['90+ days'] || 0)}</div>
                      <div className="trigger-desc text-sm text-gray-600">Severely overdue models</div>
                    </div>
                    <div className="bg-white border-l-6 border-l-red-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Departments Affected</div>
                      <div className="trigger-count text-3xl font-bold text-red-600 mb-1">{Object.keys(overdueAnalytics.byDepartment).length}</div>
                      <div className="trigger-desc text-sm text-gray-600">Departments with overdue models</div>
                    </div>
                  </>
                )}

                {selectedTrigger === 'performance' && (
                  <>
                    <div className="bg-white border-l-6 border-l-orange-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Performance Breaches</div>
                      <div className="trigger-count text-3xl font-bold text-orange-600 mb-1">5</div>
                      <div className="trigger-desc text-sm text-gray-600">Models with 2+ breach cycles</div>
                    </div>
                    <div className="bg-white border-l-6 border-l-orange-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">High Risk Breaches</div>
                      <div className="trigger-count text-3xl font-bold text-orange-600 mb-1">3</div>
                      <div className="trigger-desc text-sm text-gray-600">Critical models breaching</div>
                    </div>
                    <div className="bg-white border-l-6 border-l-orange-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Recent Breaches</div>
                      <div className="trigger-count text-3xl font-bold text-orange-600 mb-1">2</div>
                      <div className="trigger-desc text-sm text-gray-600">Breaches in last 30 days</div>
                    </div>
                    <div className="bg-white border-l-6 border-l-orange-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Departments Impacted</div>
                      <div className="trigger-count text-3xl font-bold text-orange-600 mb-1">3</div>
                      <div className="trigger-desc text-sm text-gray-600">Departments affected</div>
                    </div>
                  </>
                )}

                {selectedTrigger === 'findings' && (
                  <>
                    <div className="bg-white border-l-6 border-l-yellow-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Repeated Findings</div>
                      <div className="trigger-count text-3xl font-bold text-yellow-600 mb-1">7</div>
                      <div className="trigger-desc text-sm text-gray-600">Models with unresolved findings</div>
                    </div>
                    <div className="bg-white border-l-6 border-l-yellow-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Critical Findings</div>
                      <div className="trigger-count text-3xl font-bold text-yellow-600 mb-1">3</div>
                      <div className="trigger-desc text-sm text-gray-600">High severity unresolved</div>
                    </div>
                    <div className="bg-white border-l-6 border-l-yellow-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Long-standing</div>
                      <div className="trigger-count text-3xl font-bold text-yellow-600 mb-1">4</div>
                      <div className="trigger-desc text-sm text-gray-600">Open 90 days</div>
                    </div>
                    <div className="bg-white border-l-6 border-l-yellow-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Models Affected</div>
                      <div className="trigger-count text-3xl font-bold text-yellow-600 mb-1">{kpis.withOpenFindings}</div>
                      <div className="trigger-desc text-sm text-gray-600">Unique models impacted</div>
                    </div>
                  </>
                )}

                {selectedTrigger === 'drift' && (
                  <>
                    <div className="bg-white border-l-6 border-l-blue-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Parameter Drift</div>
                      <div className="trigger-count text-3xl font-bold text-blue-600 mb-1">4</div>
                      <div className="trigger-desc text-sm text-gray-600">Significant parameter changes</div>
                    </div>
                    <div className="bg-white border-l-6 border-l-blue-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Critical Parameters</div>
                      <div className="trigger-count text-3xl font-bold text-blue-600 mb-1">6</div>
                      <div className="trigger-desc text-sm text-gray-600">Parameters requiring review</div>
                    </div>
                    <div className="bg-white border-l-6 border-l-blue-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">Recent Changes</div>
                      <div className="trigger-count text-3xl font-bold text-blue-600 mb-1">2</div>
                      <div className="trigger-desc text-sm text-gray-600">Changes in last 30 days</div>
                    </div>
                    <div className="bg-white border-l-6 border-l-blue-500 rounded-lg p-4 shadow-sm">
                      <div className="trigger-title font-semibold text-gray-800 mb-2">High Risk Models</div>
                      <div className="trigger-count text-3xl font-bold text-blue-600 mb-1">3</div>
                      <div className="trigger-desc text-sm text-gray-600">Critical models affected</div>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t pt-6">
                <h4 className="text-md font-semibold mb-4">
                  {selectedTrigger === 'overdue' && 'Models with Overdue Validations'}
                  {selectedTrigger === 'performance' && 'Models with Performance Breaches'}
                  {selectedTrigger === 'findings' && 'Models with Repeated Findings'}
                  {selectedTrigger === 'drift' && 'Models with Parameter Drift'}
                </h4>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedTrigger === 'overdue' && models.filter(m => m.status === 'Overdue').map((model) => (
                    <div key={model.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-red-800">{model.name}</p>
                          <p className="text-sm text-red-700">ID: {model.id} • {model.riskTier} Risk • {model.lineOfBusiness}</p>
                          <p className="text-xs text-red-600">Overdue for validation</p>
                        </div>
                        <Badge variant="destructive">Overdue</Badge>
                      </div>
                    </div>
                  ))}

                  {selectedTrigger === 'performance' && [
                    { name: 'PD Model A', risk: 'High', dept: 'Retail' },
                    { name: 'LGD Model B', risk: 'Medium', dept: 'Corporate' },
                    { name: 'EAD Model C', risk: 'High', dept: 'SME' },
                    { name: 'Stress Model D', risk: 'Medium', dept: 'Corporate' },
                    { name: 'CCF Model E', risk: 'Low', dept: 'Retail' }
                  ].map((model, index) => (
                    <div key={index} className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-orange-800">{model.name}</p>
                          <p className="text-sm text-orange-700">Risk: {model.risk} • Department: {model.dept}</p>
                          <p className="text-xs text-orange-600">Performance breach detected</p>
                        </div>
                        <Badge variant="secondary">Breach</Badge>
                      </div>
                    </div>
                  ))}

                  {selectedTrigger === 'findings' && models.filter(m =>
                    mockFindings.some(f => f.modelId === m.id && f.status === 'Open')
                  ).map((model) => (
                    <div key={model.id} className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-yellow-800">{model.name}</p>
                          <p className="text-sm text-yellow-700">ID: {model.id} • {model.riskTier} Risk • {model.lineOfBusiness}</p>
                          <p className="text-xs text-yellow-600">
                            {mockFindings.filter(f => f.modelId === model.id && f.status === 'Open').length} unresolved findings
                          </p>
                        </div>
                        <Badge variant="secondary">Findings</Badge>
                      </div>
                    </div>
                  ))}

                  {selectedTrigger === 'drift' && [
                    { name: 'PD Model X', risk: 'High', dept: 'Corporate', change: 'PD coefficient changed by 15%' },
                    { name: 'LGD Model Y', risk: 'Medium', dept: 'Retail', change: 'Intercept shifted by 8%' },
                    { name: 'EAD Model Z', risk: 'High', dept: 'SME', change: 'Feature weights updated' },
                    { name: 'Stress Model W', risk: 'Low', dept: 'Risk', change: 'Scenario parameters modified' }
                  ].map((model, index) => (
                    <div key={index} className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-blue-800">{model.name}</p>
                          <p className="text-sm text-blue-700">Risk: {model.risk} • Department: {model.dept}</p>
                          <p className="text-xs text-blue-600">{model.change}</p>
                        </div>
                        <Badge variant="outline">Drift</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {((selectedTrigger === 'overdue' && models.filter(m => m.status === 'Overdue').length === 0) ||
                  (selectedTrigger === 'findings' && models.filter(m => mockFindings.some(f => f.modelId === m.id && f.status === 'Open')).length === 0)) && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No models found for the selected trigger criteria.</p>
                  </div>
                )}
              </div>
            </Card> */}
                <RevalidationTriggers />
                <ValidationPipelineOverview onClick={() => setActiveTab('list')} />
              {/* Right Column: Validation Calendar */}
              {/* <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Validation Timeline</h3>
                    <div className="flex gap-2">
                      <Select defaultValue="severity">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="severity">By Severity</SelectItem>
                          <SelectItem value="department">By Department</SelectItem>
                          <SelectItem value="tier">By Risk Tier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Select value={filters.riskTier} onValueChange={(value: string) => handleFilterChange('riskTier', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Risk Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Risk Tiers</SelectItem>
                        <SelectItem value="High">High Risk</SelectItem>
                        <SelectItem value="Medium">Medium Risk</SelectItem>
                        <SelectItem value="Low">Low Risk</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filters.department} onValueChange={(value: string) => handleFilterChange('department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="SME">SME</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-blue-800">📊 Selected Models Summary</span>
                      <div className="flex gap-4 text-xs">
                        <span className="text-blue-700">
                          Total: <span className="font-semibold">{filteredModels.length}</span>
                        </span>
                        <span className="text-red-700">
                          Overdue: <span className="font-semibold">
                            {filteredModels.filter(m => m.status === 'Overdue').length}
                          </span>
                        </span>
                        <span className="text-orange-700">
                          Due Soon: <span className="font-semibold">
                            {filteredModels.filter(m => {
                              if (!m.nextValidationDate) return false;
                              const daysUntilDue = Math.ceil((new Date(m.nextValidationDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                              return daysUntilDue >= 0 && daysUntilDue <= 30;
                            }).length}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Select value={filters.riskTier} onValueChange={(value: string) => handleFilterChange('riskTier', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by Risk Tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Risk Tiers</SelectItem>
                          <SelectItem value="High">High Risk</SelectItem>
                          <SelectItem value="Medium">Medium Risk</SelectItem>
                          <SelectItem value="Low">Low Risk</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filters.department} onValueChange={(value: string) => handleFilterChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                          <SelectItem value="SME">SME</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filters.validationStatus} onValueChange={(value: string) => handleFilterChange('validationStatus', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                          <SelectItem value="Pending Validation">Pending Validation</SelectItem>
                          <SelectItem value="Validated">Validated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-blue-800">📊 Validation Schedule Summary</span>
                        <div className="flex gap-4 text-xs">
                          <span className="text-blue-700">
                            Next 3 Months: <span className="font-semibold">
                              {(() => {
                                const now = new Date();
                                const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
                                return filteredModels.filter(m => {
                                  if (!m.nextValidationDate) return false;
                                  const dueDate = new Date(m.nextValidationDate);
                                  return dueDate >= now && dueDate <= threeMonthsFromNow;
                                }).length;
                              })()}
                            </span> models
                          </span>
                          <span className="text-red-700">
                            Overdue: <span className="font-semibold">
                              {filteredModels.filter(m => m.status === 'Overdue').length}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-sm font-semibold text-gray-700">Models Requiring Validation - Next 3 Months</h5>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                          data={(() => {
                            const now = new Date();
                            const months = [];

                            for (let i = 0; i < 3; i++) {
                              const monthStart = new Date(now.getFullYear(), now.getMonth() + i, 1);
                              const monthEnd = new Date(now.getFullYear(), now.getMonth() + i + 1, 0);

                              const monthName = monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                              const modelCount = filteredModels.filter(m => {
                                if (!m.nextValidationDate) return false;
                                const dueDate = new Date(m.nextValidationDate);
                                return dueDate >= monthStart && dueDate <= monthEnd;
                              }).length;

                              months.push({
                                month: monthName,
                                models: modelCount,
                                overdue: filteredModels.filter(m => {
                                  if (!m.nextValidationDate) return false;
                                  const dueDate = new Date(m.nextValidationDate);
                                  return dueDate >= monthStart && dueDate <= monthEnd && m.status === 'Overdue';
                                }).length,
                                pending: filteredModels.filter(m => {
                                  if (!m.nextValidationDate) return false;
                                  const dueDate = new Date(m.nextValidationDate);
                                  return dueDate >= monthStart && dueDate <= monthEnd && m.status === 'Pending Validation';
                                }).length
                              });
                            }

                            return months;
                          })()}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            formatter={(value, name) => [`${value} models`, name === 'models' ? 'Total Due' : name === 'overdue' ? 'Overdue' : 'Pending']}
                          />
                          <Legend />
                          <Bar dataKey="models" fill="#3B82F6" name="Total Due" />
                          <Bar dataKey="overdue" fill="#EF4444" name="Overdue" />
                          <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                        </BarChart>
                      </ResponsiveContainer>

                      <div className="flex flex-wrap gap-4 text-xs justify-center">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span className="font-medium">Total Due</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span className="font-medium">Overdue</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                          <span className="font-medium">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card> */}
            </div>

             {/* SECTION 5: OBSERVATIONS & FINDINGS */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Observations & Findings Tracker</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{findingsSummary.open}</p>
                  <p className="text-sm text-muted-foreground">Open Observations</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{findingsSummary.resolved}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{findingsSummary.dueSoon}</p>
                  <p className="text-sm text-muted-foreground">Due for Compliance</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-600">{findingsSummary.notComplied}</p>
                  <p className="text-sm text-muted-foreground">Not Complied</p>
                </div>
              </div>

              {/* Observations Trend Chart - Line Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.findingsTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="open"
                    stroke="#DA1B1B"
                    strokeWidth={2}
                    name="Open Observations"
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#25A900"
                    strokeWidth={2}
                    name="Resolved"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

              {/* Distribution of Models Across Different Key Attributes */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Distribution of Models Across Different Key Attributes</h3>

                {/* CHART 1: Exception-based Pending Validation */}
                <div className="mb-8">
                  <h4 className="text-md font-semibold mb-4">Exception-based Pending Validation</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'High Risk', count: 18, department: 'Retail' },
                      { name: 'Medium Risk', count: 15, department: 'Corporate' },
                      { name: 'Low Risk', count: 9, department: 'SME' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#DA1B1B" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground mt-2">Model Tier by Count - Exception Validations</p>
                </div>

                {/* CHART 2: Schedule-based Pending Validation */}
                <div className="mb-8">
                  <h4 className="text-md font-semibold mb-4">Schedule-based Pending Validation</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Corporate', count: 20 },
                      { name: 'Retail', count: 18 },
                      { name: 'SME', count: 15 },
                      { name: 'Risk', count: 14 }
                    ]} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#25A900" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground mt-2">Department by Count - Scheduled Validations</p>
                </div>

                {/* CHART 3: Request-based Pending Validation (Tier vs Dept) */}
                <div className="mb-8">
                  <h4 className="text-md font-semibold mb-4">Request-based Pending Validation (Tier vs Dept)</h4>
                  <div className="space-y-4">
                    {/* High Risk by Department */}
                    <div>
                      <h5 className="text-sm font-medium text-red-600">High Risk (4 models)</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-red-50 p-2 rounded">Retail: 4</div>
                      </div>
                    </div>
                    {/* Medium Risk by Department */}
                    <div>
                      <h5 className="text-sm font-medium text-orange-600">Medium Risk (8 models)</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-orange-50 p-2 rounded">Corporate: 4</div>
                        <div className="bg-orange-50 p-2 rounded">SME: 3</div>
                        <div className="bg-orange-50 p-2 rounded">Risk: 1</div>
                      </div>
                    </div>
                    {/* Low Risk by Department */}
                    <div>
                      <h5 className="text-sm font-medium text-green-600">Low Risk (3 models)</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-green-50 p-2 rounded">Operations: 2</div>
                        <div className="bg-green-50 p-2 rounded">Retail: 1</div>
                      </div>
                    </div>
                  </div>
                </div>

                
                
                {/* SECTION 3: DISTRIBUTION VISUALS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Models by Risk Tier - Donut Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Models by Risk Tier</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData.byTier}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.byTier.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === 'High' ? '#DA1B1B' :
                            entry.name === 'Medium' ? '#FF9B21' :
                            '#25A900'
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Models by Department - Horizontal Bar Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Models by Department</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData.byDepartment} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0067b8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
                {/* CHART 4: Overall Inventory Composition */}
                <div className="mb-8">
                  <h4 className="text-md font-semibold mb-4">Overall Inventory Composition</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'High Risk', value: 45, color: '#DA1B1B' },
                          { name: 'Medium Risk', value: 52, color: '#FF9B21' },
                          { name: 'Low Risk', value: 31, color: '#25A900' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'High Risk', value: 45, color: '#DA1B1B' },
                          { name: 'Medium Risk', value: 52, color: '#FF9B21' },
                          { name: 'Low Risk', value: 31, color: '#25A900' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground mt-2">Inventory by Risk Tier</p>
                </div>

               
              </Card>
              
            {/* </Card> */}
              {/* CHART 5: Risk Heatmap - Tier vs Validation Compliance */}
              <Card className="p-6">
                <div>
                  <h4 className="text-md font-semibold mb-4">Risk Heatmap: Tier vs Validation Compliance</h4>

                  {/* Heatmap Data */}
                  {(() => {
                    const heatmapData = {
                      "Tier 1 (High Risk)": { Compliant: 3, "Due Soon": 4, Overdue: 2 },
                      "Tier 2 (Medium Risk)": { Compliant: 8, "Due Soon": 2, Overdue: 5 },
                      "Tier 3 (Low Risk)": { Compliant: 6, "Due Soon": 3, Overdue: 1 },
                      "Tier 4 (Minimal Risk)": { Compliant: 4, "Due Soon": 1, Overdue: 0 }
                    };

                    // Color scaling based on count
                    const getColor = (value: number) => {
                      if (value >= 6) return "#d9534f";   // red
                      if (value >= 3) return "#f0ad4e";   // amber
                      if (value >= 1) return "#5bc0de";   // blue
                      return "#e9ecef";                   // light gray
                    };

                    const statuses = ["Compliant", "Due Soon", "Overdue"];

                    return (
                      <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: `180px repeat(${statuses.length}, 1fr)`,
                          gap: "2px",
                          backgroundColor: "#fff",
                          border: "1px solid #dee2e6",
                          borderRadius: "6px",
                          overflow: "hidden"
                        }}>

                          {/* Header Row */}
                          <div style={{ backgroundColor: "#f8f9fa", fontWeight: "bold", padding: "12px 8px", borderBottom: "2px solid #dee2e6" }}></div>
                          {statuses.map((s) => (
                            <div key={s} style={{
                              backgroundColor: "#f8f9fa",
                              fontWeight: "bold",
                              padding: "12px 8px",
                              textAlign: "center",
                              borderBottom: "2px solid #dee2e6"
                            }}>
                              {s}
                            </div>
                          ))}

                          {/* Data Rows */}
                          {Object.keys(heatmapData).map((tier) => (
                            <React.Fragment key={tier}>
                              <div style={{
                                backgroundColor: "#f8f9fa",
                                fontWeight: "bold",
                                padding: "12px 8px",
                                borderRight: "1px solid #dee2e6"
                              }}>
                                {tier}
                              </div>

                              {statuses.map((status) => {
                                const value = heatmapData[tier as keyof typeof heatmapData][status as keyof typeof heatmapData[keyof typeof heatmapData]];
                                return (
                                  <div
                                    key={status}
                                    style={{
                                      background: getColor(value),
                                      padding: "20px 8px",
                                      textAlign: "center",
                                      color: value === 0 ? "#6c757d" : "white",
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                      border: "1px solid #fff",
                                      minHeight: "60px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center"
                                    }}
                                  >
                                    {value}
                                  </div>
                                );
                              })}
                            </React.Fragment>
                          ))}
                        </div>

                        {/* Legend */}
                        <div style={{ marginTop: "16px", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <div style={{ width: "16px", height: "16px", backgroundColor: "#d9534f", borderRadius: "2px" }}></div>
                            <span style={{ fontSize: "12px", color: "#666" }}>High (6+ models)</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <div style={{ width: "16px", height: "16px", backgroundColor: "#f0ad4e", borderRadius: "2px" }}></div>
                            <span style={{ fontSize: "12px", color: "#666" }}>Medium (3-5 models)</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <div style={{ width: "16px", height: "16px", backgroundColor: "#5bc0de", borderRadius: "2px" }}></div>
                            <span style={{ fontSize: "12px", color: "#666" }}>Low (1-2 models)</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <div style={{ width: "16px", height: "16px", backgroundColor: "#e9ecef", borderRadius: "2px" }}></div>
                            <span style={{ fontSize: "12px", color: "#666" }}>None (0 models)</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
            </Card>

            {/* SECTION 2: INSIGHTS (EARLY WARNING) */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Early Warning Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-red-500"
                      onClick={() => handleFilterChange('validationStatus', 'Overdue')}>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-red-500" />
                    <div>
                      <p className="font-medium">Overdue Models by Tier</p>
                      <p className="text-sm text-muted-foreground">
                        High: {overdueAnalytics.byTier.High || 0}, Medium: {overdueAnalytics.byTier.Medium || 0}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-orange-500"
                      onClick={() => setActiveTab("list")}>
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="font-medium">Validation Backlog</p>
                      <p className="text-sm text-muted-foreground">
                        {overdueAnalytics.total} overdue across {Object.keys(overdueAnalytics.byDepartment).length} departments
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="font-medium">Performance Deterioration</p>
                      <p className="text-sm text-muted-foreground">3 models showing performance drift</p>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>

            

            {/* Validated vs Validation Due - Progress Bar */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Validated vs Validation Due</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Validation Status</span>
                  <span className="text-sm text-muted-foreground">
                    {chartData.validatedVsDue[0].value} Validated / {chartData.validatedVsDue[1].value} Due
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{
                      width: `${(chartData.validatedVsDue[0].value / (chartData.validatedVsDue[0].value + chartData.validatedVsDue[1].value)) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Validated: {chartData.validatedVsDue[0].value}</span>
                  <span>Due: {chartData.validatedVsDue[1].value}</span>
                </div>
              </div>
            </Card>

            {/* Validation Source Distribution - Multi-color Pie Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Validation Source Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.byValidationSource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.byValidationSource.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === 'New' ? '#0067b8' :
                          entry.name === 'Scheduled' ? '#25A900' :
                          entry.name === 'Exception' ? '#DA1B1B' :
                          entry.name === 'Validator Initiated' ? '#FF9B21' :
                          '#87929D'
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Regulatory Scope Distribution - Clustered Column Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Models by Regulatory Scope</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.byRegulatoryScope}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0067b8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* SECTION 4: OVERDUE VALIDATION ANALYTICS */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Overdue Validation Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-medium mb-2">By Department</h4>
                  <div className="space-y-2">
                    {Object.entries(overdueAnalytics.byDepartment).map(([dept, count]) => (
                      <div key={dept} className="flex justify-between">
                        <span className="text-sm">{dept}</span>
                        <Badge variant="destructive">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">By Risk Tier</h4>
                  <div className="space-y-2">
                    {Object.entries(overdueAnalytics.byTier).map(([tier, count]) => (
                      <div key={tier} className="flex justify-between">
                        <span className="text-sm">{tier} Risk</span>
                        <Badge variant="destructive">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">By Days Past Due</h4>
                  <div className="space-y-2">
                    {Object.entries(overdueAnalytics.byDaysPastDue).map(([period, count]) => (
                      <div key={period} className="flex justify-between">
                        <span className="text-sm">{period}</span>
                        <Badge variant="destructive">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Total Overdue Backlog</h4>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-3xl font-bold text-red-600">{overdueAnalytics.total}</p>
                    <p className="text-sm text-muted-foreground">Models</p>
                  </div>
                </div>
              </div>
            </Card>

           
            {/* SECTION 6: MODEL PERFORMANCE MONITOR */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Model Performance Monitor - EWS & Performance Drifts</h3>

              {/* Performance Scatter Plot */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Performance Deviation by Risk Tier & Department</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart data={chartData.performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="deviation"
                      name="Performance Deviation"
                      label={{ value: 'Performance Deviation', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="riskTier"
                      name="Risk Tier"
                      label={{ value: 'Risk Tier', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded shadow-lg">
                              <p className="font-medium">{data.model}</p>
                              <p className="text-sm">Deviation: {data.deviation}</p>
                              <p className="text-sm">Risk: {data.riskTier}</p>
                              <p className="text-sm">Dept: {data.department}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter
                      name="Performance Data"
                      dataKey="deviation"
                      fill="#FF9B21"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Models with EWS/Exceptions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Early Warning Signals</span>
                      <Badge>5</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Performance Exceptions</span>
                      <Badge>3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Drift Detected</span>
                      <Badge variant="secondary">2</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">By Risk Tier</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">High Risk</span>
                      <Badge variant="destructive">4</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medium Risk</span>
                      <Badge variant="secondary">3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Low Risk</span>
                      <Badge variant="outline">1</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">By Department</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Retail</span>
                      <Badge>3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Corporate</span>
                      <Badge>2</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">SME</span>
                      <Badge>2</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Threshold Indicators */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Performance Threshold Alerts</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800">Critical Threshold Breach</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">3 models exceeding critical performance thresholds</p>
                  </div>

                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-orange-800">Warning Threshold</span>
                    </div>
                    <p className="text-sm text-orange-700 mt-1">5 models approaching performance limits</p>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Within Acceptable Range</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">12 models performing within expected ranges</p>
                  </div>
                </div>
              </div>
            </Card>          

            {/* View List Button */}
            <div className="flex justify-center">
              <Button onClick={() => setActiveTab("list")} size="lg">
                View Model List
              </Button>
            </div>
          </TabsContent>

          {/* Model List View Tab */}
          <TabsContent value="list" className="space-y-6">
            {/* Advanced Filters */}
             <p className="text-red-600 mb-4">
       * This list view will be same as model inventory page.
    </p> 
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
                <Select value={filters.department} onValueChange={(value: string) => handleFilterChange('department', value)}>
                  <SelectTrigger><SelectValue placeholder="Line of Business" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Lines</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="SME">SME</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.owner} onValueChange={(value: string) => handleFilterChange('owner', value)}>
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
                <Select value={filters.validationStatus} onValueChange={(value: string) => handleFilterChange('validationStatus', value)}>
                  <SelectTrigger><SelectValue placeholder="Validation Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Pending Validation">Pending Validation</SelectItem>
                    <SelectItem value="Validated">Validated</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.validationSource} onValueChange={(value: string) => handleFilterChange('validationSource', value)}>
                  <SelectTrigger><SelectValue placeholder="Validation Source" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Exception">Exception</SelectItem>
                    <SelectItem value="Validator Initiated">Validator Initiated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Model List Table */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Model Inventory</h3>
<p className="text-red-600 mb-4">
       * This list view should be contextually filtered based on user interaction/selection from dashboard charts or sections.
    </p>                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmark
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model Name</TableHead>
                      <TableHead>Model ID</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Risk Tier</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Validation Due Date</TableHead>
                      <TableHead>Regulatory Scope</TableHead>
                      <TableHead>Validation Status</TableHead>
                      <TableHead>Open Findings</TableHead>
                      <TableHead>Next Review Date</TableHead>
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
                        <TableCell>{model.lineOfBusiness}</TableCell>
                        <TableCell>{model.nextValidationDate || 'N/A'}</TableCell>
                        <TableCell>{model.regulatoryScope || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={
                            model.status === 'Overdue' ? 'destructive' :
                            model.status === 'Pending Validation' ? 'secondary' :
                            model.status === 'Validated' ? 'default' : 'outline'
                          }>
                            {model.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {mockFindings.filter(f => f.modelId === model.id && f.status === 'Open').length}
                        </TableCell>
                        <TableCell>{model.nextValidationDate || 'N/A'}</TableCell>
                        <TableCell>
                          <Select>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Actions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem onClick={() => onViewModel?.(model.id)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Model
                              </SelectItem>
                              <SelectItem onClick={() => onViewDocumentation?.(model.id)}>
                                <FileText className="w-4 h-4 mr-2" />
                                View Documentation
                              </SelectItem>
                              <SelectItem onClick={() => onViewValidationReport?.(model.id)}>
                                <FileText className="w-4 h-4 mr-2" />
                                View Last Validation Report
                              </SelectItem>
                              <SelectItem onClick={() => onMonitorModel?.(model.id)}>
                                <Activity className="w-4 h-4 mr-2" />
                                Monitor Model
                              </SelectItem>
                              <SelectItem onClick={() => onInitiateValidation?.(model.id)}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Initiate Validation
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
