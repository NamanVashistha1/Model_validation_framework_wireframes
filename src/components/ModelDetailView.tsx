import { useState } from 'react';
import { ArrowLeft, Edit, Play, AlertTriangle, CheckCircle, Clock, TrendingUp, Shield, Activity, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RedwoodModel, Issue, AuditEvent } from '../types/redwood';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ModelDetailViewProps {
  modelId: string;
  models: RedwoodModel[];
  issues: Issue[];
  auditEvents: AuditEvent[];
  onBack: () => void;
  onEdit: (model: RedwoodModel) => void;
  onLaunchValidation: (modelId: string) => void;
}

export function ModelDetailView({
  modelId,
  models,
  issues,
  auditEvents,
  onBack,
  onEdit,
  onLaunchValidation
}: ModelDetailViewProps) {
  const model = models.find(m => m.id === modelId);
  const modelIssues = issues.filter(i => i.modelId === modelId);
  const modelAuditEvents = auditEvents.filter(e => e.entityId === modelId || 
    (e.entityType === 'issue' && modelIssues.some(i => i.id === e.entityId)));

  if (!model) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--redwood-text-secondary)]">Model not found</p>
          <Button onClick={onBack} className="mt-4">
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  // Mock validation history data
  const validationHistory = [
    { date: '2024-10', status: 'Passed', score: 92, validator: 'Sarah Chen' },
    { date: '2024-07', status: 'Passed', score: 89, validator: 'Michael Roberts' },
    { date: '2024-04', status: 'Conditional', score: 78, validator: 'Sarah Chen' },
    { date: '2024-01', status: 'Passed', score: 91, validator: 'Jessica Park' },
    { date: '2023-10', status: 'Passed', score: 88, validator: 'Michael Roberts' }
  ];

  // Mock performance metrics over time
  const performanceData = [
    { month: 'Jan', accuracy: 0.89, auc: 0.92, psi: 0.05 },
    { month: 'Feb', accuracy: 0.88, auc: 0.91, psi: 0.06 },
    { month: 'Mar', accuracy: 0.90, auc: 0.93, psi: 0.04 },
    { month: 'Apr', accuracy: 0.87, auc: 0.90, psi: 0.08 },
    { month: 'May', accuracy: 0.89, auc: 0.92, psi: 0.05 },
    { month: 'Jun', accuracy: 0.91, auc: 0.94, psi: 0.03 }
  ];

  const severityCounts = {
    critical: modelIssues.filter(i => i.severity === 'Critical').length,
    high: modelIssues.filter(i => i.severity === 'High').length,
    medium: modelIssues.filter(i => i.severity === 'Medium').length,
    low: modelIssues.filter(i => i.severity === 'Low').length
  };

  const statusCounts = {
    open: modelIssues.filter(i => i.status === 'Open').length,
    inProgress: modelIssues.filter(i => i.status === 'In Progress').length,
    resolved: modelIssues.filter(i => i.status === 'Resolved').length,
    closed: modelIssues.filter(i => i.status === 'Closed').length
  };

  return (
    <div className="flex h-full flex-col bg-[var(--redwood-bg)]">
      {/* Header */}
      <div className="border-b border-[var(--redwood-divider)] bg-white px-8 py-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mt-1"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-[28px]" style={{ color: 'var(--redwood-text-primary)' }}>
                  {model.name}
                </h1>
                <Badge
                  style={{
                    backgroundColor: model.validationStatus === 'Validated' ? 'var(--redwood-low)' :
                      model.validationStatus === 'In Progress' ? 'var(--redwood-pending)' :
                      model.validationStatus === 'Failed' ? 'var(--redwood-critical)' :
                      'var(--redwood-closed)',
                    color: 'white'
                  }}
                >
                  {model.validationStatus}
                </Badge>
                {model.riskTier && (
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: model.riskTier === 'Tier 1' ? 'var(--redwood-critical)' :
                        model.riskTier === 'Tier 2' ? 'var(--redwood-high)' :
                        'var(--redwood-medium)',
                      color: model.riskTier === 'Tier 1' ? 'var(--redwood-critical)' :
                        model.riskTier === 'Tier 2' ? 'var(--redwood-high)' :
                        'var(--redwood-medium)'
                    }}
                  >
                    {model.riskTier}
                  </Badge>
                )}
              </div>
              <p className="text-[var(--redwood-text-secondary)] mb-3">
                {model.description || 'Credit risk assessment model for retail lending portfolio'}
              </p>
              <div className="flex items-center gap-6 text-sm text-[var(--redwood-text-secondary)]">
                <span><strong>ID:</strong> {model.id}</span>
                <span><strong>Owner:</strong> {model.owner}</span>
                <span><strong>Registered:</strong> {model.registeredDate}</span>
                <span><strong>LOB:</strong> {model.lineOfBusiness || 'Retail Banking'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onEdit(model)}
              className="gap-2"
            >
              <Edit className="size-4" />
              Edit Model
            </Button>
            <Button
              onClick={() => onLaunchValidation(model.id)}
              className="gap-2"
              style={{ backgroundColor: 'var(--redwood-blue)', color: 'white' }}
            >
              <Play className="size-4" />
              Launch Validation
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="validation">Validation History</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="issues">
              Issues & Findings
              {modelIssues.length > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {modelIssues.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-4 gap-6">
              {/* Model Information Card */}
              <div className="col-span-2 rounded-lg border border-[var(--redwood-divider)] bg-white p-6">
                <h3 className="mb-4 flex items-center gap-2" style={{ color: 'var(--redwood-text-primary)' }}>
                  <FileText className="size-5" />
                  Model Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-[var(--redwood-divider)] pb-2">
                    <span className="text-[var(--redwood-text-secondary)]">Model Type</span>
                    <span style={{ color: 'var(--redwood-text-primary)' }}>
                      {model.modelType || 'Logistic Regression'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--redwood-divider)] pb-2">
                    <span className="text-[var(--redwood-text-secondary)]">Version</span>
                    <span style={{ color: 'var(--redwood-text-primary)' }}>
                      {model.version || 'v3.2.1'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--redwood-divider)] pb-2">
                    <span className="text-[var(--redwood-text-secondary)]">Usage Frequency</span>
                    <span style={{ color: 'var(--redwood-text-primary)' }}>{model.usageFrequency}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--redwood-divider)] pb-2">
                    <span className="text-[var(--redwood-text-secondary)]">Monitoring Cycle</span>
                    <span style={{ color: 'var(--redwood-text-primary)' }}>{model.monitoringCycle}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--redwood-divider)] pb-2">
                    <span className="text-[var(--redwood-text-secondary)]">Last Validated</span>
                    <span style={{ color: 'var(--redwood-text-primary)' }}>
                      {model.lastValidated || '2024-10-15'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--redwood-divider)] pb-2">
                    <span className="text-[var(--redwood-text-secondary)]">Next Review Due</span>
                    <span style={{ color: 'var(--redwood-text-primary)' }}>
                      {model.nextReviewDate || '2025-10-15'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--redwood-text-secondary)]">Regulatory Status</span>
                    <span style={{ color: 'var(--redwood-low)' }}>Compliant</span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment Card */}
              <div className="col-span-2 rounded-lg border border-[var(--redwood-divider)] bg-white p-6">
                <h3 className="mb-4 flex items-center gap-2" style={{ color: 'var(--redwood-text-primary)' }}>
                  <Shield className="size-5" />
                  Risk Assessment
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[var(--redwood-text-secondary)]">Overall Risk Score</span>
                      <span className="text-[20px]" style={{ color: 'var(--redwood-high)' }}>
                        7.2/10
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: '72%', backgroundColor: 'var(--redwood-high)' }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-[var(--redwood-divider)] pt-3">
                    <div className="flex justify-between">
                      <span className="text-[var(--redwood-text-secondary)]">Data Quality Risk</span>
                      <span style={{ color: 'var(--redwood-medium)' }}>Medium</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--redwood-text-secondary)]">Model Complexity</span>
                      <span style={{ color: 'var(--redwood-high)' }}>High</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--redwood-text-secondary)]">Business Impact</span>
                      <span style={{ color: 'var(--redwood-critical)' }}>Critical</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--redwood-text-secondary)]">Operational Risk</span>
                      <span style={{ color: 'var(--redwood-medium)' }}>Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues Summary */}
            <div className="rounded-lg border border-[var(--redwood-divider)] bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2" style={{ color: 'var(--redwood-text-primary)' }}>
                <AlertTriangle className="size-5" />
                Issues Summary
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-lg border border-[var(--redwood-divider)] p-4">
                  <div className="mb-1 text-sm text-[var(--redwood-text-secondary)]">Critical</div>
                  <div className="text-[24px]" style={{ color: 'var(--redwood-critical)' }}>
                    {severityCounts.critical}
                  </div>
                </div>
                <div className="rounded-lg border border-[var(--redwood-divider)] p-4">
                  <div className="mb-1 text-sm text-[var(--redwood-text-secondary)]">High</div>
                  <div className="text-[24px]" style={{ color: 'var(--redwood-high)' }}>
                    {severityCounts.high}
                  </div>
                </div>
                <div className="rounded-lg border border-[var(--redwood-divider)] p-4">
                  <div className="mb-1 text-sm text-[var(--redwood-text-secondary)]">Medium</div>
                  <div className="text-[24px]" style={{ color: 'var(--redwood-medium)' }}>
                    {severityCounts.medium}
                  </div>
                </div>
                <div className="rounded-lg border border-[var(--redwood-divider)] p-4">
                  <div className="mb-1 text-sm text-[var(--redwood-text-secondary)]">Low</div>
                  <div className="text-[24px]" style={{ color: 'var(--redwood-low)' }}>
                    {severityCounts.low}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Stakeholders */}
            <div className="rounded-lg border border-[var(--redwood-divider)] bg-white p-6">
              <h3 className="mb-4" style={{ color: 'var(--redwood-text-primary)' }}>
                Key Stakeholders
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="mb-1 text-sm text-[var(--redwood-text-secondary)]">Model Owner</div>
                  <div style={{ color: 'var(--redwood-text-primary)' }}>{model.owner}</div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-[var(--redwood-text-secondary)]">Model Developer</div>
                  <div style={{ color: 'var(--redwood-text-primary)' }}>Jennifer Martinez</div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-[var(--redwood-text-secondary)]">Business Owner</div>
                  <div style={{ color: 'var(--redwood-text-primary)' }}>Robert Kim</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Validation History Tab */}
          <TabsContent value="validation" className="space-y-6">
            <div className="rounded-lg border border-[var(--redwood-divider)] bg-white p-6">
              <h3 className="mb-4" style={{ color: 'var(--redwood-text-primary)' }}>
                Validation Timeline
              </h3>
              <div className="space-y-4">
                {validationHistory.map((validation, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-l-4 pl-4"
                    style={{
                      borderColor: validation.status === 'Passed' ? 'var(--redwood-low)' :
                        validation.status === 'Failed' ? 'var(--redwood-critical)' :
                        'var(--redwood-high)'
                    }}
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span style={{ color: 'var(--redwood-text-primary)' }}>
                          {validation.date}
                        </span>
                        <Badge
                          style={{
                            backgroundColor: validation.status === 'Passed' ? 'var(--redwood-low)' :
                              validation.status === 'Failed' ? 'var(--redwood-critical)' :
                              'var(--redwood-high)',
                            color: 'white'
                          }}
                        >
                          {validation.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-[var(--redwood-text-secondary)]">
                        Validator: {validation.validator} • Score: {validation.score}/100
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[20px]" style={{ color: 'var(--redwood-text-primary)' }}>
                        {validation.score}
                      </div>
                      <div className="text-sm text-[var(--redwood-text-secondary)]">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Score Trend */}
            <div className="rounded-lg border border-[var(--redwood-divider)] bg-white p-6">
              <h3 className="mb-4" style={{ color: 'var(--redwood-text-primary)' }}>
                Validation Score Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={validationHistory.reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--redwood-divider)" />
                  <XAxis dataKey="date" stroke="var(--redwood-text-secondary)" />
                  <YAxis stroke="var(--redwood-text-secondary)" domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--redwood-blue)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--redwood-blue)', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Performance Metrics Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="rounded-lg border border-[var(--redwood-divider)] bg-white p-6">
              <h3 className="mb-4" style={{ color: 'var(--redwood-text-primary)' }}>
                Model Performance Over Time
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--redwood-divider)" />
                  <XAxis dataKey="month" stroke="var(--redwood-text-secondary)" />
                  <YAxis stroke="var(--redwood-text-secondary)" domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="var(--redwood-blue)"
                    strokeWidth={2}
                    name="Accuracy"
                  />
                  <Line
                    type="monotone"
                    dataKey="auc"
                    stroke="var(--redwood-low)"
                    strokeWidth={2}
                    name="AUC"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg border border-[var(--redwood-divider)] bg-white p-6">
              <h3 className="mb-4" style={{ color: 'var(--redwood-text-primary)' }}>
                Population Stability Index (PSI)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--redwood-divider)" />
                  <XAxis dataKey="month" stroke="var(--redwood-text-secondary)" />
                  <YAxis stroke="var(--redwood-text-secondary)" />
                  <Tooltip />
                  <Bar dataKey="psi" fill="var(--redwood-high)" name="PSI" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 rounded-lg bg-[var(--redwood-bg)] p-4">
                <p className="text-sm text-[var(--redwood-text-secondary)]">
                  <strong>PSI Thresholds:</strong> &lt; 0.10 = No significant change • 0.10-0.25 = Moderate change • &gt; 0.25 = Significant change
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 style={{ color: 'var(--redwood-text-primary)' }}>
                  All Issues for {model.name}
                </h3>
                <p className="text-sm text-[var(--redwood-text-secondary)]">
                  {modelIssues.length} total issues
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {statusCounts.open} Open
                </Badge>
                <Badge variant="outline">
                  {statusCounts.inProgress} In Progress
                </Badge>
                <Badge variant="outline">
                  {statusCounts.resolved} Resolved
                </Badge>
              </div>
            </div>

            {modelIssues.length === 0 ? (
              <div className="rounded-lg border border-[var(--redwood-divider)] bg-white p-12 text-center">
                <CheckCircle className="mx-auto mb-3 size-12 text-[var(--redwood-low)]" />
                <h4 style={{ color: 'var(--redwood-text-primary)' }}>No Issues Found</h4>
                <p className="text-sm text-[var(--redwood-text-secondary)]">
                  This model has no recorded issues or findings.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {modelIssues.map(issue => (
                  <div
                    key={issue.id}
                    className="rounded-lg border border-[var(--redwood-divider)] bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span style={{ color: 'var(--redwood-text-primary)' }}>
                            {issue.title}
                          </span>
                          <Badge
                            style={{
                              backgroundColor: issue.severity === 'Critical' ? 'var(--redwood-critical)' :
                                issue.severity === 'High' ? 'var(--redwood-high)' :
                                issue.severity === 'Medium' ? 'var(--redwood-medium)' :
                                'var(--redwood-low)',
                              color: 'white'
                            }}
                          >
                            {issue.severity}
                          </Badge>
                          <Badge variant="outline">{issue.status}</Badge>
                        </div>
                        <p className="mb-2 text-sm text-[var(--redwood-text-secondary)]">
                          {issue.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-[var(--redwood-text-secondary)]">
                          <span>{issue.id}</span>
                          <span>Category: {issue.category}</span>
                          <span>Assigned: {issue.assignedTo}</span>
                          <span>Created: {new Date(issue.createdDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="space-y-6">
            <div className="rounded-lg border border-[var(--redwood-divider)] bg-white p-6">
              <h3 className="mb-4" style={{ color: 'var(--redwood-text-primary)' }}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {modelAuditEvents.slice(0, 20).map(event => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 border-b border-[var(--redwood-divider)] pb-3 last:border-b-0"
                  >
                    <div className="mt-1 rounded-full bg-[var(--redwood-blue)] p-1">
                      <Activity className="size-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1" style={{ color: 'var(--redwood-text-primary)' }}>
                        {event.description}
                      </div>
                      <div className="text-sm text-[var(--redwood-text-secondary)]">
                        {event.user} • {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.eventType.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
