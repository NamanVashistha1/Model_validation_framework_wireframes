import { RedwoodModel, DashboardKPIs } from '../types/redwood';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Calendar, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface ComplianceMonitoringPanelProps {
  models: RedwoodModel[];
  kpis: DashboardKPIs;
  onModelClick?: (modelId: string) => void;
}

export function ComplianceMonitoringPanel({ models, kpis, onModelClick }: ComplianceMonitoringPanelProps) {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const upcomingReviews = models.filter(m => {
    if (!m.nextValidationDate) return false;
    const nextDate = new Date(m.nextValidationDate);
    return nextDate > now && nextDate <= in30Days;
  }).sort((a, b) => {
    const dateA = new Date(a.nextValidationDate!);
    const dateB = new Date(b.nextValidationDate!);
    return dateA.getTime() - dateB.getTime();
  });

  const overdueModels = models.filter(m => m.validationStatus === 'Overdue');

  const breachedModels = models.filter(m => m.monitoringAlerts && m.monitoringAlerts.length > 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3] p-6">
      <h3 className="text-[#1A1816] mb-6">Compliance Monitoring</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Upcoming Reviews & Overdue */}
        <div className="space-y-6">
          {/* Upcoming Reviews Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="size-5 text-[#0067b8]" />
              <h4 className="text-[#1A1816]">Upcoming Reviews (Next 30 Days)</h4>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {upcomingReviews.map(model => (
                <div
                  key={model.id}
                  onClick={() => onModelClick?.(model.id)}
                  className="p-3 bg-[#E8F3FC] rounded-lg border border-[#0067b8] cursor-pointer hover:bg-[#d4e9f7] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-[#1A1816]">{model.name}</p>
                      <p className="text-sm text-[#262626] mt-1">Owner: {model.owner}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#0067b8]">
                        {new Date(model.nextValidationDate!).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-[#87929D] mt-1">
                        {getDaysUntil(model.nextValidationDate!)} days
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingReviews.length === 0 && (
                <p className="text-center text-[#87929D] py-4">No upcoming reviews in next 30 days</p>
              )}
            </div>
          </div>

          {/* Overdue Validations */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="size-5 text-[#DA1B1B]" />
              <h4 className="text-[#1A1816]">Overdue Validations</h4>
            </div>
            {overdueModels.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#FEF3F2]">
                    <TableRow className="border-b border-[#E0E1E3]">
                      <TableHead className="text-[#DA1B1B]">Model</TableHead>
                      <TableHead className="text-[#DA1B1B]">Owner</TableHead>
                      <TableHead className="text-[#DA1B1B]">Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overdueModels.map(model => (
                      <TableRow
                        key={model.id}
                        onClick={() => onModelClick?.(model.id)}
                        className="cursor-pointer hover:bg-[#FEF3F2] transition-colors border-b border-[#E0E1E3]"
                      >
                        <TableCell className="text-[#1A1816]">{model.name}</TableCell>
                        <TableCell className="text-[#262626]">{model.owner}</TableCell>
                        <TableCell className="text-[#DA1B1B]">
                          {model.nextValidationDate ? new Date(model.nextValidationDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-[#25A900] py-4 bg-[#F0FDF4] rounded-lg border border-[#25A900]">
                No overdue validations
              </p>
            )}
          </div>
        </div>

        {/* Right Column: KPIs & Breaches */}
        <div className="space-y-6">
          {/* Independent Validation Status */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="size-5 text-[#25A900]" />
              <h4 className="text-[#1A1816]">Independent Validation Status</h4>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#262626]">Completion Rate</span>
                  <span className="text-[#1A1816]">{kpis.independentValidationPercent.toFixed(0)}%</span>
                </div>
                <Progress value={kpis.independentValidationPercent} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-[#F0FDF4] rounded-lg border border-[#25A900]">
                  <p className="text-sm text-[#87929D]">Validated</p>
                  <p className="text-[#1A1816] mt-1">
                    {models.filter(m => m.independentValidation).length}
                  </p>
                </div>
                <div className="p-3 bg-[#FEF3F2] rounded-lg border border-[#DA1B1B]">
                  <p className="text-sm text-[#87929D]">Pending</p>
                  <p className="text-[#1A1816] mt-1">
                    {models.filter(m => !m.independentValidation).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Breached Monitoring KPIs */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="size-5 text-[#FF9B21]" />
              <h4 className="text-[#1A1816]">Breached Monitoring KPIs</h4>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {breachedModels.map(model => (
                <div
                  key={model.id}
                  onClick={() => onModelClick?.(model.id)}
                  className="p-3 bg-[#FFF4E8] rounded-lg border border-[#FF9B21] cursor-pointer hover:bg-[#ffe9d4] transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-[#1A1816]">{model.name}</p>
                    <span className="text-xs px-2 py-1 bg-[#FF9B21] text-white rounded-full">
                      {model.monitoringAlerts?.length} alert{model.monitoringAlerts && model.monitoringAlerts.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {model.monitoringAlerts?.map(alert => (
                    <div key={alert.id} className="text-sm text-[#262626] mt-1">
                      • {alert.metric}: {alert.currentValue.toFixed(3)} (threshold: {alert.threshold.toFixed(3)})
                    </div>
                  ))}
                </div>
              ))}
              {breachedModels.length === 0 && (
                <p className="text-center text-[#25A900] py-4 bg-[#F0FDF4] rounded-lg border border-[#25A900]">
                  No monitoring breaches
                </p>
              )}
            </div>
          </div>

          {/* Review Timeline Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#E8F3FC] rounded-lg border border-[#0067b8]">
              <p className="text-sm text-[#87929D]">30 Days</p>
              <p className="text-[#1A1816] mt-1">{kpis.upcomingReviews30Days}</p>
            </div>
            <div className="p-3 bg-[#E8F3FC] rounded-lg border border-[#0067b8]">
              <p className="text-sm text-[#87929D]">60 Days</p>
              <p className="text-[#1A1816] mt-1">{kpis.upcomingReviews60Days}</p>
            </div>
            <div className="p-3 bg-[#E8F3FC] rounded-lg border border-[#0067b8]">
              <p className="text-sm text-[#87929D]">90 Days</p>
              <p className="text-[#1A1816] mt-1">{kpis.upcomingReviews90Days}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDaysUntil(dateString: string): number {
  const now = new Date();
  const target = new Date(dateString);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
