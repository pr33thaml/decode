"use client";

import {
  AlertTriangle,
  BookOpen,
  Box,
  GitBranch,
  Layers,
  Lightbulb,
} from "lucide-react";
import type { AnalysisResult, CodeBlock } from "@/types/analysis";

const BLOCK_ICONS: Record<CodeBlock["type"], typeof Box> = {
  function: Box,
  class: Layers,
  method: Box,
  variable: Lightbulb,
  import: BookOpen,
  loop: GitBranch,
  conditional: GitBranch,
};

const COMPLEXITY_COLORS = {
  beginner: "text-accent bg-accent/10 border-accent/30",
  intermediate: "text-amber bg-amber/10 border-amber/30",
  advanced: "text-rose bg-rose/10 border-rose/30",
};

interface AnalysisPanelProps {
  result: AnalysisResult | null;
  onLineClick: (line: number) => void;
}

export function AnalysisPanel({ result, onLineClick }: AnalysisPanelProps) {
  if (!result || result.blocks.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
        <Layers className="mb-3 h-10 w-10 text-muted" />
        <p className="text-sm text-muted">
          Paste code and hit <span className="text-foreground">Analyze</span> to see
          structure, explanations, and a quiz.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${COMPLEXITY_COLORS[result.complexity]}`}
          >
            {result.complexity}
          </span>
          <span className="text-xs text-muted">
            {result.stats.lines} lines · {result.stats.functions} fn · {result.stats.classes}{" "}
            classes
          </span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">{result.summary}</p>
      </section>

      {result.warnings.length > 0 && (
        <section className="space-y-2">
          {result.warnings.map((w, i) => (
            <div
              key={i}
              className="flex gap-2 rounded-lg border border-amber/30 bg-amber/5 px-3 py-2 text-sm text-amber"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {w}
            </div>
          ))}
        </section>
      )}

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Code structure
        </h3>
        <div className="space-y-2">
          {result.blocks.map((block, i) => {
            const Icon = BLOCK_ICONS[block.type];
            return (
              <button
                key={`${block.name}-${i}`}
                type="button"
                onClick={() => onLineClick(block.startLine)}
                className="w-full rounded-xl border border-border bg-surface p-3 text-left transition-colors hover:border-accent/40 hover:bg-surface-2"
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-accent" />
                  <span className="font-mono text-sm font-medium">{block.name}</span>
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase text-muted">
                    {block.type}
                  </span>
                  <span className="ml-auto font-mono text-xs text-muted">L{block.startLine}</span>
                </div>
                {block.signature && (
                  <p className="mb-1 font-mono text-xs text-muted">{block.signature}</p>
                )}
                <p className="text-sm leading-relaxed text-foreground/80">{block.explanation}</p>
                {block.gotchas && (
                  <ul className="mt-2 space-y-1">
                    {block.gotchas.map((g, j) => (
                      <li key={j} className="text-xs text-amber">
                        → {g}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {result.flow.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Execution flow
          </h3>
          <ol className="relative space-y-0 border-l border-border pl-4">
            {result.flow.slice(0, 12).map((step) => (
              <li key={step.order} className="relative pb-3">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background" />
                <button
                  type="button"
                  onClick={() => onLineClick(step.line)}
                  className="text-left text-sm hover:text-accent"
                >
                  <span className="font-mono text-xs text-muted">L{step.line}</span>{" "}
                  {step.description}
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}

      {result.concepts.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Concepts to learn
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {result.concepts.map((c) => (
              <a
                key={c.name}
                href={c.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-border bg-surface p-3 transition-colors hover:border-accent/40"
              >
                <p className="mb-1 text-sm font-medium capitalize">{c.name}</p>
                <p className="text-xs leading-relaxed text-muted">{c.description}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
