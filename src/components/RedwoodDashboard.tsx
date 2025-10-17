import { RedwoodModel, Issue, DashboardKPIs } from '../types/redwood';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, Clock, FileText, Users } from 'lucide-react';
import { RiskHeatmap } from './RiskHeatmap';
import { ComplianceMonitoringPanel } from './ComplianceMonitoringPanel';
import { FindingsTrendsChart } from './FindingsTrendsChart';
import { PerformanceEWSPanel } from './PerformanceEWSPanel';
import { OwnershipGovernance } from './OwnershipGovernance';

interface RedwoodDashboardProps {
  models: RedwoodModel[];
  issues: Issue[];
  onModelClick?: (modelId: string) => void;
}

const COLORS = {
  critical: '#DA1B1B',
  high: '#FF9B21',
  medium: '#FDC162',
  low: '#25A900',
  blue: '#0067b8',
  green: '#25A900',
  orange: '#FF9B21',
  red: '#DA1B1B',
  gray: '#87929D'
};

export function RedwoodDashboard({ models, issues, onModelClick }: RedwoodDashboardProps) {
  // Calculate KPIs
  const kpis = calculateKPIs(models, issues);

  // Lifecycle data for chart
  const lifecycleData = Object.entries(kpis.modelsByLifecycle).map(([name, value]) => ({
    name,
    value
  }));

  // Risk tier data for chart
  const riskTierData = Object.entries(kpis.modelsByRiskTier).map(([name, value]) => ({
    name,
    value,
    color: name === 'High' ? COLORS.red : name === 'Medium' ? COLORS.orange : COLORS.green
  }));

  // Regulatory scope data
  const regulatoryData = Object.entries(kpis.modelsByRegulatoryScope).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="p-6 space-y-6">
      {/* KPI Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPITile
          title="Total Models"
          value={kpis.totalModels}
          icon={FileText}
          iconBg="bg-[#0067b8]"
        />
        <KPITile
          title="Overdue Validations"
          value={kpis.overdueValidations}
          subtitle={`${kpis.overdueValidationsPercent.toFixed(1)}% of total`}
          icon={Clock}
          iconBg="bg-[#DA1B1B]"
        />
        <KPITile
          title="Open Findings"
          value={kpis.openFindingsBySeverity.Critical + kpis.openFindingsBySeverity.High + kpis.openFindingsBySeverity.Medium + kpis.openFindingsBySeverity.Low}
          subtitle={`${kpis.openFindingsBySeverity.Critical} Critical`}
          icon={AlertCircle}
          iconBg="bg-[#FF9B21]"
        />
        <KPITile
          title="Independent Validation"
          value={`${kpis.independentValidationPercent.toFixed(0)}%`}
          subtitle="Completed"
          icon={CheckCircle}
          iconBg="bg-[#25A900]"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lifecycle Stage */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3] p-6">
          <h3 className="text-[#1A1816] mb-4">Models by Lifecycle Stage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={lifecycleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E1E3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#0067b8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Tier Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3] p-6">
          <h3 className="text-[#1A1816] mb-4">Models by Risk Tier</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskTierData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskTierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Regulatory Scope */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3] p-6">
          <h3 className="text-[#1A1816] mb-4">Regulatory Scope</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={regulatoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {regulatoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.blue : COLORS.gray} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Findings by Severity */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3] p-6">
        <h3 className="text-[#1A1816] mb-4">Open Findings by Severity</h3>
        <div className="flex items-center gap-6">
          <FindingsBadge label="Critical" count={kpis.openFindingsBySeverity.Critical} color="bg-[#DA1B1B]" />
          <FindingsBadge label="High" count={kpis.openFindingsBySeverity.High} color="bg-[#FF9B21]" />
          <FindingsBadge label="Medium" count={kpis.openFindingsBySeverity.Medium} color="bg-[#FDC162]" />
          <FindingsBadge label="Low" count={kpis.openFindingsBySeverity.Low} color="bg-[#25A900]" />
        </div>
      </div>

      {/* Compliance Monitoring Panel */}
      <ComplianceMonitoringPanel models={models} kpis={kpis} onModelClick={onModelClick} />

      {/* Risk Heatmap */}
      <RiskHeatmap models={models} onCellClick={onModelClick} />

      {/* Findings Trends */}
      <FindingsTrendsChart issues={issues} />

      {/* Performance & Early Warning Signals */}
      <PerformanceEWSPanel models={models} />

      {/* Ownership & Governance */}
      <OwnershipGovernance models={models} />
    </div>
  );
}

function KPITile({ title, value, subtitle, icon: Icon, iconBg }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3] p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#87929D] mb-1">{title}</p>
          <p className="text-[#1A1816]">{value}</p>
          {subtitle && <p className="text-sm text-[#87929D] mt-1">{subtitle}</p>}
        </div>
        <div className={`${iconBg} p-3 rounded-lg`}>
          <Icon className="size-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function FindingsBadge({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${color} text-white px-4 py-2 rounded-lg min-w-16 text-center`}>
        <div className="text-2xl">{count}</div>
      </div>
      <span className="text-[#262626]">{label}</span>
    </div>
  );
}

function calculateKPIs(models: RedwoodModel[], issues: Issue[]): DashboardKPIs {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  return {
    totalModels: models.length,
    modelsByLifecycle: {
      Development: models.filter(m => m.lifecycleStage === 'Development').length,
      Deployed: models.filter(m => m.lifecycleStage === 'Deployed').length,
      'Under Review': models.filter(m => m.lifecycleStage === 'Under Review').length,
      Retired: models.filter(m => m.lifecycleStage === 'Retired').length
    },
    modelsByRiskTier: {
      High: models.filter(m => m.riskTier === 'High').length,
      Medium: models.filter(m => m.riskTier === 'Medium').length,
      Low: models.filter(m => m.riskTier === 'Low').length
    },
    modelsByRegulatoryScope: {
      Regulated: models.filter(m => m.regulatoryScope === 'Regulated').length,
      'Non-regulated': models.filter(m => m.regulatoryScope === 'Non-regulated').length
    },
    overdueValidations: models.filter(m => m.validationStatus === 'Overdue').length,
    overdueValidationsPercent: (models.filter(m => m.validationStatus === 'Overdue').length / models.length) * 100,
    openFindingsBySeverity: {
      Critical: issues.filter(i => i.severity === 'Critical' && i.status === 'Pending').length,
      High: issues.filter(i => i.severity === 'High' && i.status === 'Pending').length,
      Medium: issues.filter(i => i.severity === 'Medium' && i.status === 'Pending').length,
      Low: issues.filter(i => i.severity === 'Low' && i.status === 'Pending').length
    },
    upcomingReviews30Days: models.filter(m => {
      if (!m.nextValidationDate) return false;
      const nextDate = new Date(m.nextValidationDate);
      return nextDate > now && nextDate <= in30Days;
    }).length,
    upcomingReviews60Days: models.filter(m => {
      if (!m.nextValidationDate) return false;
      const nextDate = new Date(m.nextValidationDate);
      return nextDate > in30Days && nextDate <= in60Days;
    }).length,
    upcomingReviews90Days: models.filter(m => {
      if (!m.nextValidationDate) return false;
      const nextDate = new Date(m.nextValidationDate);
      return nextDate > in60Days && nextDate <= in90Days;
    }).length,
    independentValidationPercent: (models.filter(m => m.independentValidation).length / models.length) * 100,
    breachedMonitoringKPIs: models.filter(m => m.monitoringAlerts && m.monitoringAlerts.length > 0).length
  };
}
