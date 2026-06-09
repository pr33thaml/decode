"use client";

import dynamic from "next/dynamic";
import type { Language } from "@/types/analysis";

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANGUAGE_MAP: Record<Language, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
};

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  highlightLine?: number;
}

export function CodeEditor({ value, onChange, language, highlightLine }: CodeEditorProps) {
  return (
    <div className="h-full min-h-[320px] overflow-hidden rounded-xl border border-border bg-[#0d1117]">
      <Monaco
        height="100%"
        language={LANGUAGE_MAP[language]}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: highlightLine ? "line" : "all",
          lineDecorationsWidth: 8,
          folding: true,
          wordWrap: "on",
        }}
        onMount={(editor) => {
          if (highlightLine) {
            editor.revealLineInCenter(highlightLine);
            editor.setPosition({ lineNumber: highlightLine, column: 1 });
          }
        }}
      />
    </div>
  );
}
