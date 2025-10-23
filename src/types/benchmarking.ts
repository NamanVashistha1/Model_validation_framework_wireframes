export type MetricKey = 'gini' | 'ks' | 'auc' | 'f1' | 'precision' | 'recall';

export type ComparableModel = {
  id: string;
  name: string;
  source: 'baseline' | 'peer' | 'automl' | 'clone';
  metrics: Record<MetricKey, number>;
  meta?: Record<string, any>;
};

export type BenchmarkConfig = {
  peer: boolean;
  automl: boolean;
  clone: boolean;
};

export type PeerResult = {
  peers: ComparableModel[];
  peerAverage: Record<MetricKey, number>;
};

export type AutomlResult = {
  testedAlgos: string[];
  rows: ComparableModel[]; // one row per algorithm tested
  best: ComparableModel; // best row per selected metric
  metricKey: MetricKey;
  period: string;
  observations: number;
  estimatedRuntime: string;
};

export type CloneResult = {
  variants: ComparableModel[]; // one or more variants based on techniques
  best: ComparableModel; // best variant by default metric (e.g., auc)
  techniques: string[]; // selected techniques
};

export type BenchmarkResult = {
  baseline: ComparableModel;
  peer?: PeerResult;
  automl?: AutomlResult;
  clone?: CloneResult;
};

/**
 * Utility mapping from UI labels to metric keys
 */
export function labelToMetricKey(label: string): MetricKey {
  switch (label) {
    case 'Gini Coefficient':
      return 'gini';
    case 'KS Statistic':
      return 'ks';
    case 'AUC':
      return 'auc';
    case 'F1 Score':
      return 'f1';
    case 'Precision':
      return 'precision';
    case 'Recall':
      return 'recall';
    default:
      return 'auc';
  }
}
