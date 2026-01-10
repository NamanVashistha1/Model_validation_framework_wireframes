import React, { useState, useMemo } from "react";
import { Card } from "./ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Check } from "lucide-react";

const ValidationCalendarChart = ({ onClick }: { onClick?: () => void }) => {
  // ==== Mock Data (now all departments have full tier data) ====
  const modelData = [
    // Retail
    { horizon: "Overdue", tier: "High", department: "Retail", count: 5 },
    { horizon: "Overdue", tier: "Medium", department: "Retail", count: 3 },
    { horizon: "Overdue", tier: "Low", department: "Retail", count: 2 },
    { horizon: "Due in 1 Month", tier: "High", department: "Retail", count: 6 },
    { horizon: "Due in 1 Month", tier: "Medium", department: "Retail", count: 4 },
    { horizon: "Due in 1 Month", tier: "Low", department: "Retail", count: 2 },
    { horizon: "Due in 3 Months", tier: "High", department: "Retail", count: 8 },
    { horizon: "Due in 3 Months", tier: "Medium", department: "Retail", count: 5 },
    { horizon: "Due in 3 Months", tier: "Low", department: "Retail", count: 3 },
    { horizon: "After 3 Months", tier: "High", department: "Retail", count: 7 },
    { horizon: "After 3 Months", tier: "Medium", department: "Retail", count: 8 },
    { horizon: "After 3 Months", tier: "Low", department: "Retail", count: 6 },

    // Corporate
    { horizon: "Overdue", tier: "High", department: "Corporate", count: 4 },
    { horizon: "Overdue", tier: "Medium", department: "Corporate", count: 3 },
    { horizon: "Overdue", tier: "Low", department: "Corporate", count: 2 },
    { horizon: "Due in 1 Month", tier: "High", department: "Corporate", count: 5 },
    { horizon: "Due in 1 Month", tier: "Medium", department: "Corporate", count: 6 },
    { horizon: "Due in 1 Month", tier: "Low", department: "Corporate", count: 3 },
    { horizon: "Due in 3 Months", tier: "High", department: "Corporate", count: 6 },
    { horizon: "Due in 3 Months", tier: "Medium", department: "Corporate", count: 5 },
    { horizon: "Due in 3 Months", tier: "Low", department: "Corporate", count: 3 },
    { horizon: "After 3 Months", tier: "High", department: "Corporate", count: 4 },
    { horizon: "After 3 Months", tier: "Medium", department: "Corporate", count: 4 },
    { horizon: "After 3 Months", tier: "Low", department: "Corporate", count: 2 },

    // SME
    { horizon: "Overdue", tier: "High", department: "SME", count: 3 },
    { horizon: "Overdue", tier: "Medium", department: "SME", count: 2 },
    { horizon: "Overdue", tier: "Low", department: "SME", count: 1 },
    { horizon: "Due in 1 Month", tier: "High", department: "SME", count: 4 },
    { horizon: "Due in 1 Month", tier: "Medium", department: "SME", count: 5 },
    { horizon: "Due in 1 Month", tier: "Low", department: "SME", count: 3 },
    { horizon: "Due in 3 Months", tier: "High", department: "SME", count: 6 },
    { horizon: "Due in 3 Months", tier: "Medium", department: "SME", count: 4 },
    { horizon: "Due in 3 Months", tier: "Low", department: "SME", count: 3 },
    { horizon: "After 3 Months", tier: "High", department: "SME", count: 5 },
    { horizon: "After 3 Months", tier: "Medium", department: "SME", count: 3 },
    { horizon: "After 3 Months", tier: "Low", department: "SME", count: 2 },

    // Risk
    { horizon: "Overdue", tier: "High", department: "Risk", count: 2 },
    { horizon: "Overdue", tier: "Medium", department: "Risk", count: 2 },
    { horizon: "Overdue", tier: "Low", department: "Risk", count: 1 },
    { horizon: "Due in 1 Month", tier: "High", department: "Risk", count: 3 },
    { horizon: "Due in 1 Month", tier: "Medium", department: "Risk", count: 3 },
    { horizon: "Due in 1 Month", tier: "Low", department: "Risk", count: 2 },
    { horizon: "Due in 3 Months", tier: "High", department: "Risk", count: 4 },
    { horizon: "Due in 3 Months", tier: "Medium", department: "Risk", count: 4 },
    { horizon: "Due in 3 Months", tier: "Low", department: "Risk", count: 2 },
    { horizon: "After 3 Months", tier: "High", department: "Risk", count: 3 },
    { horizon: "After 3 Months", tier: "Medium", department: "Risk", count: 3 },
    { horizon: "After 3 Months", tier: "Low", department: "Risk", count: 2 },
  ];

  const [selectedTiers, setSelectedTiers] = useState(["High", "Medium", "Low"]);
  const [selectedDept, setSelectedDept] = useState("Retail");

  const toggleTier = (tier: string) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  const departments = ["Retail", "Corporate", "SME", "Risk"];
  const tierColors = { High: "#2563EB", Medium: "#16A34A", Low: "#EA580C" };

  const filteredData = useMemo(() => {
    const filtered = modelData.filter(
      (d) => d.department === selectedDept && selectedTiers.includes(d.tier)
    );
    const horizons = ["Overdue", "Due in 1 Month", "Due in 3 Months", "After 3 Months"];
    return horizons.map((h) => {
      const group = filtered.filter((d) => d.horizon === h);
      return {
        horizon: h,
        High: group.find((d) => d.tier === "High")?.count || 0,
        Medium: group.find((d) => d.tier === "Medium")?.count || 0,
        Low: group.find((d) => d.tier === "Low")?.count || 0,
      };
    });
  }, [selectedDept, selectedTiers]);

  const totalModels = filteredData.reduce(
    (sum, row) => sum + row.High + row.Medium + row.Low,
    0
  );

  const summaryColors = {
    "Overdue": "#EF4444",
    "Due in 1 Month": "#F59E0B",
    "Due in 3 Months": "#3B82F6",
    "After 3 Months": "#10B981",
  };

  const summaries = filteredData.map((row) => ({
    label: row.horizon,
    value: row.High + row.Medium + row.Low,
    color: summaryColors[row.horizon as keyof typeof summaryColors],
  }));

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Validation Calendar Overview ({selectedDept})
        </h3>
        <div className="text-sm text-muted-foreground">
          Total Models: <span className="font-bold text-gray-900">{totalModels}</span>
        </div>
      </div>

      {/* === Summary Tiles === */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaries.map((s) => (
          <Card
            key={s.label}
            className="p-4 flex flex-col justify-between text-center border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            style={{ borderTop: `4px solid ${s.color}` }}
            onClick={onClick}
          >
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-xs text-gray-400">models</p>
          </Card>
        ))}
      </div>

      {/* === Filters === */}
      <div className="flex justify-end items-center gap-6">
        {/* Risk Tier Multi-Select */}
        <div className="flex gap-2">
        <span className="text-s text-gray-600">Tiers:</span>

          {["High", "Medium", "Low"].map((tier) => (
            <button
              key={tier}
              onClick={() => toggleTier(tier)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs border ${
                selectedTiers.includes(tier)
                  ? "bg-gray-100 border-transparent"
                  : "opacity-60 border-gray-300"
              }`}
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: tierColors[tier as keyof typeof tierColors] }}
              />
              <span>{tier}</span>
              {selectedTiers.includes(tier) && (
                <Check className="w-3 h-3 text-green-600" />
              )}
            </button>
          ))}
        </div>

        {/* Department Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-s text-gray-600">Department:</span>
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* === Grouped Bar Chart === */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={filteredData} onClick={onClick}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="horizon" />
          <YAxis />
          <Tooltip formatter={(v) => [`${v} models`, "Pending"]} />
          <Legend />
          {selectedTiers.includes("High") && (
            <Bar dataKey="High" fill={tierColors.High} barSize={25} onClick={onClick} />
          )}
          {selectedTiers.includes("Medium") && (
            <Bar dataKey="Medium" fill={tierColors.Medium} barSize={25} onClick={onClick} />
          )}
          {selectedTiers.includes("Low") && (
            <Bar dataKey="Low" fill={tierColors.Low} barSize={25} onClick={onClick} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ValidationCalendarChart;
