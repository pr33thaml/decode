import type { CodeBlock, FlowStep, Language, QuizQuestion } from "@/types/analysis";

export function generateQuiz(
  blocks: CodeBlock[],
  flow: FlowStep[],
  language: Language
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  let id = 0;

  const functions = blocks.filter((b) => b.type === "function" || b.type === "method");
  if (functions.length > 0) {
    const fn = functions[0];
    questions.push({
      id: `q${id++}`,
      question: `What is the primary purpose of \`${fn.name}\` in this code?`,
      options: [
        "Reusable logic that can be called multiple times",
        "Storing a constant value that never changes",
        "Importing an external library",
        "Defining CSS styles for the page",
      ],
      correctIndex: 0,
      explanation: fn.explanation,
      concept: "functions",
    });
  }

  const imports = blocks.filter((b) => b.type === "import");
  if (imports.length > 0) {
    const imp = imports[0];
    questions.push({
      id: `q${id++}`,
      question: `Why does this code import from \`${imp.name}\`?`,
      options: [
        "To reuse code written elsewhere instead of rewriting it",
        "To delete files from the filesystem",
        "To compile the code into machine language",
        "To run the code in a web browser only",
      ],
      correctIndex: 0,
      explanation: imp.explanation,
      concept: "modules",
    });
  }

  const loops = blocks.filter((b) => b.type === "loop");
  if (loops.length > 0) {
    questions.push({
      id: `q${id++}`,
      question: "What's the main risk to watch for with loops in this code?",
      options: [
        "The loop might never stop if the exit condition isn't met",
        "Loops automatically delete all variables",
        "Loops can only run exactly once",
        "Loops prevent functions from being defined",
      ],
      correctIndex: 0,
      explanation: loops[0].explanation,
      concept: "loops",
    });
  }

  const conditionals = blocks.filter((b) => b.type === "conditional");
  if (conditionals.length > 0) {
    questions.push({
      id: `q${id++}`,
      question: "What does the conditional (if) statement control?",
      options: [
        "Which block of code runs based on a true/false test",
        "How fast the CPU runs",
        "The color of text in the editor",
        "The number of files in the project",
      ],
      correctIndex: 0,
      explanation: conditionals[0].explanation,
      concept: "conditionals",
    });
  }

  const classes = blocks.filter((b) => b.type === "class");
  if (classes.length > 0) {
    questions.push({
      id: `q${id++}`,
      question: `What is class \`${classes[0].name}\` used for?`,
      options: [
        "A blueprint for creating objects with shared behavior",
        "A way to comment out code",
        "A database table definition",
        "A network request handler only",
      ],
      correctIndex: 0,
      explanation: classes[0].explanation,
      concept: "classes",
    });
  }

  if (flow.length > 2) {
    const branch = flow.find((f) => f.type === "branch");
    const assign = flow.find((f) => f.type === "assign");
    const step = branch ?? assign ?? flow[1];
    questions.push({
      id: `q${id++}`,
      question: `Around line ${step.line}, what happens in the execution flow?`,
      options: [
        step.description,
        "The program terminates immediately",
        "All variables are reset to zero",
        "A new file is created on disk",
      ],
      correctIndex: 0,
      explanation: `At line ${step.line}: ${step.description}. Reading flow top-to-bottom shows the order operations happen.`,
      concept: "control flow",
    });
  }

  questions.push({
    id: `q${id++}`,
    question: `This code is written in ${language}. What's a good next step after understanding it?`,
    options: [
      "Run it in small pieces and change one thing at a time to see what breaks",
      "Deploy it to production immediately without testing",
      "Delete all the functions to make it shorter",
      "Convert it to a different language before reading it",
    ],
    correctIndex: 0,
    explanation:
      "The best way to learn code is experimentation: run it, tweak one variable, observe the output. This builds intuition faster than reading alone.",
    concept: "learning",
  });

  return questions.slice(0, 6);
}
