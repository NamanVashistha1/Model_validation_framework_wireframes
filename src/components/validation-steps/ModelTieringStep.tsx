import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Layers } from 'lucide-react';

interface ModelTieringStepProps {
  model: any;
  onComplete: () => void;
  onAddFinding: (finding: Omit<any, 'id'>) => void;
  onSave?: () => void;
  onSaveAndContinue?: () => void;
  onCancel?: () => void;
}

export function ModelTieringStep({
  model,
  onComplete,
  onAddFinding,
  onSave,
  onSaveAndContinue,
  onCancel,
}: ModelTieringStepProps) {
  // State to store editable scores
  const [editableScores, setEditableScores] = useState({
    businessImpact: 1,
    materialityOfUsage: 3,
    complexity: 3,
    regulatoryScope: 2,
    validationFindings: 1,
    operationalRisk: 2,
  });

  // Initial values for scores and override
  const [currentScore, setCurrentScore] = useState(1.95);
  const [previousScore, setPreviousScore] = useState(2.5);
  const [finalRating, setFinalRating] = useState('Tier 2');
  const [overrideTier, setOverrideTier] = useState('Tier 3');
  const [comments, setComments] = useState('Reg Use');

  // Function to calculate Final Rating based on override
  const calculateFinalRating = () => {
    if (overrideTier === 'Tier 3') {
      setFinalRating('Tier 3');
    } else if (overrideTier === 'Tier 2') {
      setFinalRating('Tier 2');
    } else if (overrideTier === 'Tier 1') {
      setFinalRating('Tier 1');
    } else if (currentScore >= 2.5) {
      setFinalRating('Tier 2');
    } else {
      setFinalRating('Tier 1');
    }
  };


  const handleScoreChange = (param: string, value: number) => {
    setEditableScores((prevScores) => ({
      ...prevScores,
      [param]: value,
    }));
  };

  // Function to calculate total score based on editable scores
  const calculateTotalScore = () => {
    const scores = Object.values(editableScores);
    const total = scores.reduce((sum, score) => sum + score, 0);
    const average = total / scores.length;
    return average.toFixed(2);
  };

  // Function to refresh score based on tiering criteria changes
  const handleRefreshScore = () => {
    const newScore = parseFloat(calculateTotalScore());
    setCurrentScore(newScore);

    // Update final rating based on new score (if no override)
    if (overrideTier === 'Tier 3') {
      // Keep override if set
    } else {
      const calculatedTier = newScore >= 2.5 ? 'Tier 2' : 'Tier 1';
      setFinalRating(calculatedTier);
    }
  };

  // Function to submit and update final rating table
  const handleSubmitOverride = () => {
    setFinalRating(overrideTier);
    // This function updates the final rating table with current override values
    // The final rating table already shows the current finalRating state
    // So this is more of a confirmation that the override has been applied
    console.log('Override submitted:', { overrideTier, finalRating, comments });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5" />
          <h2>Model Tiering Review</h2>
        </div>

        <div className="space-y-4">
          {/* First Table: Non-editable */}
          <div>
            <h3 className="text-lg font-medium mb-2">Model Information</h3>
            <table className="table-auto w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Model Name</th>
                  <th className="border px-4 py-2">Credit Scoring</th>
                </tr>
                <tr>
                  <th className="border px-4 py-2">Model Group</th>
                  <th className="border px-4 py-2">SME</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Second Table: Editable Scores */}
          <div>
            <h3 className="text-lg font-medium mb-2">Tiering Criteria Assessment</h3>
            <table className="table-auto w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Parameter</th>
                  <th className="border px-4 py-2">Score</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Low (1)</th>
                  <th className="border px-4 py-2">Medium (2)</th>
                  <th className="border px-4 py-2">High (3)</th>
                </tr>
              </thead>
              <tbody>
                {/* Business Impact */}
                <tr>
                  <td className="border px-4 py-2">Business Impact / Criticality</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={editableScores.businessImpact}
                      onChange={(e) =>
                        handleScoreChange('businessImpact', parseInt(e.target.value))
                      }
                      min="1"
                      max="3"
                      className="border px-2 py-1 w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">Impact on capital, financials, customer decisions</td>
                  <td className="border px-4 py-2">Minimal regulatory/financial impact</td>
                  <td className="border px-4 py-2">Indirect financial impact</td>
                  <td className="border px-4 py-2">Direct impact on capital, financials</td>
                </tr>

                {/* Materiality of Usage */}
                <tr>
                  <td className="border px-4 py-2">Materiality of Usage</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={editableScores.materialityOfUsage}
                      onChange={(e) =>
                        handleScoreChange('materialityOfUsage', parseInt(e.target.value))
                      }
                      min="1"
                      max="3"
                      className="border px-2 py-1 w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">Volume/frequency of use, monetary exposure</td>
                  <td className="border px-4 py-2">Ad-hoc / limited usage</td>
                  <td className="border px-4 py-2">Periodic usage</td>
                  <td className="border px-4 py-2">High frequency & monetary exposure</td>
                </tr>

                {/* Complexity */}
                <tr>
                  <td className="border px-4 py-2">Complexity</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={editableScores.complexity}
                      onChange={(e) =>
                        handleScoreChange('complexity', parseInt(e.target.value))
                      }
                      min="1"
                      max="3"
                      className="border px-2 py-1 w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">Methodology sophistication & explainability</td>
                  <td className="border px-4 py-2">Basic regression, rules-based</td>
                  <td className="border px-4 py-2">GLMs with transformations</td>
                  <td className="border px-4 py-2">Advanced ML/AI, low explainability</td>
                </tr>

                {/* Regulatory Scope */}
                <tr>
                  <td className="border px-4 py-2">Regulatory Scope</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={editableScores.regulatoryScope}
                      onChange={(e) =>
                        handleScoreChange('regulatoryScope', parseInt(e.target.value))
                      }
                      min="1"
                      max="3"
                      className="border px-2 py-1 w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">Regulatory in-scope vs out of scope</td>
                  <td className="border px-4 py-2">Not in regulatory scope</td>
                  <td className="border px-4 py-2">Indirect/internal policy scope</td>
                  <td className="border px-4 py-2">Explicitly in-scope</td>
                </tr>

                {/* Validation Findings */}
                <tr>
                  <td className="border px-4 py-2">Validation Findings</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={editableScores.validationFindings}
                      onChange={(e) =>
                        handleScoreChange('validationFindings', parseInt(e.target.value))
                      }
                      min="1"
                      max="3"
                      className="border px-2 py-1 w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">Outstanding validation issues & track record</td>
                  <td className="border px-4 py-2">Clean track record</td>
                  <td className="border px-4 py-2">Few, well-documented issues</td>
                  <td className="border px-4 py-2">Multiple outstanding findings</td>
                </tr>

                {/* Operational Risk */}
                <tr>
                  <td className="border px-4 py-2">Operational Risk</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={editableScores.operationalRisk}
                      onChange={(e) =>
                        handleScoreChange('operationalRisk', parseInt(e.target.value))
                      }
                      min="1"
                      max="3"
                      className="border px-2 py-1 w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">Upstream/downstream dependencies & operational exposure</td>
                  <td className="border px-4 py-2">Standalone, low operational impact</td>
                  <td className="border px-4 py-2">Some dependencies, manageable risk</td>
                  <td className="border px-4 py-2">Heavy dependencies, sensitive to data/system failures</td>
                </tr>
              </tbody>
            </table>

            {/* Refresh Score Button */}
             <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <Button  onClick={handleRefreshScore} variant="outline" style={{ padding: "8px 16px", backgroundColor:"black", color:"#fff" }}>
                  Refresh Score
                </Button>
              </div>
            <div className="mt-4 flex flex-col gap-2">
              {/* <Button  variant="outline" style={{ padding: "8px 16px", backgroundColor:"black", color:"#fff" }}>
                  Add Drift +
                </Button>
              <Button
                onClick={handleRefreshScore}
               
              >
                Refresh Score
              </Button> */}
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> On the basis of changes in the above table, clicking this button will update the score based on calculation in the lower table.
              </p>
            </div>
          </div>
        </div>
  {/* First Table: Non-editable */}
        <div>
          <h3 className="text-lg font-medium mb-2">Model Scoring</h3>
          <table className="table-auto w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Parameter</th>
                <th className="border px-4 py-2">Current Score</th>
                <th className="border px-4 py-2">Previous Score</th>
                
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Total Score</td>
                <td className="border px-4 py-2">{currentScore}</td>
                <td className="border px-4 py-2">{previousScore}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Tier</td>
                <td className="border px-4 py-2">{finalRating}</td>
                <td className="border px-4 py-2">Tier 2 </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Override</td>
<td className="border px-4 py-2">
                  <select
                    className="w-full border px-2 py-1"
                    value={overrideTier}
                    onChange={(e) => {
                      setOverrideTier(e.target.value);
                      calculateFinalRating();
                    }}
                  >
                    <option value="Tier 1">Tier 1</option>
                    <option value="Tier 2">Tier 2</option>
                    <option value="Tier 3">Tier 3</option>
                  </select>
                </td>
<td className="border px-4 py-2 bg-gray-100 text-gray-600">
                  tier 2
                </td>

              </tr>
               <tr>
                <td className="border px-4 py-2">Comments/Reasons</td>
                 <td className="border px-4 py-2">
                  <input
                    type="text"
                    className="w-full border px-2 py-1"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </td>
                <td className="border px-4 py-2 bg-gray-100 text-gray-600">
                  {comments}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Submit Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <Button  onClick={handleSubmitOverride} variant="outline" style={{ padding: "8px 16px", backgroundColor:"black", color:"#fff" }}>
                  Submit
                </Button>
              </div>
          {/* <div className="mt-4">
            <Button
              onClick={handleSubmitOverride}
              className="bg-purple-500 hover:bg-purple-600 text-white w-fit"
            >
              Submit
            </Button>
          </div> */}
        </div>

        {/* Second Table: Editable Override and Comments */}
        <div>
          <h3 className="text-lg font-medium mb-2">Final Rating</h3>
          <table className="table-auto w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2"></th>
                <th className="border px-4 py-2">Current Score</th>
                <th className="border px-4 py-2">Previous Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                 <td className="border px-4 py-2">Tier</td>
                <td className="border px-4 py-2">{finalRating}</td>
                <td className="border px-4 py-2 bg-gray-100 text-gray-600">Tier 2</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Buttons */}
        {/* <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => { if (onCancel) onCancel(); }}>Cancel</Button>
          <Button onClick={() => { if (onSave) onSave(); }}>Save</Button>
          <Button onClick={() => { if (onSaveAndContinue) onSaveAndContinue(); }}>Save and Continue</Button>
        </div> */}
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

       {/*<div className="space-y-6">
      <Card className="p-6">
         <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5" />
          <h2>Model Tiering</h2>
        </div>

       

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => { if (onCancel) onCancel(); }}>Cancel</Button>
          <Button onClick={() => { if (onSave) onSave(); }}>Save</Button>
          <Button onClick={() => { if (onSaveAndContinue) onSaveAndContinue(); }}>Save and Continue</Button>
        </div>
      </Card>
    </div> */}
    </div>
  );
}
