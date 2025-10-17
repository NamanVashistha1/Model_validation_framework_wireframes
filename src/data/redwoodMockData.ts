import { RedwoodModel, Issue, AuditEvent } from '../types/redwood';

export const redwoodModels: RedwoodModel[] = [
  {
    id: 'MDL-2024-001',
    name: 'Credit Risk Scorecard - Retail',
    description: 'Credit risk assessment for retail loan applications',
    owner: 'Sarah Chen',
    department: 'Risk Analytics',
    lineOfBusiness: 'Retail Banking',
    usageFrequency: 'Daily',
    monitoringCycle: 'Hourly',
    registeredDate: '2023-01-15',
    openIssuesCount: 3,
    lifecycleStage: 'Deployed',
    riskTier: 'High',
    validationStatus: 'Overdue',
    regulatoryScope: 'Regulated',
    lastValidationDate: '2023-09-15',
    nextValidationDate: '2024-09-15',
    independentValidation: true,
    documentationComplete: false,
    performanceMetrics: {
      accuracy: 0.87,
      gini: 0.42,
      ks: 0.38,
      psi: 0.28,
      auc: 0.89
    },
    monitoringAlerts: [
      {
        id: 'MA-001',
        type: 'threshold',
        metric: 'PSI',
        currentValue: 0.28,
        threshold: 0.25,
        severity: 'Critical',
        date: '2024-10-01'
      },
      {
        id: 'MA-002',
        type: 'performance',
        metric: 'Gini',
        currentValue: 0.42,
        threshold: 0.45,
        severity: 'High',
        date: '2024-10-05'
      }
    ]
  },
  {
    id: 'MDL-2024-002',
    name: 'Probability of Default - Commercial',
    description: 'Default probability estimation for commercial loans',
    owner: 'James Martinez',
    department: 'Credit Risk',
    lineOfBusiness: 'Commercial Banking',
    usageFrequency: 'Daily',
    monitoringCycle: 'Daily',
    registeredDate: '2023-02-20',
    openIssuesCount: 1,
    lifecycleStage: 'Deployed',
    riskTier: 'High',
    validationStatus: 'Pending Validation',
    regulatoryScope: 'Regulated',
    lastValidationDate: '2023-11-20',
    nextValidationDate: '2024-11-20',
    independentValidation: true,
    documentationComplete: true,
    performanceMetrics: {
      accuracy: 0.92,
      gini: 0.58,
      ks: 0.51,
      psi: 0.12,
      auc: 0.94
    }
  },
  {
    id: 'MDL-2024-003',
    name: 'Loss Given Default Model',
    description: 'Estimate loss severity in event of default',
    owner: 'Emily Rodriguez',
    department: 'Quantitative Risk',
    lineOfBusiness: 'Enterprise Risk',
    usageFrequency: 'Weekly',
    monitoringCycle: 'Daily',
    registeredDate: '2023-03-10',
    openIssuesCount: 0,
    lifecycleStage: 'Deployed',
    riskTier: 'Medium',
    validationStatus: 'Validated',
    regulatoryScope: 'Regulated',
    lastValidationDate: '2024-08-10',
    nextValidationDate: '2025-08-10',
    independentValidation: true,
    documentationComplete: true,
    performanceMetrics: {
      accuracy: 0.85,
      gini: 0.48,
      ks: 0.42,
      psi: 0.08,
      auc: 0.87
    }
  },
  {
    id: 'MDL-2024-004',
    name: 'Fraud Detection - Card Transactions',
    description: 'Real-time fraud detection for card transactions',
    owner: 'David Kim',
    department: 'ML Engineering',
    lineOfBusiness: 'Card Services',
    usageFrequency: 'Real-time',
    monitoringCycle: 'Every 5 minutes',
    registeredDate: '2023-04-05',
    openIssuesCount: 2,
    lifecycleStage: 'Deployed',
    riskTier: 'High',
    validationStatus: 'In Progress',
    regulatoryScope: 'Regulated',
    lastValidationDate: '2024-07-15',
    nextValidationDate: '2024-10-15',
    independentValidation: false,
    documentationComplete: true,
    performanceMetrics: {
      accuracy: 0.95,
      precision: 0.87,
      recall: 0.82,
      psi: 0.15,
      auc: 0.96
    },
    monitoringAlerts: [
      {
        id: 'MA-003',
        type: 'drift',
        metric: 'Feature Drift',
        currentValue: 0.22,
        threshold: 0.20,
        severity: 'Medium',
        date: '2024-09-25'
      }
    ]
  },
  {
    id: 'MDL-2024-005',
    name: 'Customer Churn Prediction',
    description: 'Predict customer attrition risk',
    owner: 'Anna Thompson',
    department: 'Analytics Team',
    lineOfBusiness: 'Retail Banking',
    usageFrequency: 'Hourly',
    monitoringCycle: 'Hourly',
    registeredDate: '2023-05-12',
    openIssuesCount: 0,
    lifecycleStage: 'Deployed',
    riskTier: 'Low',
    validationStatus: 'Validated',
    regulatoryScope: 'Non-regulated',
    lastValidationDate: '2024-04-22',
    nextValidationDate: '2024-10-22',
    independentValidation: false,
    documentationComplete: true,
    performanceMetrics: {
      accuracy: 0.78,
      precision: 0.72,
      recall: 0.68,
      psi: 0.11,
      auc: 0.81
    }
  },
  {
    id: 'MDL-2024-006',
    name: 'Exposure at Default - Mortgage',
    description: 'Estimate outstanding exposure at time of default',
    owner: 'Robert Lee',
    department: 'Credit Risk Analytics',
    lineOfBusiness: 'Mortgage Lending',
    usageFrequency: 'Weekly',
    monitoringCycle: 'Weekly',
    registeredDate: '2023-06-18',
    openIssuesCount: 1,
    lifecycleStage: 'Deployed',
    riskTier: 'Medium',
    validationStatus: 'Validated',
    regulatoryScope: 'Regulated',
    lastValidationDate: '2024-06-30',
    nextValidationDate: '2025-06-30',
    independentValidation: true,
    documentationComplete: true,
    performanceMetrics: {
      accuracy: 0.83,
      gini: 0.46,
      ks: 0.40,
      psi: 0.09,
      auc: 0.85
    }
  },
  {
    id: 'MDL-2024-007',
    name: 'Anti-Money Laundering Detector',
    description: 'Detect suspicious transaction patterns for AML compliance',
    owner: 'Michael Zhang',
    department: 'Compliance Analytics',
    lineOfBusiness: 'Enterprise Risk',
    usageFrequency: 'Real-time',
    monitoringCycle: 'Hourly',
    registeredDate: '2023-07-25',
    openIssuesCount: 0,
    lifecycleStage: 'Under Review',
    riskTier: 'High',
    validationStatus: 'In Progress',
    regulatoryScope: 'Regulated',
    lastValidationDate: '2024-01-15',
    nextValidationDate: '2024-07-15',
    independentValidation: true,
    documentationComplete: false,
    performanceMetrics: {
      accuracy: 0.91,
      precision: 0.88,
      recall: 0.85,
      psi: 0.18,
      auc: 0.93
    }
  },
  {
    id: 'MDL-2024-008',
    name: 'Credit Limit Optimization',
    description: 'Optimize credit limits based on customer behavior and risk',
    owner: 'Sarah Chen',
    department: 'Risk Analytics',
    lineOfBusiness: 'Card Services',
    usageFrequency: 'Daily',
    monitoringCycle: 'Daily',
    registeredDate: '2023-08-30',
    openIssuesCount: 0,
    lifecycleStage: 'Development',
    riskTier: 'Medium',
    validationStatus: 'Pending Validation',
    regulatoryScope: 'Non-regulated',
    independentValidation: false,
    documentationComplete: false,
    performanceMetrics: {
      accuracy: 0.80,
      gini: 0.44,
      psi: 0.14
    }
  },
  {
    id: 'MDL-2024-009',
    name: 'Market Risk VaR Model',
    description: 'Value at Risk calculation for trading portfolio',
    owner: 'Jennifer Park',
    department: 'Market Risk',
    lineOfBusiness: 'Trading & Markets',
    usageFrequency: 'Daily',
    monitoringCycle: 'Daily',
    registeredDate: '2022-03-15',
    openIssuesCount: 0,
    lifecycleStage: 'Retired',
    riskTier: 'High',
    validationStatus: 'Validated',
    regulatoryScope: 'Regulated',
    lastValidationDate: '2023-12-20',
    nextValidationDate: '2024-12-20',
    independentValidation: true,
    documentationComplete: true
  },
  {
    id: 'MDL-2024-010',
    name: 'Loan Prepayment Prediction',
    description: 'Predict likelihood of early loan repayment',
    owner: 'Robert Lee',
    department: 'Credit Risk Analytics',
    lineOfBusiness: 'Mortgage Lending',
    usageFrequency: 'Weekly',
    monitoringCycle: 'Weekly',
    registeredDate: '2023-09-10',
    openIssuesCount: 1,
    lifecycleStage: 'Deployed',
    riskTier: 'Low',
    validationStatus: 'Validated',
    regulatoryScope: 'Non-regulated',
    lastValidationDate: '2024-05-15',
    nextValidationDate: '2024-11-15',
    independentValidation: false,
    documentationComplete: true,
    performanceMetrics: {
      accuracy: 0.76,
      precision: 0.71,
      recall: 0.69,
      psi: 0.10,
      auc: 0.79
    }
  }
];

export const issues: Issue[] = [
  {
    id: 'ISS-001',
    modelId: 'MDL-2024-001',
    title: 'PSI threshold breach detected',
    description: 'Population Stability Index exceeded threshold of 0.25, current value is 0.28',
    severity: 'Critical',
    status: 'Pending',
    createdDate: '2024-10-01',
    lastUpdated: '2024-10-15',
    createdBy: 'System Monitor',
    assignedTo: 'Sarah Chen',
    comments: [
      {
        id: 'C1',
        author: 'Sarah Chen',
        content: 'Investigating root cause. Initial analysis suggests population shift in recent applications.',
        timestamp: '2024-10-02T10:30:00Z'
      },
      {
        id: 'C2',
        author: 'Mike Johnson',
        content: 'Please provide detailed analysis by end of week.',
        timestamp: '2024-10-03T14:15:00Z'
      }
    ]
  },
  {
    id: 'ISS-002',
    modelId: 'MDL-2024-001',
    title: 'Documentation gap in model methodology',
    description: 'Missing documentation for recent changes to feature engineering pipeline',
    severity: 'High',
    status: 'Pending',
    createdDate: '2024-09-15',
    lastUpdated: '2024-10-10',
    createdBy: 'Mike Johnson',
    assignedTo: 'Analytics Team',
    comments: []
  },
  {
    id: 'ISS-003',
    modelId: 'MDL-2024-001',
    title: 'Model performance degradation',
    description: 'Gini coefficient declined from 0.52 to 0.45 over past quarter',
    severity: 'Medium',
    status: 'Pending',
    createdDate: '2024-09-28',
    lastUpdated: '2024-10-12',
    createdBy: 'Lisa Wong',
    assignedTo: 'Sarah Chen',
    comments: [
      {
        id: 'C3',
        author: 'Sarah Chen',
        content: 'Model retraining scheduled for Q4.',
        timestamp: '2024-10-05T09:00:00Z'
      }
    ]
  },
  {
    id: 'ISS-004',
    modelId: 'MDL-2024-002',
    title: 'Incomplete testing coverage',
    description: 'Unit tests only cover 65% of codebase, below required 80%',
    severity: 'Medium',
    status: 'Pending',
    createdDate: '2024-10-08',
    lastUpdated: '2024-10-08',
    createdBy: 'James Martinez',
    assignedTo: 'Risk Modeling',
    comments: []
  },
  {
    id: 'ISS-005',
    modelId: 'MDL-2024-004',
    title: 'Feature drift in transaction patterns',
    description: 'Significant drift detected in merchant category distribution',
    severity: 'High',
    status: 'Pending',
    createdDate: '2024-09-25',
    lastUpdated: '2024-10-14',
    createdBy: 'System Monitor',
    assignedTo: 'David Kim',
    comments: [
      {
        id: 'C4',
        author: 'David Kim',
        content: 'Conducting impact analysis. May need model recalibration.',
        timestamp: '2024-09-26T11:45:00Z'
      }
    ]
  },
  {
    id: 'ISS-006',
    modelId: 'MDL-2024-004',
    title: 'False positive rate increasing',
    description: 'FPR increased from 2% to 3.5% in past month',
    severity: 'Medium',
    status: 'Pending',
    createdDate: '2024-10-05',
    lastUpdated: '2024-10-05',
    createdBy: 'Lisa Wong',
    assignedTo: 'ML Engineering',
    comments: []
  },
  {
    id: 'ISS-007',
    modelId: 'MDL-2024-006',
    title: 'Data quality issue in source system',
    description: 'Missing values detected in collateral valuation field',
    severity: 'Low',
    status: 'Pending',
    createdDate: '2024-10-10',
    lastUpdated: '2024-10-10',
    createdBy: 'Robert Lee',
    assignedTo: 'Credit Risk Analytics',
    comments: []
  },
  {
    id: 'ISS-008',
    modelId: 'MDL-2024-010',
    title: 'Model calibration drift',
    description: 'Calibration metrics showing deviation from expected values',
    severity: 'Low',
    status: 'Pending',
    createdDate: '2024-10-12',
    lastUpdated: '2024-10-12',
    createdBy: 'System Monitor',
    assignedTo: 'Robert Lee',
    comments: []
  }
];

export const auditEvents: AuditEvent[] = [
  {
    id: 'AUD-001',
    eventType: 'issue_created',
    entityType: 'issue',
    entityId: 'ISS-001',
    entityName: 'PSI threshold breach detected',
    user: 'System Monitor',
    description: 'Critical issue created for Credit Risk Scorecard - Retail',
    timestamp: '2024-10-01T08:00:00Z',
    details: { severity: 'Critical', modelId: 'MDL-2024-001' }
  },
  {
    id: 'AUD-002',
    eventType: 'comment_added',
    entityType: 'issue',
    entityId: 'ISS-001',
    entityName: 'PSI threshold breach detected',
    user: 'Sarah Chen',
    description: 'Comment added to issue ISS-001',
    timestamp: '2024-10-02T10:30:00Z'
  },
  {
    id: 'AUD-003',
    eventType: 'severity_change',
    entityType: 'issue',
    entityId: 'ISS-002',
    entityName: 'Documentation gap in model methodology',
    user: 'Mike Johnson',
    description: 'Severity changed from Medium to High',
    timestamp: '2024-09-16T14:20:00Z',
    details: { oldSeverity: 'Medium', newSeverity: 'High' }
  },
  {
    id: 'AUD-004',
    eventType: 'model_registered',
    entityType: 'model',
    entityId: 'MDL-2024-006',
    entityName: 'Exposure at Default - Mortgage',
    user: 'Robert Lee',
    description: 'New model registered in inventory',
    timestamp: '2023-06-18T09:15:00Z'
  },
  {
    id: 'AUD-005',
    eventType: 'issue_created',
    entityType: 'issue',
    entityId: 'ISS-005',
    entityName: 'Feature drift in transaction patterns',
    user: 'System Monitor',
    description: 'High severity issue created for Fraud Detection - Card Transactions',
    timestamp: '2024-09-25T07:30:00Z',
    details: { severity: 'High', modelId: 'MDL-2024-004' }
  },
  {
    id: 'AUD-006',
    eventType: 'status_change',
    entityType: 'issue',
    entityId: 'ISS-003',
    entityName: 'Model performance degradation',
    user: 'Sarah Chen',
    description: 'Status changed from Pending to Closed',
    timestamp: '2024-10-12T16:45:00Z',
    details: { oldStatus: 'Pending', newStatus: 'Closed' }
  },
  {
    id: 'AUD-007',
    eventType: 'model_updated',
    entityType: 'model',
    entityId: 'MDL-2024-001',
    entityName: 'Credit Risk Scorecard - Retail',
    user: 'Sarah Chen',
    description: 'Model monitoring cycle updated from Daily to Hourly',
    timestamp: '2024-10-14T11:00:00Z',
    details: { field: 'monitoringCycle', oldValue: 'Daily', newValue: 'Hourly' }
  },
  {
    id: 'AUD-008',
    eventType: 'comment_added',
    entityType: 'issue',
    entityId: 'ISS-001',
    entityName: 'PSI threshold breach detected',
    user: 'Mike Johnson',
    description: 'Comment added to issue ISS-001',
    timestamp: '2024-10-03T14:15:00Z'
  }
];
