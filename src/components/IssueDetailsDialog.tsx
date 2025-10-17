import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Issue, IssueStatus, IssueSeverity } from '../types/redwood';
import { Clock, User } from 'lucide-react';

interface IssueDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issue: Issue | null;
  onSave: (issueId: string, updates: Partial<Issue>) => void;
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

export function IssueDetailsDialog({ open, onOpenChange, issue, onSave, onAddComment }: IssueDetailsDialogProps) {
  const [status, setStatus] = useState<IssueStatus>('Pending');
  const [severity, setSeverity] = useState<IssueSeverity>('Medium');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (issue) {
      setStatus(issue.status);
      setSeverity(issue.severity);
      setNewComment('');
    }
  }, [issue]);

  const handleSave = () => {
    if (issue) {
      onSave(issue.id, { status, severity });
      onOpenChange(false);
    }
  };

  const handleAddComment = () => {
    if (issue && newComment.trim()) {
      onAddComment(issue.id, newComment);
      setNewComment('');
    }
  };

  if (!issue) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#1A1816]">{issue.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Issue Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-[#1A1816]">Description</Label>
              <p className="mt-1 text-[#262626]">{issue.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity" className="text-[#1A1816]">Severity</Label>
                <Select value={severity} onValueChange={(value) => setSeverity(value as IssueSeverity)}>
                  <SelectTrigger id="severity" className="border-[#E0E1E3]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-[#1A1816]">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as IssueStatus)}>
                  <SelectTrigger id="status" className="border-[#E0E1E3]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 pb-4 border-b border-[#E0E1E3]">
              <div className="flex items-center gap-2 text-sm text-[#262626]">
                <User className="size-4" />
                <span>Created by: {issue.createdBy}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#262626]">
                <Clock className="size-4" />
                <span>Created: {new Date(issue.createdDate).toLocaleDateString()}</span>
              </div>
              {issue.assignedTo && (
                <div className="flex items-center gap-2 text-sm text-[#262626]">
                  <User className="size-4" />
                  <span>Assigned to: {issue.assignedTo}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-[#262626]">
                <Clock className="size-4" />
                <span>Updated: {new Date(issue.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-[#1A1816]">Activity & Comments</h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {issue.comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-[#F7F7F7] rounded-lg border border-[#E0E1E3]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#1A1816]">{comment.author}</span>
                    <span className="text-sm text-[#87929D]">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[#262626]">{comment.content}</p>
                </div>
              ))}
              {issue.comments.length === 0 && (
                <p className="text-[#87929D] text-center py-4">No comments yet</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment" className="text-[#1A1816]">Add Comment</Label>
              <Textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comment..."
                className="border-[#E0E1E3] focus:border-[#0067b8] focus:ring-[#0067b8] min-h-20"
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-[#0067b8] hover:bg-[#005a9e] text-white"
              >
                Add Comment
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#E0E1E3] text-[#262626] hover:bg-[#F7F7F7]"
          >
            Close
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#0067b8] hover:bg-[#005a9e] text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
