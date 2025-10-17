import { Issue } from '../types/redwood';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface FindingsTrendsChartProps {
  issues: Issue[];
}

const COLORS = {
  Critical: '#DA1B1B',
  High: '#FF9B21',
  Medium: '#FDC162',
  Low: '#25A900',
  Pending: '#0067b8',
  Closed: '#87929D'
};

export function FindingsTrendsChart({ issues }: FindingsTrendsChartProps) {
  // Findings by severity
  const severityData = [
    { name: 'Critical', value: issues.filter(i => i.severity === 'Critical' && i.status === 'Pending').length, color: COLORS.Critical },
    { name: 'High', value: issues.filter(i => i.severity === 'High' && i.status === 'Pending').length, color: COLORS.High },
    { name: 'Medium', value: issues.filter(i => i.severity === 'Medium' && i.status === 'Pending').length, color: COLORS.Medium },
    { name: 'Low', value: issues.filter(i => i.severity === 'Low' && i.status === 'Pending').length, color: COLORS.Low }
  ];

  // Pending vs Closed trend (simulated monthly data)
  const trendData = generateTrendData(issues);

  // Status distribution
  const statusData = [
    { name: 'Pending', value: issues.filter(i => i.status === 'Pending').length, color: COLORS.Pending },
    { name: 'Closed', value: issues.filter(i => i.status === 'Closed').length, color: COLORS.Closed }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3] p-6">
      <h3 className="text-[#1A1816] mb-6">Findings & Issues Analytics</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Findings by Severity */}
        <div>
          <h4 className="text-[#1A1816] mb-4">Open Findings by Severity</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E1E3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#0067b8">
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pending vs Closed Trend */}
        <div>
          <h4 className="text-[#1A1816] mb-4">Findings Trend (Last 6 Months)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E1E3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pending" stroke={COLORS.Pending} name="Pending" strokeWidth={2} />
              <Line type="monotone" dataKey="closed" stroke={COLORS.Closed} name="Closed" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drilldown Table */}
      <div className="mt-6">
        <h4 className="text-[#1A1816] mb-4">Recent High & Critical Findings</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F2F6FB]">
              <tr className="border-b border-[#E0E1E3]">
                <th className="text-left p-3 text-[#1A1816]">Issue ID</th>
                <th className="text-left p-3 text-[#1A1816]">Title</th>
                <th className="text-left p-3 text-[#1A1816]">Model</th>
                <th className="text-left p-3 text-[#1A1816]">Severity</th>
                <th className="text-left p-3 text-[#1A1816]">Status</th>
                <th className="text-left p-3 text-[#1A1816]">Created</th>
              </tr>
            </thead>
            <tbody>
              {issues
                .filter(i => (i.severity === 'Critical' || i.severity === 'High') && i.status === 'Pending')
                .slice(0, 5)
                .map((issue, index) => (
                  <tr key={issue.id} className={`border-b border-[#E0E1E3] ${index % 2 === 0 ? 'bg-white' : 'bg-[#F7F7F7]'}`}>
                    <td className="p-3 text-[#262626]">{issue.id}</td>
                    <td className="p-3 text-[#1A1816]">{issue.title}</td>
                    <td className="p-3 text-[#262626]">{issue.modelId}</td>
                    <td className="p-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-white ${issue.severity === 'Critical' ? 'bg-[#DA1B1B]' : 'bg-[#FF9B21]'}`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-3 py-1 rounded-full text-white bg-[#0067b8]">
                        {issue.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#262626]">{new Date(issue.createdDate).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function generateTrendData(issues: Issue[]) {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  
  // Simulate trend data based on current issues
  return months.map((month, index) => {
    const basePending = issues.filter(i => i.status === 'Pending').length;
    const baseClosed = issues.filter(i => i.status === 'Closed').length;
    
    // Add some variation to simulate historical data
    const variation = (Math.random() - 0.5) * 0.3;
    return {
      month,
      pending: Math.max(0, Math.round(basePending * (0.7 + variation + index * 0.05))),
      closed: Math.max(0, Math.round(baseClosed * (0.5 + variation + index * 0.1)))
    };
  });
}
