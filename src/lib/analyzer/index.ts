import type { AnalysisResult, Complexity, Language } from "@/types/analysis";
import { analyzeJavaScript } from "./javascript";
import { analyzePython } from "./python";
import { generateQuiz } from "../quiz";

const CONCEPT_LIBRARY: Record<string, { description: string; learnMoreUrl: string }> = {
  functions: {
    description: "Functions bundle reusable logic. Call them with arguments, get return values back.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Function",
  },
  classes: {
    description: "Classes define object blueprints — shared data (properties) and behavior (methods).",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes",
  },
  OOP: {
    description: "Object-Oriented Programming models code as interacting objects rather than sequential steps.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_programming",
  },
  modules: {
    description: "Modules split code into files you can import. Keeps projects organized and reusable.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
  },
  loops: {
    description: "Loops repeat code. Essential for processing lists, retries, and batch operations.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration",
  },
  conditionals: {
    description: "If/else statements pick which code runs based on true/false conditions.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else",
  },
  variables: {
    description: "Variables store values. const = never reassigned, let = can change, var = old style (avoid).",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let",
  },
  scope: {
    description: "Scope determines where a variable is visible. Inner blocks can't always see outer variables.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Scope",
  },
  "control flow": {
    description: "The order statements execute — straight through, branched, looped, or returned early.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Control_flow",
  },
  iteration: {
    description: "Visiting each item in a collection one at a time, usually with for or while loops.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Iteration",
  },
  parameters: {
    description: "Inputs a function accepts. They're like labeled slots for data the function needs.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Parameter",
  },
  dependencies: {
    description: "External packages your code relies on. Always check what imported code actually does.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Dependency",
  },
  methods: {
    description: "Functions attached to objects or classes. Called with dot notation: obj.method().",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Method",
  },
  "this keyword": {
    description: "In JS classes, `this` refers to the current instance. Methods use it to access instance data.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this",
  },
  encapsulation: {
    description: "Bundling data and methods together, hiding internal details from outside code.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Encapsulation",
  },
  inheritance: {
    description: "A child class gets properties and methods from a parent class, then extends them.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain",
  },
  "self parameter": {
    description: "Python passes the instance as the first argument to methods. Convention: name it `self`.",
    learnMoreUrl: "https://docs.python.org/3/tutorial/classes.html",
  },
  packages: {
    description: "Python's way of organizing modules. pip install adds packages to your environment.",
    learnMoreUrl: "https://docs.python.org/3/tutorial/modules.html#packages",
  },
  assignment: {
    description: "Storing a value in a variable with =. The right side is evaluated, then stored on the left.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment",
  },
  "return values": {
    description: "What a function gives back to whoever called it. Without return, Python returns None.",
    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return",
  },
};

function detectComplexity(stats: AnalysisResult["stats"], blockCount: number): Complexity {
  const score =
    stats.functions * 2 + stats.classes * 3 + stats.imports + Math.floor(blockCount / 3);
  if (score <= 4) return "beginner";
  if (score <= 12) return "intermediate";
  return "advanced";
}

function generateSummary(
  language: Language,
  stats: AnalysisResult["stats"],
  complexity: Complexity,
  blockNames: string[]
): string {
  const langLabel = language === "python" ? "Python" : language === "typescript" ? "TypeScript" : "JavaScript";
  const parts: string[] = [
    `This ${stats.lines}-line ${langLabel} snippet is ${complexity}-level.`,
  ];

  if (stats.imports > 0) {
    parts.push(`It pulls in ${stats.imports} external dependenc${stats.imports > 1 ? "ies" : "y"}.`);
  }
  if (stats.functions > 0) {
    parts.push(`Defines ${stats.functions} function${stats.functions > 1 ? "s" : ""}.`);
  }
  if (stats.classes > 0) {
    parts.push(`Defines ${stats.classes} class${stats.classes > 1 ? "es" : ""}.`);
  }

  const mainBlocks = blockNames.slice(0, 3);
  if (mainBlocks.length > 0) {
    parts.push(`Key pieces: ${mainBlocks.map((n) => `\`${n}\``).join(", ")}.`);
  }

  return parts.join(" ");
}

function generateWarnings(code: string, blocks: AnalysisResult["blocks"]): string[] {
  const warnings: string[] = [];

  if (code.includes("eval(") || code.includes("exec(")) {
    warnings.push("⚠️ Uses eval/exec — this executes arbitrary strings as code. Major security risk.");
  }
  if (/\bpassword\b|\bsecret\b|\bapi[_-]?key\b/i.test(code) && /[=:]\s*['"][^'"]+['"]/.test(code)) {
    warnings.push("⚠️ Possible hardcoded secret detected. Never commit API keys or passwords to code.");
  }
  if (code.includes("console.log") && code.split("console.log").length > 4) {
    warnings.push("💡 Lots of console.log calls — fine for debugging, remove before production.");
  }
  if (blocks.some((b) => b.type === "loop") && !code.includes("break") && code.includes("while (true)")) {
    warnings.push("⚠️ Potential infinite loop: while(true) with no break found.");
  }
  if (code.length > 500 && blocks.length < 3) {
    warnings.push("💡 Large code block with few named structures — might be worth refactoring into functions.");
  }

  return warnings;
}

export function analyzeCode(code: string, language: Language): AnalysisResult {
  const trimmed = code.trim();

  if (!trimmed) {
    return {
      language,
      summary: "Paste some code to get started.",
      complexity: "beginner",
      blocks: [],
      flow: [],
      concepts: [],
      warnings: [],
      quiz: [],
      stats: { lines: 0, functions: 0, classes: 0, imports: 0 },
    };
  }

  const { blocks, flow, stats } =
    language === "python"
      ? analyzePython(trimmed)
      : analyzeJavaScript(trimmed, language);

  const allConcepts = [...new Set(blocks.flatMap((b) => b.concepts))];
  const concepts = allConcepts
    .filter((c) => CONCEPT_LIBRARY[c])
    .map((c) => ({ name: c, ...CONCEPT_LIBRARY[c] }));

  const complexity = detectComplexity(stats, blocks.length);
  const summary = generateSummary(
    language,
    stats,
    complexity,
    blocks.filter((b) => b.type !== "import").map((b) => b.name)
  );
  const warnings = generateWarnings(trimmed, blocks);
  const quiz = generateQuiz(blocks, flow, language);

  return {
    language,
    summary,
    complexity,
    blocks,
    flow,
    concepts,
    warnings,
    quiz,
    stats,
  };
}
