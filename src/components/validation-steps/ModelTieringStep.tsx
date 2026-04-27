import { useMemo, useState } from "react";
import { Layers, Info } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

type TierLevel = 1 | 2 | 3;
type TierName = "Tier 1" | "Tier 2" | "Tier 3";

interface TieringScores {
  businessImpact: TierLevel;
  materiality: TierLevel;
  complexity: TierLevel;
  regulatory: TierLevel;
  validation: TierLevel;
  operational: TierLevel;
}

interface ModelTieringData {
  previousScores?: Partial<TieringScores>;
  lastValidationTier?: TierName;
}

interface ModelTieringStepProps {
  model: { tiering?: ModelTieringData };
  onComplete: () => void;
  onAddFinding: (finding: Omit<any, "id">) => void;
  onSave?: () => void;
  onSaveAndContinue?: () => void;
  onCancel?: () => void;
}

interface CriteriaCardProps {
  title: string;
  description: string;
  value: TierLevel;
  previousScore: TierLevel;
  previousLabel: string;
  info: string[];
  onChange: (value: TierLevel) => void;
}

const SCORE_LABELS: Record<TierLevel, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
};

const DEFAULT_SCORES: TieringScores = {
  businessImpact: 1,
  materiality: 3,
  complexity: 3,
  regulatory: 2,
  validation: 2,
  operational: 2,
};

const MANUAL_TIER_PLACEHOLDER = "computed";
const MANUAL_TIER_OPTIONS: TierName[] = ["Tier 1", "Tier 2", "Tier 3"];

const computeTierFromScore = (score: number): TierName => {
  if (score >= 2.5) return "Tier 3";
  if (score >= 1.75) return "Tier 2";
  return "Tier 1";
};

const formatScoreLabel = (score?: number | null): string =>
  score === undefined || score === null ? "--" : score.toFixed(2);

const CriteriaCard = ({
  title,
  description,
  value,
  previousScore,
  previousLabel,
  info,
  onChange,
}: CriteriaCardProps) => (
  <Card className="border border-border/60 shadow-sm">
    <CardContent className="space-y-4 py-6">
      {/* <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <HoverCard openDelay={150} closeDelay={150}>
            <HoverCardTrigger asChild>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-md border border-transparent bg-muted text-muted-foreground transition hover:border-border hover:text-foreground"
                aria-label={`More information about ${title}`}
              >
                <Info className="size-4" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent side="top" className="w-80 space-y-2 text-sm">
              <p className="font-medium text-foreground">Assessment guidance</p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {info.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 lg:w-auto">
          <div className="flex w-full max-w-[12rem] flex-col gap-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Last Tier
            </Label>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/70 bg-muted/40 px-3 py-2">
              <Badge variant="outline" className="border-border/80 text-foreground">
                {previousLabel}
              </Badge>
              <span className="text-xs text-muted-foreground">Score {previousScore}</span>
            </div>
          </div>

          <div className="flex w-full max-w-[12rem] flex-col gap-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Update Tier
            </Label>
            <Select
              value={String(value)}
              onValueChange={(val) => onChange(Number(val) as TierLevel)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Low (1)</SelectItem>
                <SelectItem value="2">Medium (2)</SelectItem>
                <SelectItem value="3">High (3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div> */}
      <div className="flex items-center justify-between gap-6">

  {/* LEFT: now expands */}
  <div className="flex items-center gap-3 flex-1 min-w-0">
    
    <div className="space-y-1 min-w-0">
      <CardTitle className="text-lg font-semibold truncate">
        {title}
      </CardTitle>
      <CardDescription className="truncate">
        {description}
      </CardDescription>
    </div>

    
  </div>

  {/* RIGHT: fixed width blocks */}
  <div className="flex items-center gap-6 shrink-0">
    
    {/* Last Tier */}
    <div className="flex flex-col gap-1">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        Last Tier
      </Label>
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/70 bg-muted/40 px-3 py-2">
        <Badge variant="outline">{previousLabel}</Badge>
        <span className="text-xs text-muted-foreground">
          Score {previousScore}
        </span>
      </div>
    </div>

    {/* Update Tier */}
    <div className="flex flex-col gap-1">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        New Tier
      </Label>
      <Select
        value={String(value)}
        onValueChange={(val) => onChange(Number(val) as TierLevel)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Low (1)</SelectItem>
          <SelectItem value="2">Medium (2)</SelectItem>
          <SelectItem value="3">High (3)</SelectItem>
        </SelectContent>
      </Select>
    </div>

  </div>
  <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="inline-flex size-8 shrink-0 items-top justify-center rounded-md border border-transparent bg-muted text-muted-foreground transition hover:border-border hover:text-foreground"
          aria-label={`More information about ${title}`}
        >
          <Info className="size-4" />
        </button>
      </HoverCardTrigger>

      <HoverCardContent side="top" className="w-80 space-y-2 text-sm">
        <p className="font-medium text-foreground">Assessment guidance</p>
        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
          {info.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </HoverCardContent>
    </HoverCard>
</div>
    </CardContent>
  </Card>
);

export function ModelTieringStep({
  model,
  onSave,
  onSaveAndContinue,
  onCancel,
}: ModelTieringStepProps) {
  const previousScores: TieringScores = {
    ...DEFAULT_SCORES,
    ...(model.tiering?.previousScores ?? {}),
  } as TieringScores;

  const [scores, setScores] = useState<TieringScores>(previousScores);
  const [manualTier, setManualTier] = useState<TierName | null>(null);

  const computedScore = useMemo(() => {
    const values = Object.values(scores);
    const average = values.reduce((acc, val) => acc + val, 0) / values.length;
    return Number(average.toFixed(2));
  }, [scores]);

  const computedTier = useMemo(() => computeTierFromScore(computedScore), [computedScore]);
  const displayedTier = manualTier ?? computedTier;

  const handleScoreChange = (key: keyof TieringScores, value: TierLevel) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      <Card className="border-none bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <CardContent className="flex flex-wrap items-center justify-between gap-6 py-6">
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-primary/15 p-2 text-primary">
              <Layers className="size-5" />
            </span>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Model Tiering Review</h2>
              <p className="text-sm text-muted-foreground">
                Evaluate the model against tiering criteria to determine oversight requirements.
              </p>
            </div>
          </div>
      
        </CardContent>
      </Card>

      <div className="space-y-4">
        <CriteriaCard
          title="Business Impact / Criticality"
          description="Impact on capital, financials, customer decisions"
          value={scores.businessImpact}
          previousScore={previousScores.businessImpact}
          previousLabel={SCORE_LABELS[previousScores.businessImpact]}
          info={[
            "Low = Minimal regulatory/financial impact",
            "Medium = Indirect financial impact",
            "High = Direct impact on capital/financials",
          ]}
          onChange={(value) => handleScoreChange("businessImpact", value)}
        />

        <CriteriaCard
          title="Materiality of Usage"
          description="Volume/frequency of use, monetary exposure"
          value={scores.materiality}
          previousScore={previousScores.materiality}
          previousLabel={SCORE_LABELS[previousScores.materiality]}
          info={[
            "Low = Ad-hoc / limited usage",
            "Medium = Periodic usage",
            "High = High frequency & exposure",
          ]}
          onChange={(value) => handleScoreChange("materiality", value)}
        />

        <CriteriaCard
          title="Complexity"
          description="Methodology sophistication & explainability"
          value={scores.complexity}
          previousScore={previousScores.complexity}
          previousLabel={SCORE_LABELS[previousScores.complexity]}
          info={[
            "Low = Rules-based / regression",
            "Medium = GLMs",
            "High = Advanced ML / low explainability",
          ]}
          onChange={(value) => handleScoreChange("complexity", value)}
        />

        <CriteriaCard
          title="Regulatory Scope"
          description="Regulatory in-scope vs out of scope"
          value={scores.regulatory}
          previousScore={previousScores.regulatory}
          previousLabel={SCORE_LABELS[previousScores.regulatory]}
          info={[
            "Low = Not in regulatory scope",
            "Medium = Internal policy scope",
            "High = Explicit regulatory scope",
          ]}
          onChange={(value) => handleScoreChange("regulatory", value)}
        />

        <CriteriaCard
          title="Validation Findings"
          description="Outstanding validation issues & track record"
          value={scores.validation}
          previousScore={previousScores.validation}
          previousLabel={SCORE_LABELS[previousScores.validation]}
          info={[
            "Low = Clean track record",
            "Medium = Few issues",
            "High = Multiple findings",
          ]}
          onChange={(value) => handleScoreChange("validation", value)}
        />

        <CriteriaCard
          title="Operational Risk"
          description="Dependencies & operational exposure"
          value={scores.operational}
          previousScore={previousScores.operational}
          previousLabel={SCORE_LABELS[previousScores.operational]}
          info={[
            "Low = Standalone",
            "Medium = Manageable dependencies",
            "High = High dependency / sensitive",
          ]}
          onChange={(value) => handleScoreChange("operational", value)}
        />
      </div>

      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="pb-4 space-y-2">
  
  {/* Top Row: Title + Button */}
  <div className="flex items-center justify-between">
    <CardTitle className="text-lg font-semibold">
      Tier Recommendation Summary
    </CardTitle>

    <Button onClick={() => setScores({ ...scores })}>
      Compute Tier
    </Button>
  </div>

  {/* Description Row */}
  <CardDescription>
    Review historical tiering, computed recommendation, and apply overrides if needed before saving.
  </CardDescription>

</CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border/80 bg-muted/40 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Last Validation Tier
              </p>
              <p className="mt-2 text-xl font-semibold">
                {model.tiering?.lastValidationTier ?? "Not available"}
              </p>
              <p className="text-xs text-muted-foreground">From previous validation cycle</p>
            </div>
            <div className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Computed Tier
              </p>
              <p className="mt-2 text-xl font-semibold text-primary">{computedTier}</p>
              <p className="text-xs text-primary/80">Based on current criteria selections</p>
            </div>
            <div className="rounded-lg border border-secondary/40 bg-secondary/10 px-4 py-3">
              <Label className="text-xs uppercase tracking-wide text-secondary-foreground">
                Tier Override (Optional)
              </Label>
              <Select
                value={manualTier ?? MANUAL_TIER_PLACEHOLDER}
                onValueChange={(val) =>
                  setManualTier(val === MANUAL_TIER_PLACEHOLDER ? null : (val as TierName))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Keep computed tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MANUAL_TIER_PLACEHOLDER}>Use computed tier</SelectItem>
                  {MANUAL_TIER_OPTIONS.map((tier) => (
                    <SelectItem key={tier} value={tier}>
                      {tier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-muted-foreground">
                Overrides final recommendation when populated.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Final Output
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="text-base">
                {displayedTier}
              </Badge>
              
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Document any overrides within findings if manual adjustments are made. Save to persist the selected recommendation.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:justify-end">
        <Button variant="destructive" onClick={onCancel} className="sm:min-w-36">
          Cancel
        </Button>
        <Button onClick={onSave} className="sm:min-w-36" variant="secondary">
          Save
        </Button>
        <Button onClick={onSaveAndContinue} className="sm:min-w-40">
          Save and Continue
        </Button>
      </div>
    </div>
  );
}