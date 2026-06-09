import type { Language } from "@/types/analysis";

export const SAMPLES: Record<Language, { label: string; code: string }> = {
  javascript: {
    label: "Fetch user data",
    code: `import { validateEmail } from "./utils";

async function fetchUserProfile(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const response = await fetch(\`/api/users/\${userId}\`);
  const user = await response.json();

  if (!validateEmail(user.email)) {
    console.warn("Invalid email on file:", user.email);
    return null;
  }

  return {
    id: user.id,
    name: user.displayName,
    email: user.email,
  };
}

const users = [];
for (let i = 0; i < 10; i++) {
  const profile = await fetchUserProfile(i);
  if (profile) users.push(profile);
}

export default users;`,
  },
  typescript: {
    label: "Task manager class",
    code: `interface Task {
  id: string;
  title: string;
  done: boolean;
}

class TaskManager {
  private tasks: Task[] = [];

  add(title: string): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      done: false,
    };
    this.tasks.push(task);
    return task;
  }

  complete(id: string): boolean {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return false;
    task.done = true;
    return true;
  }

  getPending(): Task[] {
    return this.tasks.filter((t) => !t.done);
  }
}

export default TaskManager;`,
  },
  python: {
    label: "CSV processor",
    code: `import csv
from pathlib import Path

class SalesReport:
    def __init__(self, filepath):
        self.filepath = Path(filepath)
        self.rows = []

    def load(self):
        with open(self.filepath, newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if float(row["amount"]) > 0:
                    self.rows.append(row)

    def total_revenue(self):
        return sum(float(r["amount"]) for r in self.rows)

    def top_customers(self, n=5):
        totals = {}
        for row in self.rows:
            name = row["customer"]
            totals[name] = totals.get(name, 0) + float(row["amount"])
        return sorted(totals.items(), key=lambda x: x[1], reverse=True)[:n]

report = SalesReport("sales.csv")
report.load()
print(f"Revenue: \${report.total_revenue():,.2f}")`,
  },
};
