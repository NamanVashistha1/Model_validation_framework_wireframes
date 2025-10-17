import { RedwoodModel } from '../types/redwood';

interface RiskHeatmapProps {
  models: RedwoodModel[];
  onCellClick?: (modelId: string) => void;
}

export function RiskHeatmap({ models, onCellClick }: RiskHeatmapProps) {
  // Group models by line of business
  const loBs = Array.from(new Set(models.map(m => m.lineOfBusiness)));
  
  // Create heatmap data structure
  const heatmapData = loBs.map(lob => {
    const lobModels = models.filter(m => m.lineOfBusiness === lob);
    return {
      lob,
      models: lobModels
    };
  });

  const getColorForModel = (model: RedwoodModel): string => {
    // Determine color based on validation status and issues
    if (model.validationStatus === 'Overdue' || model.openIssuesCount > 2) {
      return 'bg-[#DA1B1B]'; // Red
    } else if (model.validationStatus === 'Pending Validation' || model.openIssuesCount > 0) {
      return 'bg-[#FF9B21]'; // Amber/Orange
    } else if (model.validationStatus === 'Validated' && model.openIssuesCount === 0) {
      return 'bg-[#25A900]'; // Green
    } else {
      return 'bg-[#FDC162]'; // Yellow (in progress)
    }
  };

  const getTooltip = (model: RedwoodModel): string => {
    return `${model.name}\nStatus: ${model.validationStatus}\nOpen Issues: ${model.openIssuesCount}\nRisk Tier: ${model.riskTier}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3] p-6">
      <div className="mb-6">
        <h3 className="text-[#1A1816] mb-2">Risk Heatmap</h3>
        <p className="text-sm text-[#87929D]">Visual representation of model status across lines of business</p>
        
        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="size-4 bg-[#25A900] rounded"></div>
            <span className="text-[#262626]">On Schedule & Validated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 bg-[#FDC162] rounded"></div>
            <span className="text-[#262626]">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 bg-[#FF9B21] rounded"></div>
            <span className="text-[#262626]">Upcoming Review / Issues</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 bg-[#DA1B1B] rounded"></div>
            <span className="text-[#262626]">Overdue / Critical</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="space-y-4 min-w-max">
          {heatmapData.map(({ lob, models: lobModels }) => (
            <div key={lob} className="flex items-start gap-4">
              <div className="w-48 flex-shrink-0 py-2">
                <p className="text-[#1A1816]">{lob}</p>
                <p className="text-sm text-[#87929D]">{lobModels.length} model{lobModels.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex-1 flex flex-wrap gap-2">
                {lobModels.map(model => (
                  <div
                    key={model.id}
                    onClick={() => onCellClick?.(model.id)}
                    className={`${getColorForModel(model)} px-4 py-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity min-w-32 relative group`}
                    title={getTooltip(model)}
                  >
                    <p className="text-white text-sm truncate">{model.name}</p>
                    <p className="text-white text-xs mt-1 opacity-90">{model.id}</p>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1A1816] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      <div className="space-y-1">
                        <div><strong>Status:</strong> {model.validationStatus}</div>
                        <div><strong>Open Issues:</strong> {model.openIssuesCount}</div>
                        <div><strong>Risk Tier:</strong> {model.riskTier}</div>
                        {model.nextValidationDate && (
                          <div><strong>Next Review:</strong> {new Date(model.nextValidationDate).toLocaleDateString()}</div>
                        )}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1816]"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
