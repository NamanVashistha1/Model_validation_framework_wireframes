import { Card } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import type { CloneResult, ComparableModel, MetricKey } from '../../../types/benchmarking';
import { displayValue, metricOrderForDisplay, metricHeader } from './benchmarkingUtils';

interface CloneCurrentModelSectionProps {
  id?: string; // defaults to "clone-section"
  baseline: ComparableModel;
  clone: CloneResult;
}

export function CloneCurrentModelSection({ id = 'clone-section', baseline, clone }: CloneCurrentModelSectionProps) {
  const metrics: MetricKey[] = metricOrderForDisplay();

  const isBest = (row: ComparableModel) => row.id === clone.best.id;

  return (
    <div id={id} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">🔄 Clone Current Model</h3>
        <p className="text-sm text-muted-foreground">Model replication with parameter variations</p>
      </div>

      {/* Parameter Variations Tested */}
      <Card className="p-4">
        <h4 className="font-medium mb-2">Parameter Variations Tested</h4>
        {clone.techniques.length === 0 ? (
          <p className="text-sm text-muted-foreground">No techniques selected.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-64">Technique</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clone.techniques.map((t, idx) => (
                  <TableRow key={`${t}-${idx}`}>
                    <TableCell className="font-medium">{t}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {renderTechniqueDetails(t)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Performance Comparison */}
      <Card className="p-4">
        <h4 className="font-medium mb-2">Performance Comparison</h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-64">Variant</TableHead>
                {metrics.map((m) => (
                  <TableHead key={m}>{metricHeader(m)}</TableHead>
                ))}
                <TableHead>Best</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Baseline */}
              <TableRow>
                <TableCell className="font-medium">Your Model (Baseline)</TableCell>
                {metrics.map((m) => (
                  <TableCell key={`base-${m}`}>{displayValue(baseline.metrics[m], m)}</TableCell>
                ))}
                <TableCell>—</TableCell>
              </TableRow>

              {/* Variants */}
              {clone.variants.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  {metrics.map((m) => (
                    <TableCell key={`${row.id}-${m}`}>{displayValue(row.metrics[m], m)}</TableCell>
                  ))}
                  <TableCell>
                    {isBest(row) ? (
                      <span className="inline-block rounded-full bg-green-600 text-white text-xs px-2 py-0.5">
                        Best (AUC)
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Key Findings */}
      <Card className="p-4">
        <h4 className="font-medium mb-2">Key Findings</h4>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          {clone.techniques.length === 0 ? (
            <li>No techniques were selected. Please configure and re-run.</li>
          ) : (
            <>
              <li>
                Best variant: <strong>{clone.best.name}</strong> with AUC {displayValue(clone.best.metrics.auc, 'auc')}.
              </li>
              <li>
                Techniques tested: {clone.techniques.join(', ')}.
              </li>
              <li>
                Review tradeoffs across Precision/Recall and validate stability on out-of-time splits.
              </li>
            </>
          )}
        </ul>
      </Card>
    </div>
  );
}

function renderTechniqueDetails(tech: string) {
  if (/Regularization/i.test(tech)) return 'L1/L2 penalty grid: {0.0, 0.01, 0.1, 1.0}';
  if (/Feature Subset/i.test(tech)) return 'Subset sizes tested: 60%, 75%, 90% of features';
  if (/Threshold Optimization/i.test(tech)) return 'Threshold sweep: 0.2 → 0.8 (step 0.05)';
  if (/Class Weight/i.test(tech)) return 'Balanced class weights and tuned ratios';
  if (/Hyperparameter Grid/i.test(tech)) return 'Grid search on depth/trees/learning rate';
  if (/Cross-Validation/i.test(tech)) return 'CV folds: 3, 5, 10 with stratification';
  return 'Configured variant.';
}
