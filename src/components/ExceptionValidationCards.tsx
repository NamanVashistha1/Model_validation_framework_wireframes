import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Play, Eye } from "lucide-react";

export default function RevalidationTriggers() {
  const [selectedTrigger, setSelectedTrigger] = useState("overdue");

  // Mock model data
  const models = [
    { id: "M001", name: "PD Model A", risk: "High", dept: "Retail", status: "Overdue", overdueDays: 45 },
    { id: "M002", name: "LGD Model B", risk: "Medium", dept: "Corporate", status: "Overdue", overdueDays: 15 },
    { id: "M003", name: "EAD Model C", risk: "Low", dept: "SME", status: "Overdue", overdueDays: 70 },
    { id: "M004", name: "Stress Model D", risk: "High", dept: "Risk", status: "Drift", change: "Feature drift detected" },
    { id: "M005", name: "CCF Model E", risk: "Medium", dept: "Retail", status: "Findings", findings: 3 },
  ];

  const triggerColors = {
    overdue: "red",
    performance: "orange",
    findings: "yellow",
    drift: "blue",
  };

  const triggerColor = triggerColors[selectedTrigger];

  const filteredModels = models.filter((m) => {
    if (selectedTrigger === "overdue") return m.status === "Overdue";
    if (selectedTrigger === "drift") return m.status === "Drift";
    if (selectedTrigger === "findings") return m.status === "Findings";
    if (selectedTrigger === "performance") return m.status === "Performance";
    return true;
  });

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Exception based Re-validation Models </h3>
        <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select trigger type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overdue">Parameter Drift</SelectItem>
            <SelectItem value="performance">Performance Breaches</SelectItem>
            <SelectItem value="findings">Repeated Findings</SelectItem>
            {/* <SelectItem value="drift">Parameter Drift</SelectItem> */}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Tiles */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`bg-white border-l-6 border-l-${triggerColor}-500 rounded-lg p-4 shadow-sm`}>
          <div className="font-semibold text-gray-800 mb-1">Total Affected</div>
          <div className={`text-3xl font-bold text-${triggerColor}-600`}>{filteredModels.length}</div>
          <p className="text-sm text-gray-600">Models impacted by trigger</p>
        </div>
        <div className={`bg-white border-l-6 border-l-${triggerColor}-500 rounded-lg p-4 shadow-sm`}>
          <div className="font-semibold text-gray-800 mb-1">High Risk</div>
          <div className={`text-3xl font-bold text-${triggerColor}-600`}>
            {filteredModels.filter((m) => m.risk === "High").length}
          </div>
          <p className="text-sm text-gray-600">Critical impact models</p>
        </div>
        <div className={`bg-white border-l-6 border-l-${triggerColor}-500 rounded-lg p-4 shadow-sm`}>
          <div className="font-semibold text-gray-800 mb-1">Departments</div>
          <div className={`text-3xl font-bold text-${triggerColor}-600`}>
            {[...new Set(filteredModels.map((m) => m.dept))].length}
          </div>
          <p className="text-sm text-gray-600">Departments affected</p>
        </div> */}
        {/* <div className={`bg-white border-l-6 border-l-${triggerColor}-500 rounded-lg p-4 shadow-sm`}>
          <div className="font-semibold text-gray-800 mb-1">Avg Severity</div>
          <div className={`text-3xl font-bold text-${triggerColor}-600`}>Moderate</div>
          <p className="text-sm text-gray-600">Average trigger intensity</p>
        </div> */}
      

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => (
          <Card key={model.id} className={`p-4 border-t-4 border-t-${triggerColor}-500`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className={`font-semibold text-${triggerColor}-800`}>{model.name}</p>
                <p className="text-sm text-gray-600">
                  ID: {model.id} • {model.risk} Risk • {model.dept}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-700 mb-3">
              {selectedTrigger === "overdue" && `Overdue by ${model.overdueDays} days`}
              {selectedTrigger === "drift" && model.change}
              {selectedTrigger === "findings" && `${model.findings} unresolved findings`}
              {selectedTrigger === "performance" && "Performance breach detected"}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className={`p-2 bg-${triggerColor}-100 hover:bg-${triggerColor}-200 rounded-full`}>
                    <Play className={`h-4 w-4 text-${triggerColor}-700`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Launch Validation</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                    <Eye className="h-4 w-4 text-gray-700" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>View Model 360°</TooltipContent>
              </Tooltip>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredModels.length === 0 && (
        <div className="text-center text-gray-500 py-8">No models found for this trigger.</div>
      )}
    </Card>
  );
}
