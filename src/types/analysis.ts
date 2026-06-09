export type Language = "javascript" | "typescript" | "python";

export type Complexity = "beginner" | "intermediate" | "advanced";

export interface CodeBlock {
  name: string;
  type: "function" | "class" | "method" | "variable" | "import" | "loop" | "conditional";
  startLine: number;
  endLine: number;
  signature?: string;
  explanation: string;
  concepts: string[];
  gotchas?: string[];
}

export interface FlowStep {
  order: number;
  line: number;
  description: string;
  type: "entry" | "branch" | "loop" | "return" | "call" | "assign";
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  concept: string;
}

export interface AnalysisResult {
  language: Language;
  summary: string;
  complexity: Complexity;
  blocks: CodeBlock[];
  flow: FlowStep[];
  concepts: { name: string; description: string; learnMoreUrl: string }[];
  warnings: string[];
  quiz: QuizQuestion[];
  stats: {
    lines: number;
    functions: number;
    classes: number;
    imports: number;
  };
}
