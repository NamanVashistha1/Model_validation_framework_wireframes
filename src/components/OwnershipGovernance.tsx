import { RedwoodModel } from '../types/redwood';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileCheck, AlertTriangle } from 'lucide-react';

interface OwnershipGovernanceProps {
  models: RedwoodModel[];
}

const COLORS = ['#0067b8', '#FF9B21', '#25A900', '#DA1B1B', '#FDC162', '#87929D'];

export function OwnershipGovernance({ models }: OwnershipGovernanceProps) {
  // Models by owner
  const ownerCounts: Record<string, number> = {};
  models.forEach(m => {
    ownerCounts[m.owner] = (ownerCounts[m.owner] || 0) + 1;
  });
  const ownerData = Object.entries(ownerCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Models by department
  const deptCounts: Record<string, number> = {};
  models.forEach(m => {
    deptCounts[m.department] = (deptCounts[m.department] || 0) + 1;
  });
  const deptData = Object.entries(deptCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Owners with most overdue models
  const overdueByOwner: Record<string, number> = {};
  models.filter(m => m.validationStatus === 'Overdue').forEach(m => {
    overdueByOwner[m.owner] = (overdueByOwner[m.owner] || 0) + 1;
  });
  const overdueOwners = Object.entries(overdueByOwner)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Documentation status
  const docsComplete = models.filter(m => m.documentationComplete).length;
  const docsPending = models.length - docsComplete;
  const docsCompletionPercent = (docsComplete / models.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3] p-6">
      <h3 className="text-[#1A1816] mb-6">Ownership & Governance</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Models by Owner */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="size-5 text-[#0067b8]" />
            <h4 className="text-[#1A1816]">Models by Owner</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ownerData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E1E3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#0067b8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Models by Department */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="size-5 text-[#0067b8]" />
            <h4 className="text-[#1A1816]">Models by Department</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={deptData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deptData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Owners with Most Overdue Models */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="size-5 text-[#DA1B1B]" />
            <h4 className="text-[#1A1816]">Owners with Most Overdue Models</h4>
          </div>
          {overdueOwners.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={overdueOwners} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E1E3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#DA1B1B" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center bg-[#F0FDF4] rounded-lg border border-[#25A900]">
              <p className="text-[#25A900]">No overdue models</p>
            </div>
          )}
        </div>

        {/* Documentation Status */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileCheck className="size-5 text-[#25A900]" />
            <h4 className="text-[#1A1816]">Documentation Status</h4>
          </div>
          <div className="space-y-6 pt-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#262626]">Completion Rate</span>
                <span className="text-[#1A1816]">{docsCompletionPercent.toFixed(0)}%</span>
              </div>
              <div className="h-4 bg-[#E0E1E3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#25A900] transition-all"
                  style={{ width: `${docsCompletionPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#F0FDF4] rounded-lg border border-[#25A900]">
                <p className="text-sm text-[#87929D]">Complete</p>
                <p className="text-[#1A1816] mt-2">{docsComplete}</p>
                <p className="text-xs text-[#87929D] mt-1">
                  {((docsComplete / models.length) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="p-4 bg-[#FFF4E8] rounded-lg border border-[#FF9B21]">
                <p className="text-sm text-[#87929D]">Pending</p>
                <p className="text-[#1A1816] mt-2">{docsPending}</p>
                <p className="text-xs text-[#87929D] mt-1">
                  {((docsPending / models.length) * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Documentation breakdown by owner */}
            <div className="pt-4 border-t border-[#E0E1E3]">
              <p className="text-sm text-[#87929D] mb-3">Documentation Status by Owner</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {Object.keys(ownerCounts).map(owner => {
                  const ownerModels = models.filter(m => m.owner === owner);
                  const complete = ownerModels.filter(m => m.documentationComplete).length;
                  const total = ownerModels.length;
                  const percent = (complete / total) * 100;
                  
                  return (
                    <div key={owner} className="text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#262626]">{owner}</span>
                        <span className="text-[#87929D]">{complete}/{total}</span>
                      </div>
                      <div className="h-2 bg-[#E0E1E3] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0067b8]"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
