import { Model } from '../types/model';

export const mockModels: Model[] = [
  {
    id: 'MDL-2024-001',
    name: 'Credit Risk Scorecard - Retail',
    businessOwner: 'Sarah Chen',
    developer: 'Analytics Team',
    lineOfBusiness: 'Retail Banking',
    riskTier: 'High',
    status: 'Overdue',
    validationFrequency: 'Annual',
    lastValidationDate: '2023-09-15',
    nextValidationDate: '2024-09-15',
    regulatoryScope: 'Basel III, IFRS 9',
    purpose: 'Credit risk assessment for retail loan applications',
    alerts: [
      {
        id: 'A1',
        type: 'breach',
        severity: 'Critical',
        message: 'PSI threshold breach detected',
        date: '2024-10-01'
      },
      {
        id: 'A2',
        type: 'finding',
        severity: 'High',
        message: '3 unresolved findings from last validation',
        date: '2023-09-15'
      }
    ],
    validationHistory: [
      {
        id: 'V1',
        date: '2023-09-15',
        validator: 'Mike Johnson',
        outcome: 'Conditionally Approved',
        findings: 5
      },
      {
        id: 'V2',
        date: '2022-09-10',
        validator: 'Lisa Wong',
        outcome: 'Approved',
        findings: 2
      }
    ],
    monitoringAlerts: [
      {
        id: 'M1',
        metric: 'Gini Coefficient',
        value: 0.42,
        threshold: 0.45,
        date: '2024-09-28'
      },
      {
        id: 'M2',
        metric: 'PSI',
        value: 0.28,
        threshold: 0.25,
        date: '2024-10-01'
      }
    ],
    lifecycleStatus: 'Deployed'
  },
  {
    id: 'MDL-2024-002',
    name: 'Probability of Default - Commercial',
    businessOwner: 'James Martinez',
    developer: 'Risk Modeling',
    lineOfBusiness: 'Commercial Banking',
    riskTier: 'High',
    status: 'Pending Validation',
    validationFrequency: 'Annual',
    lastValidationDate: '2023-11-20',
    nextValidationDate: '2024-11-20',
    regulatoryScope: 'Basel III, CECL',
    purpose: 'Default probability estimation for commercial loans',
    alerts: [],
    validationHistory: [
      {
        id: 'V3',
        date: '2023-11-20',
        validator: 'Mike Johnson',
        outcome: 'Approved',
        findings: 1
      }
    ],
    monitoringAlerts: [],
    lifecycleStatus: 'Deployed'
  },
  {
    id: 'MDL-2024-003',
    name: 'Loss Given Default Model',
    businessOwner: 'Emily Rodriguez',
    developer: 'Quantitative Risk',
    lineOfBusiness: 'Enterprise Risk',
    riskTier: 'Medium',
    status: 'Validated',
    validationFrequency: 'Annual',
    lastValidationDate: '2024-08-10',
    nextValidationDate: '2025-08-10',
    regulatoryScope: 'Basel III',
    purpose: 'Estimate loss severity in event of default',
    alerts: [],
    validationHistory: [
      {
        id: 'V4',
        date: '2024-08-10',
        validator: 'Sarah Park',
        outcome: 'Approved',
        findings: 0
      }
    ],
    monitoringAlerts: [],
    lifecycleStatus: 'Deployed'
  },
  {
    id: 'MDL-2024-004',
    name: 'Fraud Detection - Card Transactions',
    businessOwner: 'David Kim',
    developer: 'ML Engineering',
    lineOfBusiness: 'Card Services',
    riskTier: 'High',
    status: 'Under Review',
    validationFrequency: 'Quarterly',
    lastValidationDate: '2024-07-15',
    nextValidationDate: '2024-10-15',
    regulatoryScope: 'PCI-DSS, Model Risk Management',
    purpose: 'Real-time fraud detection for card transactions',
    alerts: [
      {
        id: 'A3',
        type: 'drift',
        severity: 'Medium',
        message: 'Feature drift detected in transaction patterns',
        date: '2024-09-25'
      }
    ],
    validationHistory: [
      {
        id: 'V5',
        date: '2024-07-15',
        validator: 'Lisa Wong',
        outcome: 'Approved',
        findings: 2
      }
    ],
    monitoringAlerts: [
      {
        id: 'M3',
        metric: 'Precision',
        value: 0.87,
        threshold: 0.85,
        date: '2024-09-30'
      }
    ],
    lifecycleStatus: 'Deployed'
  },
  {
    id: 'MDL-2024-005',
    name: 'Customer Churn Prediction',
    businessOwner: 'Anna Thompson',
    developer: 'Analytics Team',
    lineOfBusiness: 'Retail Banking',
    riskTier: 'Low',
    status: 'In Deployment',
    validationFrequency: 'Semi-Annual',
    lastValidationDate: '2024-04-22',
    nextValidationDate: '2024-10-22',
    regulatoryScope: 'Internal Model Governance',
    purpose: 'Predict customer attrition risk',
    alerts: [],
    validationHistory: [
      {
        id: 'V6',
        date: '2024-04-22',
        validator: 'Mike Johnson',
        outcome: 'Approved',
        findings: 1
      }
    ],
    monitoringAlerts: [],
    lifecycleStatus: 'Deployed'
  },
  {
    id: 'MDL-2024-006',
    name: 'Exposure at Default - Mortgage',
    businessOwner: 'Robert Lee',
    developer: 'Credit Risk Analytics',
    lineOfBusiness: 'Mortgage Lending',
    riskTier: 'Medium',
    status: 'Validated',
    validationFrequency: 'Annual',
    lastValidationDate: '2024-06-30',
    nextValidationDate: '2025-06-30',
    regulatoryScope: 'Basel III, CCAR',
    purpose: 'Estimate outstanding exposure at time of default',
    alerts: [],
    validationHistory: [
      {
        id: 'V7',
        date: '2024-06-30',
        validator: 'Sarah Park',
        outcome: 'Approved',
        findings: 0
      }
    ],
    monitoringAlerts: [],
    lifecycleStatus: 'Deployed'
  }
];
