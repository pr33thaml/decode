import { parse } from "@babel/parser";
import traverse, { type NodePath } from "@babel/traverse";
import type {
  FunctionDeclaration,
  ClassDeclaration,
  VariableDeclarator,
  ImportDeclaration,
  IfStatement,
  ForStatement,
  WhileStatement,
  ReturnStatement,
  CallExpression,
  AssignmentExpression,
} from "@babel/types";
import type { CodeBlock, FlowStep, Language } from "@/types/analysis";

function explainFunction(name: string, params: string[], isAsync: boolean, isArrow: boolean): string {
  const kind = isArrow ? "arrow function" : "function";
  const asyncNote = isAsync ? " This runs asynchronously — it can `await` other operations." : "";
  const paramNote =
    params.length > 0
      ? ` It takes ${params.length} parameter${params.length > 1 ? "s" : ""}: ${params.join(", ")}.`
      : " It takes no parameters.";
  return `\`${name}\` is a ${kind} — a reusable block of logic.${paramNote}${asyncNote}`;
}

function explainClass(name: string, methodCount: number): string {
  return `\`${name}\` is a class — a blueprint for creating objects with shared behavior. It defines ${methodCount} method${methodCount !== 1 ? "s" : ""}.`;
}

function explainImport(source: string, specifiers: string[]): string {
  if (specifiers.length === 0) {
    return `Imports everything from \`${source}\` — you're pulling in an entire module.`;
  }
  return `Imports ${specifiers.map((s) => `\`${s}\``).join(", ")} from \`${source}\`. These are external building blocks this code depends on.`;
}

function explainConditional(test: string): string {
  return `A conditional check: if \`${test}\` is truthy, one branch runs; otherwise another path is taken. This controls which code executes.`;
}

function explainLoop(kind: string): string {
  return `A \`${kind}\` loop — code inside repeats until a condition is met. Watch for infinite loops if the exit condition never becomes false.`;
}

function getConceptsForNode(type: CodeBlock["type"]): string[] {
  const map: Record<CodeBlock["type"], string[]> = {
    function: ["functions", "scope", "parameters"],
    class: ["classes", "OOP", "encapsulation"],
    method: ["methods", "OOP", "this keyword"],
    variable: ["variables", "assignment", "scope"],
    import: ["modules", "dependencies"],
    loop: ["loops", "iteration"],
    conditional: ["conditionals", "control flow"],
  };
  return map[type] ?? [];
}

export function analyzeJavaScript(code: string, language: Language): {
  blocks: CodeBlock[];
  flow: FlowStep[];
  stats: { lines: number; functions: number; classes: number; imports: number };
} {
  const lines = code.split("\n");
  const blocks: CodeBlock[] = [];
  const flow: FlowStep[] = [];
  let flowOrder = 0;

  const stats = { lines: lines.length, functions: 0, classes: 0, imports: 0 };

  let ast;
  try {
    ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx", "decorators-legacy"],
      errorRecovery: true,
    });
  } catch {
    return { blocks, flow, stats };
  }

  traverse(ast, {
    ImportDeclaration(path: NodePath<ImportDeclaration>) {
      const node = path.node;
      const line = node.loc?.start.line ?? 1;
      const specifiers = node.specifiers.map((s) => {
        if (s.type === "ImportDefaultSpecifier") return s.local.name;
        if (s.type === "ImportNamespaceSpecifier") return `* as ${s.local.name}`;
        return s.imported.type === "Identifier" ? s.imported.name : s.local.name;
      });
      stats.imports++;
      blocks.push({
        name: node.source.value,
        type: "import",
        startLine: line,
        endLine: node.loc?.end.line ?? line,
        explanation: explainImport(node.source.value, specifiers),
        concepts: getConceptsForNode("import"),
      });
    },

    FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
      const node = path.node;
      if (!node.id) return;
      const line = node.loc?.start.line ?? 1;
      const params = node.params.map((p) => (p.type === "Identifier" ? p.name : "..."));
      stats.functions++;
      blocks.push({
        name: node.id.name,
        type: "function",
        startLine: line,
        endLine: node.loc?.end.line ?? line,
        signature: `function ${node.async ? "async " : ""}${node.id.name}(${params.join(", ")})`,
        explanation: explainFunction(node.id.name, params, !!node.async, false),
        concepts: getConceptsForNode("function"),
        gotchas: node.async ? ["Remember to `await` the result when calling this function"] : undefined,
      });
      flow.push({
        order: flowOrder++,
        line,
        description: `Defines function \`${node.id.name}\``,
        type: "entry",
      });
    },

    ClassDeclaration(path: NodePath<ClassDeclaration>) {
      const node = path.node;
      if (!node.id) return;
      const line = node.loc?.start.line ?? 1;
      const methods = node.body.body.filter((m) => m.type === "ClassMethod").length;
      stats.classes++;
      blocks.push({
        name: node.id.name,
        type: "class",
        startLine: line,
        endLine: node.loc?.end.line ?? line,
        signature: `class ${node.id.name}`,
        explanation: explainClass(node.id.name, methods),
        concepts: getConceptsForNode("class"),
      });
    },

    VariableDeclarator(path: NodePath<VariableDeclarator>) {
      const node = path.node;
      if (node.id.type !== "Identifier") return;
      if (node.init?.type === "ArrowFunctionExpression" || node.init?.type === "FunctionExpression") {
        const fn = node.init;
        const params = fn.params.map((p) => (p.type === "Identifier" ? p.name : "..."));
        const line = node.loc?.start.line ?? 1;
        stats.functions++;
        blocks.push({
          name: node.id.name,
          type: "function",
          startLine: line,
          endLine: node.loc?.end.line ?? line,
          signature: `const ${node.id.name} = ${fn.async ? "async " : ""}(${params.join(", ")}) => ...`,
          explanation: explainFunction(node.id.name, params, !!fn.async, true),
          concepts: getConceptsForNode("function"),
        });
        return;
      }
      const line = node.loc?.start.line ?? 1;
      const initType = node.init?.type ?? "undefined";
      blocks.push({
        name: node.id.name,
        type: "variable",
        startLine: line,
        endLine: node.loc?.end.line ?? line,
        explanation: `Declares variable \`${node.id.name}\` and assigns a ${initType.replace("Expression", "").toLowerCase()} value. Variables store data your program uses later.`,
        concepts: getConceptsForNode("variable"),
      });
      flow.push({
        order: flowOrder++,
        line,
        description: `Assigns value to \`${node.id.name}\``,
        type: "assign",
      });
    },

    IfStatement(path: NodePath<IfStatement>) {
      const node = path.node;
      const line = node.loc?.start.line ?? 1;
      const test =
        node.test.type === "Identifier"
          ? node.test.name
          : node.test.type === "BinaryExpression" && node.test.left.type === "Identifier"
            ? node.test.left.name
            : "condition";
      blocks.push({
        name: `if (${test})`,
        type: "conditional",
        startLine: line,
        endLine: node.loc?.end.line ?? line,
        explanation: explainConditional(test),
        concepts: getConceptsForNode("conditional"),
      });
      flow.push({
        order: flowOrder++,
        line,
        description: `Branches based on \`${test}\``,
        type: "branch",
      });
    },

    ForStatement(path: NodePath<ForStatement>) {
      const line = path.node.loc?.start.line ?? 1;
      blocks.push({
        name: "for loop",
        type: "loop",
        startLine: line,
        endLine: path.node.loc?.end.line ?? line,
        explanation: explainLoop("for"),
        concepts: getConceptsForNode("loop"),
        gotchas: ["Make sure the loop variable eventually reaches the exit condition"],
      });
      flow.push({ order: flowOrder++, line, description: "Enters a for loop", type: "loop" });
    },

    WhileStatement(path: NodePath<WhileStatement>) {
      const line = path.node.loc?.start.line ?? 1;
      blocks.push({
        name: "while loop",
        type: "loop",
        startLine: line,
        endLine: path.node.loc?.end.line ?? line,
        explanation: explainLoop("while"),
        concepts: getConceptsForNode("loop"),
        gotchas: ["While loops can run forever if the condition never becomes false"],
      });
      flow.push({ order: flowOrder++, line, description: "Enters a while loop", type: "loop" });
    },

    ReturnStatement(path: NodePath<ReturnStatement>) {
      const line = path.node.loc?.start.line ?? 1;
      flow.push({
        order: flowOrder++,
        line,
        description: path.node.argument ? "Returns a value to the caller" : "Returns early (undefined)",
        type: "return",
      });
    },

    CallExpression(path: NodePath<CallExpression>) {
      const node = path.node;
      if (node.callee.type !== "Identifier") return;
      const line = node.loc?.start.line ?? 1;
      if (flow.length < 20) {
        flow.push({
          order: flowOrder++,
          line,
          description: `Calls \`${node.callee.name}()\``,
          type: "call",
        });
      }
    },

    AssignmentExpression(path: NodePath<AssignmentExpression>) {
      const node = path.node;
      if (node.left.type !== "Identifier") return;
      const line = node.loc?.start.line ?? 1;
      if (flow.length < 25) {
        flow.push({
          order: flowOrder++,
          line,
          description: `Updates \`${node.left.name}\``,
          type: "assign",
        });
      }
    },
  });

  blocks.sort((a, b) => a.startLine - b.startLine);
  flow.sort((a, b) => a.order - b.order);

  return { blocks, flow, stats };
}
