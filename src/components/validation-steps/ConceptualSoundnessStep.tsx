import { useState } from 'react';
import { Model, Finding } from '../../types/model';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { FileText, Upload } from 'lucide-react';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface ConceptualSoundnessStepProps {
  model: Model;
  onComplete: () => void;
  onAddFinding: (finding: Omit<Finding, 'id'>) => void;
  onSave?: () => void;
  onSaveAndContinue?: () => void;
  onCancel?: () => void;
}

export function ConceptualSoundnessStep({ model, onComplete, onAddFinding, onSave, onSaveAndContinue, onCancel }: ConceptualSoundnessStepProps) {
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

const [validatorNotes, setValidatorNotes] = useState('');

const handleComplete = () => {
  const allChecked = Object.values(checklist).every(v => v);
  if (!allChecked) {
    onAddFinding({
      category: 'Conceptual Analysis',
      severity: 'Medium',
      description: 'Not all checklist items completed',
      recommendation: 'Complete all mandatory checklist items before proceeding',
      status: 'Open',
      dateIdentified: new Date().toISOString()
    });
  }
  onComplete();
};

const validationChecklist = [
  { item: 'Model purpose clearly defined and documented', feedback: 'Purpose aligns with business needs' },
  { item: 'Theoretical foundation is sound and appropriate', feedback: 'Methodology is theoretically valid' },
  { item: 'Key assumptions identified and validated', feedback: 'Assumptions are reasonable' },
  { item: 'Model limitations documented and understood', feedback: 'Limitations are acknowledged' },
  { item: 'Regulatory requirements addressed', feedback: 'Compliant with regulations' },
  { item: 'Change management process followed', feedback: 'Changes properly managed' }
];

const [checklistData, setChecklistData] = useState(validationChecklist.map(() => ({ status: '', remarks: '' })));


const [changeLogs, setChangeLogs] = useState([
  { type: 'Parameter Change', description: 'Updated threshold from 0.5 to 0.6', date: '2023-05-15', status: 'Approved' },
  { type: 'Input Data Update', description: 'Added new feature: credit_score', date: '2023-06-20', status: 'Tested' },
  { type: 'Codebase Modification', description: 'Refactored prediction function', date: '2023-07-10', status: 'Documented' }
]);

const [changeLogData, setChangeLogData] = useState(changeLogs.map(() => ({ comment: '', remarks: '' })));

const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
const [newChangeLog, setNewChangeLog] = useState({ type: '', description: '', date: '', status: '' });

const handleAddChangeLog = () => {
  setChangeLogs([...changeLogs, newChangeLog]);
  setChangeLogData([...changeLogData, { comment: '', remarks: '' }]);
  setNewChangeLog({ type: '', description: '', date: '', status: '' });
  setIsAddDialogOpen(false);
};

return (
  <div className="space-y-6">
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5" />
        <h2>Conceptual Soundness Assessment</h2>
      </div>
      <p className="text-muted-foreground mb-6">
        Comprehensive conceptual soundness assessment covering model purpose, methodology, theoretical foundations, and regulatory alignment
      </p>

      {/* Conceptual Soundness Assessment Table */}
      <div className="mb-8">
        <h3 className="mb-4 font-medium">Conceptual Soundness Assessment</h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Section</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="w-32">Validator Response (Y/N/NA)</TableHead>
                <TableHead>Comments / Evidence / References</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Section 1: Model Purpose & Scope */}
              <TableRow>
                <TableCell className="font-medium">1. Model Purpose & Scope</TableCell>
                <TableCell>1.1 Is the model being used for its intended business purpose and within approved scope?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>1.2 Has the model's scope (products, portfolios, geographies) remained unchanged since last validation?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>

              {/* Section 2: Methodology & Design */}
              <TableRow>
                <TableCell className="font-medium">2. Methodology & Design</TableCell>
                <TableCell>2.1 Is the selected modeling methodology appropriate for the model's objective and data characteristics?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>2.2 Are the modeling techniques consistent with accepted theoretical or regulatory standards?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>2.3 Is there adequate justification for the chosen methodology versus alternatives?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>

              {/* Section 3: Theoretical Soundness */}
              <TableRow>
                <TableCell className="font-medium">3. Theoretical Soundness</TableCell>
                <TableCell>3.1 Do the model relationships align with expected financial and risk theory?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>3.2 Are transformations, link functions, and interactions conceptually sound?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>

              {/* Section 4: Assumptions */}
              <TableRow>
                <TableCell className="font-medium">4. Assumptions</TableCell>
                <TableCell>4.1 Are key model assumptions clearly stated and justified?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>4.2 Have critical assumptions been tested or validated empirically?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>

              {/* Section 5: Risk Drivers & Factors */}
              <TableRow>
                <TableCell className="font-medium">5. Risk Drivers & Factors</TableCell>
                <TableCell>5.1 Are key risk drivers still relevant to current market and portfolio conditions?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>5.2 Have any important emerging risk drivers been excluded?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>

              {/* Section 6: Data Concept */}
              <TableRow>
                <TableCell className="font-medium">6. Data Concept</TableCell>
                <TableCell>6.1 Are input data sources consistent with the model's conceptual design?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>6.2 Is data transformation logic (aggregation, proxying, mapping) theoretically justified?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>

              {/* Section 7: Policy & Regulatory Alignment */}
              <TableRow>
                <TableCell className="font-medium">7. Policy & Regulatory Alignment</TableCell>
                <TableCell>7.1 Does the model align with current internal MRM policies and governance frameworks?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>7.2 Does the model meet applicable regulatory expectations (RBI, Basel, IFRS 9, etc.)?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>

              {/* Section 8: Conceptual Limitations */}
              <TableRow>
                <TableCell className="font-medium">8. Conceptual Limitations</TableCell>
                <TableCell>8.1 Have conceptual limitations been identified and documented by the model owner?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>8.2 Are mitigation actions or compensating controls in place for known limitations?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>

              {/* Section 9: Change Log Review */}
              <TableRow>
                <TableCell className="font-medium">9. Change Log Review</TableCell>
                <TableCell>9.1 Has an automated change log been maintained since last validation?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>9.2 Are parameter, data, and code changes fully documented and traceable?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>

              {/* Section 10: Impact of Changes */}
              <TableRow>
                <TableCell className="font-medium">10. Impact of Changes</TableCell>
                <TableCell>10.1 Do recent changes materially alter the conceptual structure of the model?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>10.2 Have material changes triggered redevelopment or revalidation requirements?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>

              {/* Section 11: Governance & Documentation */}
              <TableRow>
                <TableCell className="font-medium">11. Governance & Documentation</TableCell>
                <TableCell>11.1 Is current documentation sufficient to understand the model's conceptual framework?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>11.2 Are ownership, version control, and approval records up to date?</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Add comments, evidence, or references..."
                    rows={2}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>


{/* Change Log Table */}
<div className="mb-8">
  <div className="flex justify-between items-center mb-4">
    <h3>Automated Change Log (Since Last Validation)</h3>
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Change</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Change Log</DialogTitle>
          <DialogDescription>Manually add a new change to the log.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={newChangeLog.type} onChange={(e) => setNewChangeLog({ ...newChangeLog, type: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={newChangeLog.description} onChange={(e) => setNewChangeLog({ ...newChangeLog, description: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={newChangeLog.date} onChange={(e) => setNewChangeLog({ ...newChangeLog, date: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={newChangeLog.status} onValueChange={(value) => setNewChangeLog({ ...newChangeLog, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Tested">Tested</SelectItem>
                <SelectItem value="Documented">Documented</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddChangeLog}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
  <div className="border rounded-lg">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Validator Comment</TableHead>
          <TableHead>Remarks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {changeLogs.map((log, index) => (
          <TableRow key={index}>
            <TableCell>{log.type}</TableCell>
            <TableCell>{log.description}</TableCell>
            <TableCell>{log.date}</TableCell>
            <TableCell>{log.status}</TableCell>
            <TableCell>
              <Select
                value={changeLogData[index].comment}
                onValueChange={(value) => {
                  const newData = [...changeLogData];
                  newData[index].comment = value;
                  setChangeLogData(newData);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acceptable">Acceptable</SelectItem>
                  <SelectItem value="Not Acceptable">Not Acceptable</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Input
                value={changeLogData[index].remarks}
                onChange={(e) => {
                  const newData = [...changeLogData];
                  newData[index].remarks = e.target.value;
                  setChangeLogData(newData);
                }}
                placeholder="Remarks..."
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</div>



{/* Validator Notes */}
<div className="mb-6">
  <Label htmlFor="validator-notes">Validator Notes (Audit Logged in MMG)</Label>
  <Textarea
    id="validator-notes"
    placeholder="Document notes directly in MMG..."
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

        <div className="flex justify-end gap-3 mt-6">
          <Button
           style={{
      backgroundColor: "red", // blue-500
      color: "white",
      fontSize: "14px",
      fontWeight: 500,
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    }}
            onClick={() => {
              // Cancel functionality - could reset state or go back
              if (onCancel) onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
           style={{
      backgroundColor: "#3b82f6", // blue-500
      color: "white",
      fontSize: "14px",
      fontWeight: 500,
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    }}
            onClick={() => {
              // Save functionality - save current progress
              if (onSave) onSave();
            }}
          >
            Save
          </Button>
          <Button
           style={{
      backgroundColor: "green", // blue-500
      color: "white",
      fontSize: "14px",
      fontWeight: 500,
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    }}
            onClick={() => {
              // Save and continue to next step
              if (onSaveAndContinue) onSaveAndContinue();
            }}
          >
            Save and Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}
