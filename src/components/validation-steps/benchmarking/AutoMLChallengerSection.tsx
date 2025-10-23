import { Card } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import type { AutomlResult, ComparableModel, MetricKey } from '../../../types/benchmarking';
import { displayValue, metricOrderForDisplay, metricHeader } from './benchmarkingUtils';

interface AutoMLChallengerSectionProps {
  id?: string; // defaults to "automl-section"
  baseline: ComparableModel;
  automl: AutomlResult;
}

export function AutoMLChallengerSection({ id = 'automl-section', baseline, automl }: AutoMLChallengerSectionProps) {
  const metrics: MetricKey[] = metricOrderForDisplay();

  const isBest = (row: ComparableModel) => row.id === automl.best.id;

  return (
    <div id={id} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">🤖 AutoML Challenger Generation</h3>
        <p className="text-sm text-muted-foreground">Automatically test alternative algorithms</p>
      </div>

      {/* Configuration Summary */}
      <Card className="p-4 space-y-1">
        <div className="text-sm">
          <span className="font-medium">Data Source:</span> {automl.period}, {automl.observations.toLocaleString()} observations
        </div>
        <div className="text-sm">
          <span className="font-medium">Algorithms to Test:</span> {automl.testedAlgos.join(', ') || '—'}
        </div>
        <div className="text-sm">
          <span className="font-medium">Optimization Metric:</span> {metricHeader(automl.metricKey)}
        </div>
        <div className="text-sm">
          <span className="font-medium">Estimated Runtime:</span> {automl.estimatedRuntime}
        </div>
      </Card>

      {/* Results Table */}
      <Card className="p-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Metric</TableHead>
                <TableHead>Your Model (Baseline)</TableHead>
                {automl.testedAlgos.map((algo) => (
                  <TableHead key={algo}>
                    <div className="flex items-center gap-2">
                      <span>{algo}</span>
                      {automl.best.name === algo && (
                        <span className="inline-block rounded-full bg-green-600 text-white text-xs px-2 py-0.5">
                          Best
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((m) => (
                <TableRow key={m}>
                  <TableCell className="font-medium">{metricHeader(m)}</TableCell>
                  <TableCell>{displayValue(baseline.metrics[m], m)}</TableCell>
                  {automl.testedAlgos.map((algo) => {
                    const row = automl.rows.find((r) => r.name === algo);
                    return (
                      <TableCell key={`${algo}-${m}`}>
                        {displayValue(row?.metrics[m] ?? 0, m)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-4">
        <h4 className="font-medium mb-2">Recommendations</h4>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          {automl.testedAlgos.length === 0 ? (
            <li>No algorithms selected. Please configure and re-run.</li>
          ) : (
            <>
              <li>
                {automl.best.name} shows strongest {metricHeader(automl.metricKey)} vs baseline. Consider promoting or further validation.
              </li>
              <li>
                Validate improvements on out-of-time datasets and confirm stability across population segments.
              </li>
            </>
          )}
        </ul>
      </Card>
    </div>
  );
}
