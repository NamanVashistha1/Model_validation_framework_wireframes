import { useState } from 'react';
import { Finding, FindingSeverity } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FindingsStepProps {
  findings: Finding[];
  onComplete: () => void;
  onUpdateFindings: (findings: Finding[]) => void;
}

export function FindingsStep({ findings, onComplete, onUpdateFindings }: FindingsStepProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFinding, setNewFinding] = useState<Omit<Finding, 'id'>>({
    category: '',
    severity: 'Medium',
    description: '',
    recommendation: '',
    status: 'Open',
    dateIdentified: new Date().toISOString(),
    assignedTo: ''
  });

  const getSeverityColor = (severity: FindingSeverity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Remediation': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddFinding = () => {
    const finding: Finding = {
      ...newFinding,
      id: `F-${Date.now()}`
    };
    onUpdateFindings([...findings, finding]);
    setIsAddDialogOpen(false);
    setNewFinding({
      category: '',
      severity: 'Medium',
      description: '',
      recommendation: '',
      status: 'Open',
      dateIdentified: new Date().toISOString(),
      assignedTo: ''
    });
  };

  const handleDeleteFinding = (id: string) => {
    onUpdateFindings(findings.filter(f => f.id !== id));
  };

  const handleUpdateStatus = (id: string, status: Finding['status']) => {
    onUpdateFindings(findings.map(f => f.id === id ? { ...f, status } : f));
  };

  const stats = {
    total: findings.length,
    critical: findings.filter(f => f.severity === 'Critical').length,
    high: findings.filter(f => f.severity === 'High').length,
    open: findings.filter(f => f.status === 'Open').length,
    resolved: findings.filter(f => f.status === 'Resolved').length
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <h2>Findings, Issues & Remediation</h2>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Finding
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Finding</DialogTitle>
                <DialogDescription>
                  Document a new validation finding or issue
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Data Quality, Model Performance"
                      value={newFinding.category}
                      onChange={(e) => setNewFinding({ ...newFinding, category: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="severity">Severity</Label>
                    <Select 
                      value={newFinding.severity} 
                      onValueChange={(value: FindingSeverity) => setNewFinding({ ...newFinding, severity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the finding..."
                    value={newFinding.description}
                    onChange={(e) => setNewFinding({ ...newFinding, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="recommendation">Recommendation</Label>
                  <Textarea
                    id="recommendation"
                    placeholder="Recommended actions to address this finding..."
                    value={newFinding.recommendation}
                    onChange={(e) => setNewFinding({ ...newFinding, recommendation: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
                  <Input
                    id="assignedTo"
                    placeholder="Person responsible for remediation"
                    value={newFinding.assignedTo}
                    onChange={(e) => setNewFinding({ ...newFinding, assignedTo: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFinding}>Add Finding</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-muted-foreground mb-6">
          Document and track all validation findings, issues, and recommended actions
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Findings</p>
            <p className="text-2xl">{stats.total}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Critical</p>
            <p className="text-2xl text-red-600">{stats.critical}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">High</p>
            <p className="text-2xl text-orange-600">{stats.high}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Open</p>
            <p className="text-2xl text-yellow-600">{stats.open}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Resolved</p>
            <p className="text-2xl text-green-600">{stats.resolved}</p>
          </div>
        </div>

        {/* Findings Table */}
        {findings.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {findings.map((finding) => (
                  <TableRow key={finding.id}>
                    <TableCell>{finding.id}</TableCell>
                    <TableCell>{finding.category}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(finding.severity)}>
                        {finding.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm line-clamp-2">{finding.description}</p>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={finding.status}
                        onValueChange={(value: Finding['status']) => handleUpdateStatus(finding.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="In Remediation">In Remediation</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(finding.dateIdentified).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFinding(finding.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-muted-foreground mb-4">No findings logged yet</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Finding
            </Button>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button onClick={onComplete}>
            Complete Step
          </Button>
        </div>
      </Card>
    </div>
  );
}
