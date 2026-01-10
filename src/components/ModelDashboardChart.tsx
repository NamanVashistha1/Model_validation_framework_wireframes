import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Check } from "lucide-react";

interface ModelDashboardChartProps {
  onNavigateToList?: (filters?: any) => void;
  onSwitchToListTab?: () => void;
}

const ModelDashboardChart: React.FC<ModelDashboardChartProps> = ({ onNavigateToList, onSwitchToListTab }) => {
  const totalInventory = 128;
  const dataSummary = {
    Exception: 42,
    Schedule: 67,
    Request: 15,
  };
  const notPending = totalInventory - (42 + 67 + 15); // 4 models

  const [active, setActive] = useState({
    Exception: true,
    Schedule: true,
    Request: true,
    NotPending: true,
  });

  const toggle = (key) =>
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));

  // --- DATA ---
  const pieData = [
    { name: "Pending Validation (Exception)", value: dataSummary.Exception, color: "#2563EB", key: "Exception" },
    { name: "Pending Validation (By Schedule)", value: dataSummary.Schedule, color: "#16A34A", key: "Schedule" },
    { name: "Pending Validation (By Request)", value: dataSummary.Request, color: "#EA580C", key: "Request" },
    { name: "Non-Pending", value: notPending, color: "#9333EA", key: "NotPending" },
  ];

  const riskBreakdown = [
    { category: "Tier 1", Exception: 18, Schedule: 28, Request: 4 },
    { category: "Tier 2", Exception: 15, Schedule: 22, Request: 8 },
    { category: "Tier 3", Exception: 9, Schedule: 17, Request: 3 },
  ];

  const lobBreakdown = [
    { LOB: "Retail", Exception: 10, Schedule: 20, Request: 5 },
    { LOB: "SME", Exception: 8, Schedule: 17, Request: 4 },
    { LOB: "Risk", Exception: 12, Schedule: 15, Request: 3 },
    { LOB: "Corporate", Exception: 12, Schedule: 15, Request: 3 },
  ];

  const activePieData = pieData.filter((d) => active[d.key]);

  // --- Unified Legend ---
  const renderUnifiedLegend = () => (
    <div className="mb-6 text-center">
      <h5 className="text-sm font-semibold mb-2 text-gray-600 uppercase tracking-wide">
        Pending Validations by Categories
      </h5>
      <div className="flex flex-wrap justify-center gap-3">
        {pieData.map((entry) => (
          <button
            key={entry.key}
            onClick={() => toggle(entry.key)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs transition-all ${
              active[entry.key]
                ? "bg-gray-100 border-transparent"
                : "border border-gray-300 opacity-60"
            }`}
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}</span>
            {active[entry.key] && <Check className="w-3 h-3 text-green-600" />}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 ">
Model Validation Overview & Inventory Insights      </h3>

      {/* ✅ Unified Legend */}
      {renderUnifiedLegend()}

{/* ✅ Dynamic total models in selection */}
<div className="flex justify-center mb-6">
  <div
    className={`px-4 py-2 rounded-lg shadow-sm border text-sm font-medium transition-all ${
      Object.values(active).some(Boolean)
        ? "bg-blue-50 border-blue-200 text-blue-700"
        : "bg-gray-50 border-gray-200 text-gray-400"
    }`}
  >
    📊 Total Models in Selection:&nbsp;
    <span className="font-semibold">
      {(() => {
        const total = [
          active.Exception ? dataSummary.Exception : 0,
          active.Schedule ? dataSummary.Schedule : 0,
          active.Request ? dataSummary.Request : 0,
          active.NotPending ? notPending : 0,
        ].reduce((a, b) => a + b, 0);
        return total;
      })()}{" "}
      models
    </span>
  </div>
</div>

      {/* ✅ 3-in-a-row responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 🥧 PIE CHART */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-center">
            Overall Model Inventory Composition
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activePieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                labelLine={false}
                label={({ name, value }) =>
                  `${name.split("(")[1]?.split(")")[0] || name}: ${(
                    (value / totalInventory) *
                    100
                  ).toFixed(1)}%`
                }
                onClick={() => onSwitchToListTab?.()}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} models`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 BAR CHART BY RISK */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-center">
            Pending Validation by Risk Tier
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(v, n) => [`${v} models`, `Pending (${n})`]} />
              {active.Exception && <Bar dataKey="Exception" fill="#2563EB" onClick={() => onSwitchToListTab?.()} />}
              {active.Schedule && <Bar dataKey="Schedule" fill="#16A34A" onClick={() => onSwitchToListTab?.()} />}
              {active.Request && <Bar dataKey="Request" fill="#EA580C" onClick={() => onSwitchToListTab?.()} />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🧩 STACKED BAR BY LOB */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-center">
            Pending Validation by Line of Business (LOB)
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lobBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="LOB" />
              <YAxis />
              <Tooltip formatter={(v, n) => [`${v} models`, `Pending (${n})`]} />
              {active.Exception && (
                <Bar dataKey="Exception" stackId="a" fill="#2563EB" onClick={() => onSwitchToListTab?.()} />
              )}
              {active.Schedule && (
                <Bar dataKey="Schedule" stackId="a" fill="#16A34A" onClick={() => onSwitchToListTab?.()} />
              )}
              {active.Request && (
                <Bar dataKey="Request" stackId="a" fill="#EA580C" onClick={() => onSwitchToListTab?.()} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default ModelDashboardChart;
