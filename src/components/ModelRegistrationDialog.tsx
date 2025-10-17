import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RedwoodModel, UsageFrequency, MonitoringCycle } from '../types/redwood';

interface ModelRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model?: RedwoodModel | null;
  onSave: (model: Partial<RedwoodModel>) => void;
}

export function ModelRegistrationDialog({ open, onOpenChange, model, onSave }: ModelRegistrationDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    usageFrequency: 'Daily' as UsageFrequency,
    monitoringCycle: 'Daily' as MonitoringCycle
  });

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name,
        description: model.description || '',
        owner: model.owner,
        usageFrequency: model.usageFrequency,
        monitoringCycle: model.monitoringCycle
      });
    } else {
      setFormData({
        name: '',
        description: '',
        owner: '',
        usageFrequency: 'Daily',
        monitoringCycle: 'Daily'
      });
    }
  }, [model, open]);

  const handleSave = () => {
    onSave({
      ...formData,
      id: model?.id || `MDL-${Date.now()}`,
      registeredDate: model?.registeredDate || new Date().toISOString().split('T')[0],
      openIssuesCount: model?.openIssuesCount || 0
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[#1A1816]">
            {model ? 'Edit Model' : 'Register New Model'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#1A1816]">Model Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-[#E0E1E3] focus:border-[#0067b8] focus:ring-[#0067b8]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#1A1816]">Model Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border-[#E0E1E3] focus:border-[#0067b8] focus:ring-[#0067b8] min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner" className="text-[#1A1816]">Owner</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className="border-[#E0E1E3] focus:border-[#0067b8] focus:ring-[#0067b8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usage" className="text-[#1A1816]">Usage Frequency</Label>
              <Select
                value={formData.usageFrequency}
                onValueChange={(value) => setFormData({ ...formData, usageFrequency: value as UsageFrequency })}
              >
                <SelectTrigger id="usage" className="border-[#E0E1E3] focus:border-[#0067b8] focus:ring-[#0067b8]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Real-time">Real-time</SelectItem>
                  <SelectItem value="Hourly">Hourly</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="On-Demand">On-Demand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monitoring" className="text-[#1A1816]">Monitoring Cycle</Label>
              <Select
                value={formData.monitoringCycle}
                onValueChange={(value) => setFormData({ ...formData, monitoringCycle: value as MonitoringCycle })}
              >
                <SelectTrigger id="monitoring" className="border-[#E0E1E3] focus:border-[#0067b8] focus:ring-[#0067b8]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Every 5 minutes">Every 5 minutes</SelectItem>
                  <SelectItem value="Hourly">Hourly</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#E0E1E3] text-[#262626] hover:bg-[#F7F7F7]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#0067b8] hover:bg-[#005a9e] text-white"
          >
            {model ? 'Save Changes' : 'Register Model'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
