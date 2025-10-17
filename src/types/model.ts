export type ModelRiskTier = 'High' | 'Medium' | 'Low';
export type ModelStatus = 'In Deployment' | 'Under Review' | 'Pending Validation' | 'Overdue' | 'Validated';
export type ValidationFrequency = 'Quarterly' | 'Semi-Annual' | 'Annual' | 'Ad-hoc';
export type FindingSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type ValidationStepStatus = 'not-started' | 'in-progress' | 'completed';

export interface Model {
  id: string;
  name: string;
  businessOwner: string;
  developer: string;
  lineOfBusiness: string;
  riskTier: ModelRiskTier;
  status: ModelStatus;
  validationFrequency: ValidationFrequency;
  lastValidationDate: string;
  nextValidationDate: string;
  regulatoryScope: string;
  purpose: string;
  alerts: Alert[];
  validationHistory: ValidationRecord[];
  monitoringAlerts: MonitoringAlert[];
  lifecycleStatus: 'Commissioned' | 'Validated' | 'Deployed' | 'Monitored' | 'Retired';
}

export interface Alert {
  id: string;
  type: 'breach' | 'finding' | 'drift';
  severity: FindingSeverity;
  message: string;
  date: string;
}

export interface ValidationRecord {
  id: string;
  date: string;
  validator: string;
  outcome: string;
  findings: number;
}

export interface MonitoringAlert {
  id: string;
  metric: string;
  value: number;
  threshold: number;
  date: string;
}

export interface Finding {
  id: string;
  category: string;
  severity: FindingSeverity;
  description: string;
  recommendation: string;
  status: 'Open' | 'In Remediation' | 'Resolved';
  dateIdentified: string;
  assignedTo?: string;
  evidence?: string[];
}

export interface ValidationStep {
  id: string;
  title: string;
  description: string;
  status: ValidationStepStatus;
  findings: Finding[];
}
