"use client";

import { useCallback, useState } from "react";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { QuizPanel } from "@/components/QuizPanel";
import { analyzeCode } from "@/lib/analyzer";
import { SAMPLES } from "@/lib/samples";
import { getUsage, recordUsage } from "@/lib/usage";
import type { AnalysisResult, Language } from "@/types/analysis";

type Tab = "explain" | "quiz";

export default function AppPage() {
  const [code, setCode] = useState(SAMPLES.javascript.code);
  const [language, setLanguage] = useState<Language>("javascript");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [highlightLine, setHighlightLine] = useState<number | undefined>();
  const [tab, setTab] = useState<Tab>("explain");
  const [usage, setUsage] = useState(getUsage);
  const [limitHit, setLimitHit] = useState(false);

  const runAnalysis = useCallback(() => {
    if (!recordUsage()) {
      setLimitHit(true);
      return;
    }
    setLimitHit(false);
    setUsage(getUsage());
    const analysis = analyzeCode(code, language);
    setResult(analysis);
    setTab("explain");
  }, [code, language]);

  function loadSample(lang: Language) {
    setLanguage(lang);
    setCode(SAMPLES[lang].code);
    setResult(null);
    setLimitHit(false);
  }

  function handleLineClick(line: number) {
    setHighlightLine(line);
    setTimeout(() => setHighlightLine(undefined), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Code analyzer</h1>
          <p className="text-sm text-muted">
            Paste unfamiliar or AI-generated code. Learn what it actually does.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          {usage.isPro ? (
            <span className="rounded-full bg-accent/15 px-2.5 py-1 font-medium text-accent">
              Pro — unlimited
            </span>
          ) : (
            <span>
              {usage.remaining}/{usage.limit} free analyses today
            </span>
          )}
        </div>
      </div>

      {limitHit && (
        <div className="mb-4 rounded-xl border border-amber/30 bg-amber/5 px-4 py-3 text-sm text-amber">
          Daily free limit reached.{" "}
          <a href="/pricing" className="underline">
            Upgrade to Pro
          </a>{" "}
          for unlimited analyses and full quizzes.
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(["javascript", "typescript", "python"] as Language[]).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => loadSample(lang)}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize transition-colors ${
              language === lang
                ? "bg-accent/15 text-accent"
                : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            {lang}
          </button>
        ))}
        <span className="text-xs text-muted">· loads sample</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col gap-3">
          <div className="min-h-[360px] flex-1">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              highlightLine={highlightLine}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={runAnalysis}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" />
              Analyze
            </button>
            <button
              type="button"
              onClick={() => {
                setCode("");
                setResult(null);
              }}
              className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
              title="Clear"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex rounded-xl border border-border bg-surface p-1">
            {(["explain", "quiz"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2 text-sm capitalize transition-colors ${
                  tab === t ? "bg-surface-2 text-foreground" : "text-muted"
                }`}
              >
                {t === "explain" ? "Explain" : "Quiz"}
              </button>
            ))}
          </div>

          <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {tab === "explain" ? (
              <AnalysisPanel result={result} onLineClick={handleLineClick} />
            ) : (
              <QuizPanel
                questions={result?.quiz ?? []}
                isPro={usage.isPro}
              />
            )}
          </div>
        </div>
      </div>

      {!result && (
        <div className="mt-8 rounded-xl border border-dashed border-border p-6 text-center">
          <Play className="mx-auto mb-2 h-6 w-6 text-muted" />
          <p className="text-sm text-muted">
            Hit <strong className="text-foreground">Analyze</strong> or try a sample language
            above to see explanations and quizzes.
          </p>
        </div>
      )}
    </div>
  );
}
