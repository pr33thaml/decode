"use client";

import { useState } from "react";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import type { QuizQuestion } from "@/types/analysis";

interface QuizPanelProps {
  questions: QuizQuestion[];
  isPro: boolean;
}

export function QuizPanel({ questions, isPro }: QuizPanelProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) {
    return null;
  }

  const visibleQuestions = isPro ? questions : questions.slice(0, 2);
  const lockedCount = questions.length - visibleQuestions.length;

  const score = visibleQuestions.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;

  function selectAnswer(id: string, index: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: index }));
    setRevealed((prev) => ({ ...prev, [id]: true }));
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <HelpCircle className="h-4 w-4 text-accent" />
          Comprehension quiz
        </h3>
        {submitted && (
          <span className="text-sm text-muted">
            Score: <span className="font-medium text-accent">{score}/{visibleQuestions.length}</span>
          </span>
        )}
      </div>

      <div className="space-y-5">
        {visibleQuestions.map((q, qi) => {
          const selected = answers[q.id];
          const isRevealed = revealed[q.id];
          const isCorrect = selected === q.correctIndex;

          return (
            <div key={q.id} className="space-y-2">
              <p className="text-sm font-medium">
                {qi + 1}. {q.question}
              </p>
              <div className="grid gap-1.5">
                {q.options.map((opt, oi) => {
                  let style = "border-border bg-surface-2 hover:border-accent/30";
                  if (isRevealed && selected === oi) {
                    style = isCorrect
                      ? "border-accent/50 bg-accent/10"
                      : "border-rose/50 bg-rose/10";
                  } else if (isRevealed && oi === q.correctIndex) {
                    style = "border-accent/30 bg-accent/5";
                  }

                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => selectAnswer(q.id, oi)}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${style}`}
                    >
                      <span className="mr-2 font-mono text-xs text-muted">
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {isRevealed && (
                <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  ) : (
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose" />
                  )}
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {lockedCount > 0 && (
        <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-center text-xs text-muted">
          +{lockedCount} more quiz question{lockedCount > 1 ? "s" : ""} with{" "}
          <a href="/pricing" className="text-accent underline">
            Pro
          </a>
        </div>
      )}

      {!submitted && Object.keys(answers).length === visibleQuestions.length && (
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="mt-4 w-full rounded-lg bg-accent py-2 text-sm font-medium text-background"
        >
          See results
        </button>
      )}
    </section>
  );
}
