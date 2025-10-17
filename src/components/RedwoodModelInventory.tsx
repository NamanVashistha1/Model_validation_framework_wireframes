import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { RedwoodModel, LifecycleStage, RiskTier, ValidationStatus } from '../types/redwood';
import { Plus, Search, Eye, Activity, Download, Filter } from 'lucide-react';
import { ModelRegistrationDialog } from './ModelRegistrationDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface RedwoodModelInventoryProps {
  models: RedwoodModel[];
  onModelUpdate: (model: RedwoodModel) => void;
  onModelAdd: (model: Partial<RedwoodModel>) => void;
  onViewDetails: (modelId: string) => void;
  onLaunchValidation: (modelId: string) => void;
}

export function RedwoodModelInventory({ 
  models, 
  onModelUpdate, 
  onModelAdd,
  onViewDetails,
  onLaunchValidation
}: RedwoodModelInventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<RedwoodModel | null>(null);
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('all');
  const [riskTierFilter, setRiskTierFilter] = useState<string>('all');
  const [validationStatusFilter, setValidationStatusFilter] = useState<string>('all');
  const [lobFilter, setLobFilter] = useState<string>('all');

  const filteredModels = models.filter(model => {
    const matchesSearch = 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLifecycle = lifecycleFilter === 'all' || model.lifecycleStage === lifecycleFilter;
    const matchesRiskTier = riskTierFilter === 'all' || model.riskTier === riskTierFilter;
    const matchesStatus = validationStatusFilter === 'all' || model.validationStatus === validationStatusFilter;
    const matchesLob = lobFilter === 'all' || model.lineOfBusiness === lobFilter;

    return matchesSearch && matchesLifecycle && matchesRiskTier && matchesStatus && matchesLob;
  });

  // Get unique lines of business for filter
  const loBs = Array.from(new Set(models.map(m => m.lineOfBusiness)));

  const handleEdit = (model: RedwoodModel) => {
    setEditingModel(model);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingModel(null);
    setDialogOpen(true);
  };

  const handleSave = (modelData: Partial<RedwoodModel>) => {
    if (editingModel) {
      onModelUpdate({ ...editingModel, ...modelData } as RedwoodModel);
    } else {
      onModelAdd(modelData);
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Model ID', 'Model Name', 'Owner', 'Department', 'LoB', 'Risk Tier', 'Lifecycle', 'Validation Status', 'Open Issues'];
    const rows = filteredModels.map(m => [
      m.id,
      m.name,
      m.owner,
      m.department,
      m.lineOfBusiness,
      m.riskTier,
      m.lifecycleStage,
      m.validationStatus,
      m.openIssuesCount.toString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `model-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3]">
        {/* Header */}
        <div className="p-6 border-b border-[#E0E1E3]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#1A1816]">Model Inventory</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleExport}
                className="border-[#0067b8] text-[#0067b8] hover:bg-[#E8F3FC]"
              >
                <Download className="size-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={handleAddNew}
                className="bg-[#0067b8] hover:bg-[#005a9e] text-white"
              >
                <Plus className="size-4 mr-2" />
                Register New Model
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#87929D]" />
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#E0E1E3] focus:border-[#0067b8] focus:ring-[#0067b8]"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-[#87929D]" />
              <span className="text-sm text-[#87929D]">Filters:</span>
            </div>
            
            <Select value={lifecycleFilter} onValueChange={setLifecycleFilter}>
              <SelectTrigger className="w-40 border-[#E0E1E3]">
                <SelectValue placeholder="Lifecycle" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Lifecycles</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Deployed">Deployed</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskTierFilter} onValueChange={setRiskTierFilter}>
              <SelectTrigger className="w-32 border-[#E0E1E3]">
                <SelectValue placeholder="Risk Tier" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Risk Tiers</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={validationStatusFilter} onValueChange={setValidationStatusFilter}>
              <SelectTrigger className="w-48 border-[#E0E1E3]">
                <SelectValue placeholder="Validation Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Validated">Validated</SelectItem>
                <SelectItem value="Pending Validation">Pending Validation</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
              </SelectContent>
            </Select>

            <Select value={lobFilter} onValueChange={setLobFilter}>
              <SelectTrigger className="w-48 border-[#E0E1E3]">
                <SelectValue placeholder="Line of Business" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Lines of Business</SelectItem>
                {loBs.map(lob => (
                  <SelectItem key={lob} value={lob}>{lob}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(lifecycleFilter !== 'all' || riskTierFilter !== 'all' || validationStatusFilter !== 'all' || lobFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLifecycleFilter('all');
                  setRiskTierFilter('all');
                  setValidationStatusFilter('all');
                  setLobFilter('all');
                }}
                className="text-[#0067b8] hover:bg-[#E8F3FC]"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F2F6FB]">
              <TableRow className="border-b border-[#E0E1E3]">
                <TableHead className="text-[#1A1816]">Model ID</TableHead>
                <TableHead className="text-[#1A1816]">Model Name</TableHead>
                <TableHead className="text-[#1A1816]">Owner</TableHead>
                <TableHead className="text-[#1A1816]">LoB</TableHead>
                <TableHead className="text-[#1A1816]">Risk Tier</TableHead>
                <TableHead className="text-[#1A1816]">Lifecycle</TableHead>
                <TableHead className="text-[#1A1816]">Validation Status</TableHead>
                <TableHead className="text-[#1A1816]"># Open Issues</TableHead>
                <TableHead className="text-[#1A1816]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.map((model, index) => (
                <TableRow 
                  key={model.id}
                  className={`border-b border-[#E0E1E3] ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#F7F7F7]'
                  } hover:bg-[#F2F6FB] transition-colors`}
                >
                  <TableCell className="text-[#262626]">{model.id}</TableCell>
                  <TableCell className="text-[#1A1816]">{model.name}</TableCell>
                  <TableCell className="text-[#262626]">{model.owner}</TableCell>
                  <TableCell className="text-[#262626]">{model.lineOfBusiness}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-3 py-1 rounded-full text-white ${
                      model.riskTier === 'High' ? 'bg-[#DA1B1B]' :
                      model.riskTier === 'Medium' ? 'bg-[#FF9B21]' : 'bg-[#25A900]'
                    }`}>
                      {model.riskTier}
                    </span>
                  </TableCell>
                  <TableCell className="text-[#262626]">{model.lifecycleStage}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-3 py-1 rounded-full text-white ${
                      model.validationStatus === 'Overdue' ? 'bg-[#DA1B1B]' :
                      model.validationStatus === 'Pending Validation' ? 'bg-[#FF9B21]' :
                      model.validationStatus === 'In Progress' ? 'bg-[#0067b8]' : 'bg-[#25A900]'
                    }`}>
                      {model.validationStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-white ${
                      model.openIssuesCount > 0 ? 'bg-[#DA1B1B]' : 'bg-[#25A900]'
                    }`}>
                      {model.openIssuesCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(model.id)}
                        className="border-[#0067b8] text-[#0067b8] hover:bg-[#E8F3FC]"
                      >
                        <Eye className="size-4 mr-1" />
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onLaunchValidation(model.id)}
                        className="border-[#FF9B21] text-[#FF9B21] hover:bg-[#FFF4E8]"
                      >
                        <Activity className="size-4 mr-1" />
                        Validate
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredModels.length === 0 && (
          <div className="p-12 text-center text-[#87929D]">
            <p>No models found matching your search.</p>
          </div>
        )}
      </div>

      <ModelRegistrationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        model={editingModel}
        onSave={handleSave}
      />
    </div>
  );
}
