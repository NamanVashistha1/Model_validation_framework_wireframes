import type {
  ComparableModel,
  PeerResult,
  AutomlResult,
  CloneResult,
  MetricKey,
} from '../../../types/benchmarking';
import { labelToMetricKey } from '../../../types/benchmarking';
import type { Model } from '../../../types/model';

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h >>> 0;
}

// Mulberry32 RNG
function mulberry32(a: number) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Deterministic pseudo-random variation based on a seed and a tag
function vary(seed: string | number, tag: string, magnitude = 0.05) {
  const r = mulberry32(hashCode(String(seed) + '|' + tag))();
  // variation in range [-magnitude, +magnitude]
  return (r * 2 - 1) * magnitude;
}

function metricLabel(name: MetricKey): string {
  switch (name) {
    case 'gini': return 'Gini';
    case 'ks': return 'KS';
    case 'auc': return 'AUC';
    case 'f1': return 'F1';
    case 'precision': return 'Precision';
    case 'recall': return 'Recall';
  }
}

export function makeBaseline(model: Model): ComparableModel {
  // Baseline defaults (could be extended to map from real model metadata later)
  // Keep reasonable defaults for classification benchmarking.
  const seed = model.id || 'baseline';
  return {
    id: model.id,
    name: model.name,
    source: 'baseline',
    metrics: {
      gini: clamp01(0.48 + vary(seed, 'gini', 0.05)),
      ks: clamp01(0.38 + vary(seed, 'ks', 0.05)),
      auc: clamp01(0.86 + vary(seed, 'auc', 0.03)),
      f1: clamp01(0.79 + vary(seed, 'f1', 0.04)),
      precision: clamp01(0.81 + vary(seed, 'precision', 0.04)),
      recall: clamp01(0.77 + vary(seed, 'recall', 0.04)),
    },
    meta: {},
  };
}

export function makePeerResult(
  baseline: ComparableModel,
  selectedPeers: string[],
): PeerResult {
  const peers: ComparableModel[] = selectedPeers.map((name, idx) => {
    const tag = `${name}|${idx}`;
    return {
      id: `peer-${idx}`,
      name,
      source: 'peer',
      metrics: {
        gini: clamp01(baseline.metrics.gini + vary(tag, 'gini', 0.06)),
        ks: clamp01(baseline.metrics.ks + vary(tag, 'ks', 0.06)),
        auc: clamp01(baseline.metrics.auc + vary(tag, 'auc', 0.04)),
        f1: clamp01(baseline.metrics.f1 + vary(tag, 'f1', 0.05)),
        precision: clamp01(baseline.metrics.precision + vary(tag, 'precision', 0.05)),
        recall: clamp01(baseline.metrics.recall + vary(tag, 'recall', 0.05)),
      },
      meta: {},
    };
  });

  const peerAverage = computeAverage(peers.map(p => p.metrics));
  return { peers, peerAverage };
}

function computeAverage(rows: Record<MetricKey, number>[]): Record<MetricKey, number> {
  if (rows.length === 0) {
    return { gini: 0, ks: 0, auc: 0, f1: 0, precision: 0, recall: 0 };
  }
  const sum = rows.reduce((acc, m) => {
    acc.gini += m.gini;
    acc.ks += m.ks;
    acc.auc += m.auc;
    acc.f1 += m.f1;
    acc.precision += m.precision;
    acc.recall += m.recall;
    return acc;
  }, { gini: 0, ks: 0, auc: 0, f1: 0, precision: 0, recall: 0 });

  return {
    gini: sum.gini / rows.length,
    ks: sum.ks / rows.length,
    auc: sum.auc / rows.length,
    f1: sum.f1 / rows.length,
    precision: sum.precision / rows.length,
    recall: sum.recall / rows.length,
  };
}

function comparatorForMetric(metric: MetricKey) {
  // Higher is better for all supported metrics here
  return (a: ComparableModel, b: ComparableModel) => b.metrics[metric] - a.metrics[metric];
}

export function makeAutomlResult(
  baseline: ComparableModel,
  algorithmsChecked: Record<string, boolean>,
  metricLabelChosen: string,
  period: string,
  observations: number,
  estimatedRuntime: string,
): AutomlResult {
  const metricKey = labelToMetricKey(metricLabelChosen);
  const testedAlgos = Object.keys(algorithmsChecked).filter(a => algorithmsChecked[a]);

  const rows: ComparableModel[] = testedAlgos.map((algo, idx) => {
    const tag = `${algo}|${idx}`;
    // bias some algos to do a little better on selected metric
    const metricBoost = algoBoost(algo, metricKey);
    return {
      id: `automl-${idx}`,
      name: algo,
      source: 'automl',
      metrics: {
        gini: clamp01(baseline.metrics.gini + vary(tag, 'gini', 0.07) + (metricKey === 'gini' ? metricBoost : 0)),
        ks: clamp01(baseline.metrics.ks + vary(tag, 'ks', 0.07) + (metricKey === 'ks' ? metricBoost : 0)),
        auc: clamp01(baseline.metrics.auc + vary(tag, 'auc', 0.05) + (metricKey === 'auc' ? metricBoost : 0)),
        f1: clamp01(baseline.metrics.f1 + vary(tag, 'f1', 0.06) + (metricKey === 'f1' ? metricBoost : 0)),
        precision: clamp01(baseline.metrics.precision + vary(tag, 'precision', 0.06) + (metricKey === 'precision' ? metricBoost : 0)),
        recall: clamp01(baseline.metrics.recall + vary(tag, 'recall', 0.06) + (metricKey === 'recall' ? metricBoost : 0)),
      },
      meta: {},
    };
  });

  const best = [...rows].sort(comparatorForMetric(metricKey))[0] || rows[0];

  return {
    testedAlgos,
    rows,
    best: best || {
      id: 'none',
      name: '',
      source: 'automl',
      metrics: baseline.metrics,
    },
    metricKey,
    period,
    observations,
    estimatedRuntime,
  };
}

function algoBoost(algo: string, m: MetricKey): number {
  // Simple mapping: gradient boosted methods get a slight bump on auc/gini/ks
  if ((/xgboost/i.test(algo) || /lightgbm/i.test(algo) || /catboost/i.test(algo))) {
    if (m === 'auc' || m === 'gini' || m === 'ks') return 0.01;
  }
  if (/neural/i.test(algo)) {
    if (m === 'recall' || m === 'f1') return 0.01;
  }
  return 0.005; // small generic bump on chosen metric
}

export function makeCloneResult(
  baseline: ComparableModel,
  techniquesChecked: Record<string, boolean>,
): CloneResult {
  const techniques = Object.keys(techniquesChecked).filter(t => techniquesChecked[t]);

  // Create one variant per selected technique with plausible tradeoffs
  const variants: ComparableModel[] = techniques.map((tech, idx) => {
    const tag = `${tech}|${idx}`;
    const improveAuc = /regularization|feature subset|hyperparameter/i.test(tech);
    const improvePrecision = /threshold|class weight/i.test(tech);
    const improveRecall = /class weight|cross-validation/i.test(tech);

    const aucDelta = improveAuc ? 0.01 : -0.005;
    const precisionDelta = improvePrecision ? 0.012 : -0.004;
    const recallDelta = improveRecall ? 0.012 : -0.004;

    return {
      id: `clone-${idx}`,
      name: tech,
      source: 'clone',
      metrics: {
        gini: clamp01(baseline.metrics.gini + vary(tag, 'gini', 0.02) + (improveAuc ? 0.005 : 0)),
        ks: clamp01(baseline.metrics.ks + vary(tag, 'ks', 0.02) + (improveAuc ? 0.004 : 0)),
        auc: clamp01(baseline.metrics.auc + vary(tag, 'auc', 0.02) + aucDelta),
        f1: clamp01(baseline.metrics.f1 + vary(tag, 'f1', 0.02) + (improveRecall ? 0.006 : 0)),
        precision: clamp01(baseline.metrics.precision + vary(tag, 'precision', 0.02) + precisionDelta),
        recall: clamp01(baseline.metrics.recall + vary(tag, 'recall', 0.02) + recallDelta),
      },
      meta: { technique: tech },
    };
  });

  // Choose best by auc as a default
  const best = [...variants].sort((a, b) => b.metrics.auc - a.metrics.auc)[0] || variants[0];

  return { variants, best: best || {
    id: 'none', name: '', source: 'clone', metrics: baseline.metrics,
  }, techniques };
}

export function displayValue(metric: number, key: MetricKey): string {
  // Format numbers: show 2 decimals for ratios
  if (key === 'ks' || key === 'gini' || key === 'auc' || key === 'f1' || key === 'precision' || key === 'recall') {
    return metric.toFixed(2);
  }
  return String(metric);
}

export function deltaString(base: number, candidate: number): string {
  const d = candidate - base;
  const sign = d > 0 ? '+' : '';
  return `${sign}${(d * 100).toFixed(1)} pp`;
}

export function metricKeys(): MetricKey[] {
  return ['gini', 'ks', 'auc', 'f1', 'precision', 'recall'];
}

export function metricOrderForDisplay(): MetricKey[] {
  // Common order for classification metrics
  return ['auc', 'gini', 'ks', 'precision', 'recall', 'f1'];
}

export function metricHeader(key: MetricKey): string {
  return metricLabel(key);
}
