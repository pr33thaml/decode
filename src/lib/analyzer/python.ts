import type { CodeBlock, FlowStep } from "@/types/analysis";

function getConcepts(type: CodeBlock["type"]): string[] {
  const map: Record<CodeBlock["type"], string[]> = {
    function: ["functions", "parameters", "return values"],
    class: ["classes", "OOP", "inheritance"],
    method: ["methods", "self parameter"],
    variable: ["variables", "assignment"],
    import: ["modules", "packages"],
    loop: ["loops", "iteration"],
    conditional: ["conditionals", "control flow"],
  };
  return map[type] ?? [];
}

export function analyzePython(code: string): {
  blocks: CodeBlock[];
  flow: FlowStep[];
  stats: { lines: number; functions: number; classes: number; imports: number };
} {
  const lines = code.split("\n");
  const blocks: CodeBlock[] = [];
  const flow: FlowStep[] = [];
  let flowOrder = 0;

  const stats = { lines: lines.length, functions: 0, classes: 0, imports: 0 };

  const importRegex = /^(?:from\s+(\S+)\s+)?import\s+(.+)$/;
  const defRegex = /^(\s*)(?:async\s+)?def\s+(\w+)\s*\(([^)]*)\)\s*(?:->\s*[^:]+)?:/;
  const classRegex = /^(\s*)class\s+(\w+)(?:\(([^)]*)\))?:/;
  const ifRegex = /^(\s*)if\s+(.+):/;
  const forRegex = /^(\s*)for\s+(\w+)\s+in\s+(.+):/;
  const whileRegex = /^(\s*)while\s+(.+):/;
  const returnRegex = /^(\s*)return\b/;
  const assignRegex = /^(\s*)(\w+)\s*=(?!=)/;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    const importMatch = trimmed.match(importRegex);
    if (importMatch) {
      stats.imports++;
      const source = importMatch[1] ?? importMatch[2].split(",")[0].trim();
      blocks.push({
        name: source,
        type: "import",
        startLine: lineNum,
        endLine: lineNum,
        explanation: importMatch[1]
          ? `Imports from package \`${importMatch[1]}\`: ${importMatch[2]}. External code this script depends on.`
          : `Imports module \`${importMatch[2]}\`. Python's way of reusing code others wrote.`,
        concepts: getConcepts("import"),
      });
      return;
    }

    const defMatch = line.match(defRegex);
    if (defMatch) {
      const isMethod = defMatch[1].length > 0;
      const name = defMatch[2];
      const params = defMatch[3]
        .split(",")
        .map((p) => p.trim().split(":")[0].split("=")[0].trim())
        .filter(Boolean);
      stats.functions++;
      const isAsync = line.includes("async def");
      blocks.push({
        name,
        type: isMethod ? "method" : "function",
        startLine: lineNum,
        endLine: lineNum,
        signature: `${isAsync ? "async " : ""}def ${name}(${params.join(", ")})`,
        explanation: isMethod
          ? `Method \`${name}\` belongs to a class. The first param is usually \`self\` — the instance being operated on.`
          : `Function \`${name}\` is a reusable block of logic with ${params.length} parameter${params.length !== 1 ? "s" : ""}.${isAsync ? " It's async — use `await` when calling." : ""}`,
        concepts: getConcepts(isMethod ? "method" : "function"),
        gotchas: params.includes("self") ? ["`self` must be the first parameter of instance methods"] : undefined,
      });
      flow.push({
        order: flowOrder++,
        line: lineNum,
        description: `Defines ${isMethod ? "method" : "function"} \`${name}\``,
        type: "entry",
      });
      return;
    }

    const classMatch = line.match(classRegex);
    if (classMatch) {
      stats.classes++;
      const name = classMatch[2];
      const parent = classMatch[3];
      blocks.push({
        name,
        type: "class",
        startLine: lineNum,
        endLine: lineNum,
        signature: parent ? `class ${name}(${parent})` : `class ${name}`,
        explanation: parent
          ? `Class \`${name}\` inherits from \`${parent}\` — it gets all parent methods and can override them.`
          : `Class \`${name}\` is a blueprint for creating objects with shared attributes and methods.`,
        concepts: getConcepts("class"),
      });
      return;
    }

    const ifMatch = line.match(ifRegex);
    if (ifMatch) {
      blocks.push({
        name: `if ${ifMatch[2]}`,
        type: "conditional",
        startLine: lineNum,
        endLine: lineNum,
        explanation: `Conditional: runs the indented block only if \`${ifMatch[2].trim()}\` is truthy. Python uses indentation (not braces) to define blocks.`,
        concepts: getConcepts("conditional"),
      });
      flow.push({
        order: flowOrder++,
        line: lineNum,
        description: `Branches on: ${ifMatch[2].trim()}`,
        type: "branch",
      });
      return;
    }

    const forMatch = line.match(forRegex);
    if (forMatch) {
      blocks.push({
        name: `for ${forMatch[2]} in ...`,
        type: "loop",
        startLine: lineNum,
        endLine: lineNum,
        explanation: `Loops over each item in \`${forMatch[3].trim()}\`, assigning it to \`${forMatch[2]}\` each iteration.`,
        concepts: getConcepts("loop"),
      });
      flow.push({ order: flowOrder++, line: lineNum, description: `Loops with \`${forMatch[2]}\``, type: "loop" });
      return;
    }

    const whileMatch = line.match(whileRegex);
    if (whileMatch) {
      blocks.push({
        name: `while ${whileMatch[2]}`,
        type: "loop",
        startLine: lineNum,
        endLine: lineNum,
        explanation: `Repeats while \`${whileMatch[2].trim()}\` is true. Check that something inside the loop eventually makes this false.`,
        concepts: getConcepts("loop"),
        gotchas: ["Infinite loops happen when the while condition never becomes False"],
      });
      flow.push({ order: flowOrder++, line: lineNum, description: "Enters while loop", type: "loop" });
      return;
    }

    if (returnRegex.test(line)) {
      flow.push({
        order: flowOrder++,
        line: lineNum,
        description: trimmed.includes("return ") ? "Returns a value" : "Returns None",
        type: "return",
      });
    }

    const assignMatch = line.match(assignRegex);
    if (assignMatch && !line.includes("def ") && !line.includes("class ")) {
      if (flow.length < 25) {
        flow.push({
          order: flowOrder++,
          line: lineNum,
          description: `Assigns to \`${assignMatch[2]}\``,
          type: "assign",
        });
      }
    }
  });

  return { blocks, flow, stats };
}
