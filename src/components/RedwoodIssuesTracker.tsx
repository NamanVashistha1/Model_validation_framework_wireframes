import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Issue, IssueSeverity, IssueStatus } from '../types/redwood';
import { Plus, Search } from 'lucide-react';
import { IssueDetailsDialog } from './IssueDetailsDialog';

interface RedwoodIssuesTrackerProps {
  issues: Issue[];
  onIssueUpdate: (issueId: string, updates: Partial<Issue>) => void;
  onIssueAdd: (issue: Partial<Issue>) => void;
  onAddComment: (issueId: string, comment: string) => void;
}

const severityColors = {
  Critical: 'bg-[#DA1B1B] text-white',
  High: 'bg-[#FF9B21] text-white',
  Medium: 'bg-[#FDC162] text-white',
  Low: 'bg-[#25A900] text-white'
};

const statusColors = {
  Pending: 'bg-[#0067b8] text-white',
  Closed: 'bg-[#87929D] text-white'
};

export function RedwoodIssuesTracker({ 
  issues, 
  onIssueUpdate, 
  onIssueAdd,
  onAddComment
}: RedwoodIssuesTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'All'>('All');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.modelId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'All' || issue.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleRowClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setDialogOpen(true);
  };

  const handleSave = (issueId: string, updates: Partial<Issue>) => {
    onIssueUpdate(issueId, updates);
  };

  return (
    <div className="p-6">
      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3]">
        {/* Header */}
        <div className="p-6 border-b border-[#E0E1E3]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#1A1816]">Findings & Issues</h2>
            <Button className="bg-[#FF9B21] hover:bg-[#e68a1a] text-white">
              <Plus className="size-4 mr-2" />
              Add Finding
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#87929D]" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#E0E1E3] focus:border-[#0067b8] focus:ring-[#0067b8]"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as IssueSeverity | 'All')}
                className="px-3 py-2 border border-[#E0E1E3] rounded-md text-[#262626] focus:border-[#0067b8] focus:ring-[#0067b8] outline-none"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as IssueStatus | 'All')}
                className="px-3 py-2 border border-[#E0E1E3] rounded-md text-[#262626] focus:border-[#0067b8] focus:ring-[#0067b8] outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F2F6FB]">
              <TableRow className="border-b border-[#E0E1E3]">
                <TableHead className="text-[#1A1816]">Issue ID</TableHead>
                <TableHead className="text-[#1A1816]">Model ID</TableHead>
                <TableHead className="text-[#1A1816]">Title</TableHead>
                <TableHead className="text-[#1A1816]">Severity</TableHead>
                <TableHead className="text-[#1A1816]">Status</TableHead>
                <TableHead className="text-[#1A1816]">Created</TableHead>
                <TableHead className="text-[#1A1816]">Last Updated</TableHead>
                <TableHead className="text-[#1A1816]">Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.map((issue, index) => (
                <TableRow 
                  key={issue.id}
                  onClick={() => handleRowClick(issue)}
                  className={`border-b border-[#E0E1E3] cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#F7F7F7]'
                  } hover:bg-[#F2F6FB] transition-colors`}
                >
                  <TableCell className="text-[#262626]">{issue.id}</TableCell>
                  <TableCell className="text-[#262626]">{issue.modelId}</TableCell>
                  <TableCell className="text-[#1A1816] max-w-md truncate">{issue.title}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-3 py-1 rounded-full ${severityColors[issue.severity]}`}>
                      {issue.severity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block px-3 py-1 rounded-full ${statusColors[issue.status]}`}>
                      {issue.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-[#262626]">
                    {new Date(issue.createdDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-[#262626]">
                    {new Date(issue.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-[#262626]">{issue.assignedTo || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredIssues.length === 0 && (
          <div className="p-12 text-center text-[#87929D]">
            <p>No issues found matching your filters.</p>
          </div>
        )}
      </div>

      <IssueDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        issue={selectedIssue}
        onSave={handleSave}
        onAddComment={onAddComment}
      />
    </div>
  );
}
