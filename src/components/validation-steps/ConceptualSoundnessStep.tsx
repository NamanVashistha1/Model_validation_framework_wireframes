import { useState } from 'react';
import { Model, Finding } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { FileText, Upload } from 'lucide-react';
import { Input } from '../ui/input';

interface ConceptualSoundnessStepProps {
  model: Model;
  onComplete: () => void;
  onAddFinding: (finding: Omit<Finding, 'id'>) => void;
}

export function ConceptualSoundnessStep({ model, onComplete, onAddFinding }: ConceptualSoundnessStepProps) {
  const [designReview, setDesignReview] = useState('');
  const [regulatoryAlignment, setRegulatoryAlignment] = useState('');
  const [riskFactors, setRiskFactors] = useState('');
  const [changeLog, setChangeLog] = useState('');
  const [checklist, setChecklist] = useState({
    modelPurpose: false,
    theoreticalSoundness: false,
    assumptions: false,
    limitations: false,
    regulatoryCompliance: false,
    changeManagement: false
  });

  const handleComplete = () => {
    const allChecked = Object.values(checklist).every(v => v);
    if (!allChecked) {
      onAddFinding({
        category: 'Conceptual Soundness',
        severity: 'Medium',
        description: 'Not all checklist items completed',
        recommendation: 'Complete all mandatory checklist items before proceeding',
        status: 'Open',
        dateIdentified: new Date().toISOString()
      });
    }
    onComplete();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" />
          <h2>Conceptual Soundness Assessment</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Review the model's design, regulatory alignment, risk factors, and change logs
        </p>

        {/* Checklist */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="mb-3">Validation Checklist</h3>
          <div className="space-y-3">
            {Object.entries({
              modelPurpose: 'Model purpose clearly defined and documented',
              theoreticalSoundness: 'Theoretical foundation is sound and appropriate',
              assumptions: 'Key assumptions identified and validated',
              limitations: 'Model limitations documented and understood',
              regulatoryCompliance: 'Regulatory requirements addressed',
              changeManagement: 'Change management process followed'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={checklist[key as keyof typeof checklist]}
                  onCheckedChange={(checked) => 
                    setChecklist({ ...checklist, [key]: checked as boolean })
                  }
                />
                <Label htmlFor={key} className="cursor-pointer">{label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Design Review */}
        <div className="mb-6">
          <Label htmlFor="design-review">Model Design Review</Label>
          <Textarea
            id="design-review"
            placeholder="Evaluate the model's design, methodology, and approach. Consider if it aligns with industry best practices..."
            value={designReview}
            onChange={(e) => setDesignReview(e.target.value)}
            rows={4}
            className="mt-2"
          />
        </div>

        {/* Regulatory Alignment */}
        <div className="mb-6">
          <Label htmlFor="regulatory">Regulatory Alignment Assessment</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Current Scope: {model.regulatoryScope}
          </p>
          <Textarea
            id="regulatory"
            placeholder="Assess compliance with regulatory requirements (Basel III, IFRS 9, CECL, etc.)..."
            value={regulatoryAlignment}
            onChange={(e) => setRegulatoryAlignment(e.target.value)}
            rows={4}
            className="mt-2"
          />
        </div>

        {/* Risk Factors */}
        <div className="mb-6">
          <Label htmlFor="risk-factors">Risk Factors Identification</Label>
          <Textarea
            id="risk-factors"
            placeholder="Identify and document key risk factors, including data quality risks, model risks, and operational risks..."
            value={riskFactors}
            onChange={(e) => setRiskFactors(e.target.value)}
            rows={4}
            className="mt-2"
          />
        </div>

        {/* Change Log Review */}
        <div className="mb-6">
          <Label htmlFor="change-log">Change Log Review</Label>
          <Textarea
            id="change-log"
            placeholder="Review model changes since last validation. Document material changes and their impact..."
            value={changeLog}
            onChange={(e) => setChangeLog(e.target.value)}
            rows={4}
            className="mt-2"
          />
        </div>

        {/* Evidence Upload */}
        <div className="mb-6">
          <Label>Supporting Evidence</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-muted-foreground mb-1">Upload documentation</p>
            <p className="text-xs text-muted-foreground">Model design docs, methodology papers, regulatory mappings</p>
            <Input type="file" className="hidden" multiple />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => {
            onAddFinding({
              category: 'Conceptual Soundness',
              severity: 'Low',
              description: 'Sample finding logged during conceptual review',
              recommendation: 'Address identified concern',
              status: 'Open',
              dateIdentified: new Date().toISOString()
            });
          }}>
            Log Finding
          </Button>
          <Button onClick={handleComplete}>
            Complete Step
          </Button>
        </div>
      </Card>
    </div>
  );
}
