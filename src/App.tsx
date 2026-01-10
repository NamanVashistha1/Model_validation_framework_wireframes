import { useState } from 'react';
import { ModelInventoryDashboard } from './components/ModelInventoryDashboard';
import { ModelOverview } from './components/ModelOverview';
import { ValidationWorkbench } from './components/ValidationWorkbench';
import { RedwoodAppShell } from './components/RedwoodAppShell';
import { ModelRiskDashboard } from './components/ModelRiskDashboard';
import { RedwoodModelInventory } from './components/RedwoodModelInventory';
import { RedwoodIssuesTracker } from './components/RedwoodIssuesTracker';
import { RedwoodAuditHistory } from './components/RedwoodAuditHistory';
import { ModelDetailView } from './components/ModelDetailView';
import { mockModels } from './data/mockData';
import { redwoodModels as initialRedwoodModels, issues as initialIssues, auditEvents as initialAuditEvents } from './data/redwoodMockData';
import { Model } from './types/model';
import { RedwoodModel, Issue, AuditEvent } from './types/redwood';

type ViewMode = 'redwood' | 'validation';
type RedwoodView = 'dashboard' | 'inventory' | 'issues' | 'audit' | 'model-detail';

export default function App() {
  // Redwood state
  const [redwoodView, setRedwoodView] = useState<RedwoodView>('dashboard');
  const [redwoodModels, setRedwoodModels] = useState<RedwoodModel[]>(initialRedwoodModels);
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(initialAuditEvents);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  // Validation workbench state
  const [viewMode, setViewMode] = useState<ViewMode>('redwood');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  // Redwood handlers
  const handleModelUpdate = (model: RedwoodModel) => {
    setRedwoodModels(prev => prev.map(m => m.id === model.id ? model : m));
    
    // Add audit event
    const newEvent: AuditEvent = {
      id: `AUD-${Date.now()}`,
      eventType: 'model_updated',
      entityType: 'model',
      entityId: model.id,
      entityName: model.name,
      user: 'Current User',
      description: `Model ${model.name} updated`,
      timestamp: new Date().toISOString(),
      details: { updated: true }
    };
    setAuditEvents(prev => [newEvent, ...prev]);
  };

  const handleModelAdd = (modelData: Partial<RedwoodModel>) => {
    const newModel: RedwoodModel = {
      id: modelData.id || `MDL-${Date.now()}`,
      name: modelData.name || '',
      description: modelData.description || '',
      owner: modelData.owner || '',
      department: modelData.department || '',
      lineOfBusiness: modelData.lineOfBusiness || '',
      lifecycleStage: modelData.lifecycleStage || 'Development',
      riskTier: modelData.riskTier || 'Medium',
      usageFrequency: modelData.usageFrequency || 'Daily',
      monitoringCycle: modelData.monitoringCycle || 'Daily',
      registeredDate: modelData.registeredDate || new Date().toISOString().split('T')[0],
      openIssuesCount: 0,
      validationStatus: 'Pending Validation',
      regulatoryScope: 'Non-regulated',
      independentValidation: false,
      documentationComplete: false
    };
    setRedwoodModels(prev => [...prev, newModel]);

    // Add audit event
    const newEvent: AuditEvent = {
      id: `AUD-${Date.now()}`,
      eventType: 'model_registered',
      entityType: 'model',
      entityId: newModel.id,
      entityName: newModel.name,
      user: 'Current User',
      description: `New model registered: ${newModel.name}`,
      timestamp: new Date().toISOString()
    };
    setAuditEvents(prev => [newEvent, ...prev]);
  };

  const handleIssueUpdate = (issueId: string, updates: Partial<Issue>) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const updated = { ...issue, ...updates, lastUpdated: new Date().toISOString() };
        
        // Add audit events for changes
        if (updates.status && updates.status !== issue.status) {
          const statusEvent: AuditEvent = {
            id: `AUD-${Date.now()}-status`,
            eventType: 'status_change',
            entityType: 'issue',
            entityId: issueId,
            entityName: issue.title,
            user: 'Current User',
            description: `Status changed from ${issue.status} to ${updates.status}`,
            timestamp: new Date().toISOString(),
            details: { oldStatus: issue.status, newStatus: updates.status }
          };
          setAuditEvents(prev => [statusEvent, ...prev]);
        }

        if (updates.severity && updates.severity !== issue.severity) {
          const severityEvent: AuditEvent = {
            id: `AUD-${Date.now()}-severity`,
            eventType: 'severity_change',
            entityType: 'issue',
            entityId: issueId,
            entityName: issue.title,
            user: 'Current User',
            description: `Severity changed from ${issue.severity} to ${updates.severity}`,
            timestamp: new Date().toISOString(),
            details: { oldSeverity: issue.severity, newSeverity: updates.severity }
          };
          setAuditEvents(prev => [severityEvent, ...prev]);
        }

        return updated;
      }
      return issue;
    }));
  };

  const handleAddComment = (issueId: string, comment: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const newComment = {
          id: `C-${Date.now()}`,
          author: 'Current User',
          content: comment,
          timestamp: new Date().toISOString()
        };
        
        // Add audit event
        const commentEvent: AuditEvent = {
          id: `AUD-${Date.now()}`,
          eventType: 'comment_added',
          entityType: 'issue',
          entityId: issueId,
          entityName: issue.title,
          user: 'Current User',
          description: `Comment added to issue ${issueId}`,
          timestamp: new Date().toISOString()
        };
        setAuditEvents(prev => [commentEvent, ...prev]);

        return {
          ...issue,
          comments: [...issue.comments, newComment],
          lastUpdated: new Date().toISOString()
        };
      }
      return issue;
    }));
  };

  // Navigation to validation workbench
  const handleLaunchValidation = (modelId: string) => {
    const model = mockModels.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      setViewMode('validation');
    }
  };

  const handleViewDetails = (modelId: string) => {
    setSelectedModelId(modelId);
    setRedwoodView('model-detail');
  };

  const handleBackToInventory = () => {
    setSelectedModelId(null);
    setRedwoodView('inventory');
  };

  const handleEditModel = (model: RedwoodModel) => {
    // This would open the edit dialog in RedwoodModelInventory
    // For now, we'll just navigate back to inventory
    handleBackToInventory();
  };

  const handleBackToRedwood = () => {
    setViewMode('redwood');
    setSelectedModel(null);
  };

  if (viewMode === 'validation' && selectedModel) {
    return (
      <div className="size-full">
        <ValidationWorkbench
          model={selectedModel}
          onBack={handleBackToRedwood}
        />
      </div>
    );
  }

  return (
    <div className="size-full">
      <RedwoodAppShell currentView={redwoodView} onViewChange={setRedwoodView}>
        {redwoodView === 'dashboard' && (
          <ModelRiskDashboard
            models={mockModels}
            onViewModel={handleViewDetails}
            onViewDocumentation={(modelId) => console.log('View documentation:', modelId)}
            onViewValidationReport={(modelId) => console.log('View validation report:', modelId)}
            onMonitorModel={(modelId) => console.log('Monitor model:', modelId)}
            onInitiateValidation={handleLaunchValidation}
            onViewModel360={(modelId) => handleViewDetails(modelId)}
            onNavigateToList={(filters) => {
              if (filters) {
                // Apply filters if provided
                console.log('Applying filters:', filters);
              }
              setRedwoodView('inventory');
            }}
          />
        )}

        {redwoodView === 'inventory' && (
          <RedwoodModelInventory
            models={redwoodModels}
            onModelUpdate={handleModelUpdate}
            onModelAdd={handleModelAdd}
            onViewDetails={handleViewDetails}
            onLaunchValidation={handleLaunchValidation}
          />
        )}

        {redwoodView === 'model-detail' && selectedModelId && (
          <ModelDetailView
            modelId={selectedModelId}
            models={redwoodModels}
            issues={issues}
            auditEvents={auditEvents}
            onBack={handleBackToInventory}
            onEdit={handleEditModel}
            onLaunchValidation={handleLaunchValidation}
          />
        )}

        {redwoodView === 'issues' && (
          <RedwoodIssuesTracker
            issues={issues}
            onIssueUpdate={handleIssueUpdate}
            onIssueAdd={(issue) => {}}
            onAddComment={handleAddComment}
          />
        )}

        {redwoodView === 'audit' && (
          <RedwoodAuditHistory events={auditEvents} />
        )}
      </RedwoodAppShell>
    </div>
  );
}
