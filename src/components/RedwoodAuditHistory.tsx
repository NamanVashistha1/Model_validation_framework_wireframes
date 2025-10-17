import { useState } from 'react';
import { AuditEvent } from '../types/redwood';
import { Input } from './ui/input';
import { Search, AlertCircle, FileText, MessageSquare, GitBranch } from 'lucide-react';

interface RedwoodAuditHistoryProps {
  events: AuditEvent[];
}

const eventTypeIcons = {
  status_change: GitBranch,
  severity_change: AlertCircle,
  comment_added: MessageSquare,
  issue_created: AlertCircle,
  model_registered: FileText,
  model_updated: FileText
};

const eventTypeColors = {
  status_change: 'bg-[#0067b8] text-white',
  severity_change: 'bg-[#FF9B21] text-white',
  comment_added: 'bg-[#87929D] text-white',
  issue_created: 'bg-[#DA1B1B] text-white',
  model_registered: 'bg-[#25A900] text-white',
  model_updated: 'bg-[#0067b8] text-white'
};

export function RedwoodAuditHistory({ events }: RedwoodAuditHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState<'all' | 'model' | 'issue'>('all');

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = 
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.entityName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEntity = entityFilter === 'all' || event.entityType === entityFilter;

      return matchesSearch && matchesEntity;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="p-6">
      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E0E1E3]">
        {/* Header */}
        <div className="p-6 border-b border-[#E0E1E3]">
          <h2 className="text-[#1A1816] mb-4">Audit History</h2>
          
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#87929D]" />
              <Input
                placeholder="Search audit events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#E0E1E3] focus:border-[#0067b8] focus:ring-[#0067b8]"
              />
            </div>
            
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value as 'all' | 'model' | 'issue')}
              className="px-3 py-2 border border-[#E0E1E3] rounded-md text-[#262626] focus:border-[#0067b8] focus:ring-[#0067b8] outline-none"
            >
              <option value="all">All Entities</option>
              <option value="model">Models</option>
              <option value="issue">Issues</option>
            </select>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredEvents.map((event, index) => {
              const Icon = eventTypeIcons[event.eventType];
              const colorClass = eventTypeColors[event.eventType];
              const isLast = index === filteredEvents.length - 1;

              return (
                <div key={event.id} className="relative">
                  {/* Timeline Line */}
                  {!isLast && (
                    <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-[#E0E1E3]" />
                  )}

                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 size-10 rounded-full ${colorClass} flex items-center justify-center relative z-10`}>
                      <Icon className="size-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="bg-[#F7F7F7] rounded-lg p-4 border border-[#E0E1E3]">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-[#1A1816]">{event.description}</h4>
                            <p className="text-sm text-[#262626] mt-1">
                              <span className="font-medium">{event.entityName}</span>
                              {' '}({event.entityId})
                            </p>
                          </div>
                          <span className="text-sm text-[#87929D] whitespace-nowrap">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#E0E1E3]">
                          <span className="text-sm text-[#262626]">
                            <span className="text-[#87929D]">User:</span> {event.user}
                          </span>
                          <span className="text-sm text-[#262626]">
                            <span className="text-[#87929D]">Type:</span>{' '}
                            <span className="capitalize">{event.eventType.replace('_', ' ')}</span>
                          </span>
                          <span className="text-sm text-[#262626]">
                            <span className="text-[#87929D]">Entity:</span>{' '}
                            <span className="capitalize">{event.entityType}</span>
                          </span>
                        </div>

                        {event.details && Object.keys(event.details).length > 0 && (
                          <div className="mt-3 pt-3 border-t border-[#E0E1E3]">
                            <details className="text-sm">
                              <summary className="text-[#0067b8] cursor-pointer hover:underline">
                                View details
                              </summary>
                              <pre className="mt-2 p-2 bg-white rounded border border-[#E0E1E3] text-[#262626] overflow-x-auto">
                                {JSON.stringify(event.details, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="p-12 text-center text-[#87929D]">
              <p>No audit events found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
