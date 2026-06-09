"use client";

import { useState } from "react";
import { Check, Crown } from "lucide-react";
import { setProStatus } from "@/lib/usage";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for learning and occasional AI code review.",
    features: [
      "5 code analyses per day",
      "Structure breakdown",
      "Plain-English explanations",
      "2 quiz questions per analysis",
      "Safety warnings",
    ],
    cta: "Current plan",
    highlighted: false,
    action: null,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For developers who work with AI-generated code daily.",
    features: [
      "Unlimited analyses",
      "Full comprehension quizzes",
      "Execution flow diagrams",
      "Concept deep-links",
      "Priority: AI explanations (coming soon)",
      "Export reports (coming soon)",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    action: "upgrade",
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For bootcamps, agencies, and dev teams.",
    features: [
      "Everything in Pro",
      "5 team seats included",
      "Shared analysis history",
      "Custom branding",
      "API access (coming soon)",
      "Bulk code review",
    ],
    cta: "Contact for early access",
    highlighted: false,
    action: "contact",
  },
];

export default function PricingPage() {
  const [upgraded, setUpgraded] = useState(false);

  function handleUpgrade() {
    // Demo: toggles Pro locally. Replace with Stripe Checkout in production.
    setProStatus(true);
    setUpgraded(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-bold">Simple pricing</h1>
        <p className="text-muted">
          Start free. Upgrade when you need unlimited analyses and full quizzes.
        </p>
      </div>

      {upgraded && (
        <div className="mb-8 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-center text-sm text-accent">
          <Crown className="mb-1 inline h-4 w-4" /> Pro activated (demo mode). Refresh the analyzer
          to see unlimited access.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-6 ${
              plan.highlighted
                ? "border-accent/50 bg-surface glow-accent"
                : "border-border bg-surface"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-3 inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
                Most popular
              </span>
            )}
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <div className="mt-2 mb-3">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-muted">{plan.period}</span>
            </div>
            <p className="mb-5 text-sm text-muted">{plan.description}</p>
            <ul className="mb-6 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
            {plan.action === "upgrade" ? (
              <button
                type="button"
                onClick={handleUpgrade}
                className="w-full rounded-xl bg-accent py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {plan.cta}
              </button>
            ) : plan.action === "contact" ? (
              <a
                href="mailto:hello@decode.dev?subject=Team%20plan%20early%20access"
                className="block w-full rounded-xl border border-border py-2.5 text-center text-sm transition-colors hover:bg-surface-2"
              >
                {plan.cta}
              </a>
            ) : (
              <div className="w-full rounded-xl border border-border py-2.5 text-center text-sm text-muted">
                {plan.cta}
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="mt-16 rounded-2xl border border-border bg-surface p-8">
        <h2 className="mb-4 text-xl font-bold">How to monetize this product</h2>
        <div className="grid gap-6 md:grid-cols-2 text-sm leading-relaxed text-muted">
          <div>
            <h3 className="mb-2 font-semibold text-foreground">1. Deploy &amp; charge</h3>
            <p>
              Deploy to Vercel (free tier works). Add Stripe Checkout on the Pro button.
              At $9/mo with 100 subscribers, that&apos;s ~$900/mo recurring.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">2. Sell to learners</h3>
            <p>
              Post on Twitter/Reddit targeting &quot;I use AI to code but don&apos;t understand
              the output.&quot; Offer a lifetime deal on AppSumo-style launches.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">3. Bundle with courses</h3>
            <p>
              Coding bootcamps and Udemy instructors can bundle Decode access. Charge them
              $29/mo for 20 student seats — B2B is higher margin.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">4. Add AI tier later</h3>
            <p>
              Wire an OpenAI API route for deeper explanations ($0.01/analysis). Charge
              $19/mo for &quot;AI Deep Dive&quot; — pure margin after API costs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
