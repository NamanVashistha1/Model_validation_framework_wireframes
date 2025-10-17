export type UsageFrequency = 'Real-time' | 'Hourly' | 'Daily' | 'Weekly' | 'On-Demand';
export type MonitoringCycle = 'Every 5 minutes' | 'Hourly' | 'Daily' | 'Weekly' | 'Custom';
export type IssueStatus = 'Pending' | 'Closed';
export type IssueSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type LifecycleStage = 'Development' | 'Deployed' | 'Under Review' | 'Retired';
export type RiskTier = 'High' | 'Medium' | 'Low';
export type ValidationStatus = 'Validated' | 'Pending Validation' | 'Overdue' | 'In Progress';
export type RegulatoryScope = 'Regulated' | 'Non-regulated';

export interface RedwoodModel {
  id: string;
  name: string;
  description?: string;
  owner: string;
  department: string;
  lineOfBusiness: string;
  usageFrequency: UsageFrequency;
  monitoringCycle: MonitoringCycle;
  registeredDate: string;
  openIssuesCount: number;
  lifecycleStage: LifecycleStage;
  riskTier: RiskTier;
  validationStatus: ValidationStatus;
  regulatoryScope: RegulatoryScope;
  lastValidationDate?: string;
  nextValidationDate?: string;
  independentValidation: boolean;
  documentationComplete: boolean;
  performanceMetrics?: PerformanceMetrics;
  monitoringAlerts?: MonitoringAlert[];
}

export interface Issue {
  id: string;
  modelId: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  createdDate: string;
  lastUpdated: string;
  createdBy: string;
  assignedTo?: string;
  comments: IssueComment[];
}

export interface IssueComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  eventType: 'status_change' | 'severity_change' | 'comment_added' | 'issue_created' | 'model_registered' | 'model_updated';
  entityType: 'model' | 'issue';
  entityId: string;
  entityName: string;
  user: string;
  description: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface PerformanceMetrics {
  accuracy?: number;
  gini?: number;
  ks?: number;
  psi?: number;
  auc?: number;
  precision?: number;
  recall?: number;
}

export interface MonitoringAlert {
  id: string;
  type: 'drift' | 'bias' | 'performance' | 'threshold';
  metric: string;
  currentValue: number;
  threshold: number;
  severity: IssueSeverity;
  date: string;
}

export interface DashboardKPIs {
  totalModels: number;
  modelsByLifecycle: Record<LifecycleStage, number>;
  modelsByRiskTier: Record<RiskTier, number>;
  modelsByRegulatoryScope: Record<RegulatoryScope, number>;
  overdueValidations: number;
  overdueValidationsPercent: number;
  openFindingsBySeverity: Record<IssueSeverity, number>;
  upcomingReviews30Days: number;
  upcomingReviews60Days: number;
  upcomingReviews90Days: number;
  independentValidationPercent: number;
  breachedMonitoringKPIs: number;
}
