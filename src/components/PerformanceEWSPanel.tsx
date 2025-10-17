import { RedwoodModel } from '../types/redwood';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, AlertTriangle, Activity } from 'lucide-react';

interface PerformanceEWSPanelProps {
  models: RedwoodModel[];
}

export function PerformanceEWSPanel({ models }: PerformanceEWSPanelProps) {
  // Filter models with performance metrics
  const modelsWithMetrics = models.filter(m => m.performanceMetrics);
  
  // Calculate drift alerts (last 30 days)
  const driftAlerts = models.filter(m => 
    m.monitoringAlerts?.some(a => a.type === 'drift' && 
      new Date(a.date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  // Calculate bias alerts
  const biasAlerts = models.filter(m => 
    m.monitoringAlerts?.some(a => a.type === 'bias')
  ).length;

  // Calculate threshold breaches
  const thresholdBreaches = models.filter(m => 
    m.monitoringAlerts?.some(a => a.type === 'threshold')
  ).length;

  // Performance trends (simulated for demonstration)
  const performanceTrends = generatePerformanceTrends(modelsWithMetrics);

  // Models with performance degradation
  const degradedModels = models.filter(m => 
    m.monitoringAlerts && m.monitoringAlerts.some(a => a.type === 'performance')
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3] p-6">
      <h3 className="text-[#1A1816] mb-6">Model Performance & Early Warning Signals</h3>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-[#FFF4E8] rounded-lg border border-[#FF9B21]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#87929D]">Drift Alerts (30 days)</p>
              <p className="text-[#1A1816] mt-1">{driftAlerts}</p>
            </div>
            <Activity className="size-5 text-[#FF9B21]" />
          </div>
        </div>

        <div className="p-4 bg-[#FEF3F2] rounded-lg border border-[#DA1B1B]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#87929D]">Threshold Breaches</p>
              <p className="text-[#1A1816] mt-1">{thresholdBreaches}</p>
            </div>
            <AlertTriangle className="size-5 text-[#DA1B1B]" />
          </div>
        </div>

        <div className="p-4 bg-[#FFF4E8] rounded-lg border border-[#FF9B21]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#87929D]">Performance Degradation</p>
              <p className="text-[#1A1816] mt-1">{degradedModels.length}</p>
            </div>
            <TrendingDown className="size-5 text-[#FF9B21]" />
          </div>
        </div>
      </div>

      {/* Performance Trends Chart */}
      <div className="mb-6">
        <h4 className="text-[#1A1816] mb-4">Average Performance Metrics Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E1E3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 1]} />
            <Tooltip formatter={(value: number) => value.toFixed(3)} />
            <Legend />
            <Line type="monotone" dataKey="gini" stroke="#0067b8" name="Avg Gini" strokeWidth={2} />
            <Line type="monotone" dataKey="auc" stroke="#25A900" name="Avg AUC" strokeWidth={2} />
            <Line type="monotone" dataKey="psi" stroke="#FF9B21" name="Avg PSI" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Models with Alerts */}
      <div>
        <h4 className="text-[#1A1816] mb-4">Models with Active Alerts</h4>
        <div className="space-y-3">
          {models.filter(m => m.monitoringAlerts && m.monitoringAlerts.length > 0).map(model => (
            <div key={model.id} className="p-4 bg-[#F7F7F7] rounded-lg border border-[#E0E1E3]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[#1A1816]">{model.name}</p>
                  <p className="text-sm text-[#87929D] mt-1">{model.id} • {model.lineOfBusiness}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-white text-sm ${
                  model.riskTier === 'High' ? 'bg-[#DA1B1B]' : 
                  model.riskTier === 'Medium' ? 'bg-[#FF9B21]' : 'bg-[#25A900]'
                }`}>
                  {model.riskTier} Risk
                </span>
              </div>

              <div className="space-y-2">
                {model.monitoringAlerts?.map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 text-sm">
                    <AlertTriangle className={`size-4 flex-shrink-0 mt-0.5 ${
                      alert.severity === 'Critical' ? 'text-[#DA1B1B]' :
                      alert.severity === 'High' ? 'text-[#FF9B21]' :
                      alert.severity === 'Medium' ? 'text-[#FDC162]' : 'text-[#25A900]'
                    }`} />
                    <div className="flex-1">
                      <p className="text-[#262626]">
                        <strong>{alert.metric}:</strong> {alert.currentValue.toFixed(3)} 
                        <span className="text-[#87929D]"> (threshold: {alert.threshold.toFixed(3)})</span>
                      </p>
                      <p className="text-xs text-[#87929D] mt-1">
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} • {new Date(alert.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs text-white ${
                      alert.severity === 'Critical' ? 'bg-[#DA1B1B]' :
                      alert.severity === 'High' ? 'bg-[#FF9B21]' :
                      alert.severity === 'Medium' ? 'bg-[#FDC162]' : 'bg-[#25A900]'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Performance Metrics if available */}
              {model.performanceMetrics && (
                <div className="mt-3 pt-3 border-t border-[#E0E1E3]">
                  <p className="text-sm text-[#87929D] mb-2">Current Performance Metrics:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(model.performanceMetrics).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="text-[#87929D]">{key.toUpperCase()}:</span>{' '}
                        <span className="text-[#1A1816]">{value?.toFixed(3)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {models.filter(m => m.monitoringAlerts && m.monitoringAlerts.length > 0).length === 0 && (
            <p className="text-center text-[#25A900] py-6 bg-[#F0FDF4] rounded-lg border border-[#25A900]">
              No active performance alerts
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function generatePerformanceTrends(models: RedwoodModel[]) {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  
  // Calculate average metrics
  const avgMetrics = {
    gini: models.reduce((sum, m) => sum + (m.performanceMetrics?.gini || 0), 0) / models.length,
    auc: models.reduce((sum, m) => sum + (m.performanceMetrics?.auc || 0), 0) / models.length,
    psi: models.reduce((sum, m) => sum + (m.performanceMetrics?.psi || 0), 0) / models.length
  };
  
  // Generate trend with slight variations
  return months.map((month, index) => {
    const variation = (Math.random() - 0.5) * 0.05;
    return {
      month,
      gini: Math.max(0, Math.min(1, avgMetrics.gini + variation)),
      auc: Math.max(0, Math.min(1, avgMetrics.auc + variation)),
      psi: Math.max(0, Math.min(1, avgMetrics.psi + variation - index * 0.01)) // PSI trending down is good
    };
  });
}
