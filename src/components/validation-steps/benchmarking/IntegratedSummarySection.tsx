import { Card } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';

interface IntegratedSummarySectionProps {
  id?: string; // defaults to "summary-section"
  peerEnabled: boolean;
  automlEnabled: boolean;
  cloneEnabled: boolean;
}

export function IntegratedSummarySection({
  id = 'summary-section',
  peerEnabled,
  automlEnabled,
  cloneEnabled,
}: IntegratedSummarySectionProps) {
  const count = Number(peerEnabled) + Number(automlEnabled) + Number(cloneEnabled);

  const alertText =
    count === 0
      ? 'No benchmarking methods selected.'
      : count === 1
      ? 'Analyzed 1 benchmarking method. Review detailed results below.'
      : count === 2
      ? 'Analyzed 2 benchmarking methods. Cross-compare results below.'
      : 'Analyzed 3 benchmarking methods. Review cross-benchmark insights below.';

  return (
    <div id={id} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">📊 Integrated Benchmarking Summary</h3>
        <p className="text-sm text-muted-foreground">Complete analysis across all dimensions</p>
      </div>

      {/* Overall assessment alert */}
      <Card className="p-4">
        <div
          id="summary-alert-desc"
          className="text-sm"
        >
          {alertText}
        </div>
      </Card>

      {/* Cross-Benchmark Summary table */}
      <Card className="p-4">
        <h4 className="font-medium mb-2">Cross-Benchmark Summary</h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-60">Method</TableHead>
                <TableHead>Gap</TableHead>
                <TableHead>Assessment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {peerEnabled && (
                <TableRow id="peer-summary-row">
                  <TableCell>Peer Models</TableCell>
                  <TableCell>-6.8%</TableCell>
                  <TableCell>Below Average</TableCell>
                </TableRow>
              )}
              {automlEnabled && (
                <TableRow id="automl-summary-row">
                  <TableCell>AutoML Challenger</TableCell>
                  <TableCell>-8.8%</TableCell>
                  <TableCell>Significant Gap</TableCell>
                </TableRow>
              )}
              {cloneEnabled && (
                <TableRow id="clone-summary-row">
                  <TableCell>Clone Current Model</TableCell>
                  <TableCell>+1.5%</TableCell>
                  <TableCell>Minor Improvement</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Root Cause Analysis (simple, static guidance for MVP) */}
      <Card className="p-4">
        <h4 className="font-medium mb-2">Root Cause Analysis</h4>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          {peerEnabled && (
            <li>
              Peer gaps suggest potential data drift or feature disparity. Review feature distributions vs peers.
            </li>
          )}
          {automlEnabled && (
            <li>
              AutoML underperformance on chosen metric. Consider experimenting with alternative metrics or hyperparameters.
            </li>
          )}
          {cloneEnabled && (
            <li>
              Cloned variants improved marginally. Explore expanded parameter ranges or different regularization regimes.
            </li>
          )}
          {count === 0 && <li>No methods selected.</li>}
        </ul>
      </Card>
    </div>
  );
}
