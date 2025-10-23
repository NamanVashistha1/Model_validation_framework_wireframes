import { Card } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import type { ComparableModel, PeerResult, MetricKey } from '../../../types/benchmarking';
import { displayValue, metricOrderForDisplay, metricHeader } from './benchmarkingUtils';

interface PeerComparisonSectionProps {
  id?: string; // defaults to "peer-section"
  baseline: ComparableModel;
  peer: PeerResult;
}

export function PeerComparisonSection({ id = 'peer-section', baseline, peer }: PeerComparisonSectionProps) {
  const metrics: MetricKey[] = metricOrderForDisplay();
  const columns = [
    { key: 'baseline', label: 'Your Model' },
    ...peer.peers.map((p, i) => ({ key: `peer-${i}`, label: p.name })),
    { key: 'peer-avg', label: 'Peer Average' },
  ];

  return (
    <div id={id} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">🏢 Peer Model Comparison</h3>
        <p className="text-sm text-muted-foreground">Analysis Period: Jan 2024 - Dec 2024</p>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Metric</TableHead>
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((m) => (
                <TableRow key={m}>
                  <TableCell className="font-medium">{metricHeader(m)}</TableCell>

                  {/* Your Model */}
                  <TableCell>{displayValue(baseline.metrics[m], m)}</TableCell>

                  {/* Selected Peers */}
                  {peer.peers.map((p) => (
                    <TableCell key={p.id}>{displayValue(p.metrics[m], m)}</TableCell>
                  ))}

                  {/* Peer Average */}
                  <TableCell>{displayValue(peer.peerAverage[m], m)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="font-medium mb-2">Key Findings</h4>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          <li>
            AUC vs Peer Avg: {deltaPct(baseline.metrics.auc, peer.peerAverage.auc)} (Your: {displayValue(baseline.metrics.auc, 'auc')}, Peer Avg: {displayValue(peer.peerAverage.auc, 'auc')})
          </li>
          <li>
            Gini vs Peer Avg: {deltaPct(baseline.metrics.gini, peer.peerAverage.gini)} (Your: {displayValue(baseline.metrics.gini, 'gini')}, Peer Avg: {displayValue(peer.peerAverage.gini, 'gini')})
          </li>
          {peer.peers.length > 0 && (
            <li>
              Best Peer by AUC: {bestPeerBy('auc', peer)?.name} ({displayValue(bestPeerBy('auc', peer)?.metrics.auc ?? 0, 'auc')})
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}

function bestPeerBy(metric: MetricKey, peer: PeerResult) {
  if (!peer.peers.length) return undefined;
  return [...peer.peers].sort((a, b) => (b.metrics[metric] - a.metrics[metric]))[0];
}

function deltaPct(yourVal: number, peerAvg: number) {
  const d = yourVal - peerAvg;
  const sign = d > 0 ? '+' : '';
  return `${sign}${(d * 100).toFixed(1)}%`;
}
