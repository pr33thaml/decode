import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Code2,
  DollarSign,
  Layers,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Structure breakdown",
    desc: "See every function, class, import, and loop — mapped to line numbers you can click.",
  },
  {
    icon: BookOpen,
    title: "Plain-English explanations",
    desc: "No jargon walls. Each block explained like a patient tutor, with gotchas called out.",
  },
  {
    icon: Brain,
    title: "Comprehension quizzes",
    desc: "Auto-generated questions test whether you actually understand the code — not just read it.",
  },
  {
    icon: Shield,
    title: "Safety warnings",
    desc: "Flags hardcoded secrets, eval(), and infinite loops before you copy-paste into prod.",
  },
];

const monetize = [
  {
    icon: DollarSign,
    title: "Freemium SaaS",
    desc: "5 free analyses/day. Pro at $9/mo for unlimited + full quizzes. Stripe-ready.",
  },
  {
    icon: Code2,
    title: "Embed in courses",
    desc: "Sell coding bootcamp materials? Bundle Decode access as a premium add-on.",
  },
  {
    icon: Zap,
    title: "API tier later",
    desc: "Charge dev teams per-seat for bulk code review — easy upsell from solo users.",
  },
];

export default function HomePage() {
  return (
    <div className="grid-bg">
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16">
        <div className="animate-fade-up mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Zap className="h-3 w-3" />
            Built for the AI coding era
          </p>
          <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Understand code
            <span className="block text-accent">before you ship it</span>
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-muted">
            Paste code from ChatGPT, Copilot, or anywhere else. Decode breaks it down,
            explains it in plain English, and quizzes you — so you learn, not just copy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
            >
              Analyze code free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-border px-6 py-3 text-sm transition-colors hover:bg-surface"
            >
              See pricing
            </Link>
          </div>
        </div>

        <div
          className="glow-accent animate-fade-up mx-auto mt-16 max-w-4xl rounded-2xl border border-border bg-surface p-1"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="rounded-xl bg-[#0d1117] p-4 font-mono text-sm">
            <p className="text-muted">// You pasted this from an AI. Do you actually get it?</p>
            <p className="text-accent">async function fetchUserProfile(userId) {"{"}</p>
            <p className="pl-4 text-foreground/80">const res = await fetch(`/api/users/${"{"}userId{"}"}`);</p>
            <p className="pl-4 text-foreground/80">return res.json();</p>
            <p className="text-accent">{"}"}</p>
            <p className="mt-3 text-xs text-muted">
              → Decode explains: async/await, fetch API, error handling, and generates a quiz
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold">How it helps you learn</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/30"
              >
                <f.icon className="mb-3 h-5 w-5 text-accent" />
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-3 text-center text-2xl font-bold">Built to make money too</h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-muted">
            This isn&apos;t just a learning toy — it&apos;s structured as a real micro-SaaS you can
            deploy and monetize today.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {monetize.map((m) => (
              <div key={m.title} className="rounded-2xl border border-border bg-surface p-5">
                <m.icon className="mb-3 h-5 w-5 text-amber" />
                <h3 className="mb-2 font-semibold">{m.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold">Start understanding code now</h2>
          <p className="mb-6 text-muted">Free tier includes 5 analyses per day. No signup required.</p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-medium text-background"
          >
            Open the analyzer
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
