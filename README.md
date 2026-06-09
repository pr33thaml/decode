# Decode

**Understand any code in minutes** — paste AI-generated or unfamiliar code, get plain-English explanations, structure breakdowns, and comprehension quizzes.

Built as a learn-to-code tool **and** a monetizable micro-SaaS.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- **Structure analysis** — functions, classes, imports, loops, conditionals (JS/TS/Python)
- **Plain-English explanations** — beginner-friendly, with gotchas
- **Execution flow** — step-by-step what runs when
- **Comprehension quiz** — auto-generated from your code
- **Safety warnings** — hardcoded secrets, eval(), infinite loops
- **Freemium model** — 5 free analyses/day, Pro for unlimited

## Monetization (ready to ship)

1. **Freemium SaaS** — Pro at $9/mo (Stripe Checkout stub on pricing page)
2. **Team plan** — $29/mo for bootcamps/agencies
3. **Future AI tier** — add `OPENAI_API_KEY` for deep explanations at $19/mo
4. **B2B** — sell seat bundles to coding courses

## Deploy

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com) in one click. No env vars required for the core product.

## Tech stack

- Next.js 16 + React 19
- Tailwind CSS 4
- Babel parser (JS/TS AST analysis)
- Monaco Editor
- Client-side analysis (no API costs)

## Project structure

```
src/
  app/           # Pages: landing, /app analyzer, /pricing
  components/    # CodeEditor, AnalysisPanel, QuizPanel
  lib/
    analyzer/    # JS/TS and Python parsers
    quiz.ts      # Quiz generator
    usage.ts     # Freemium daily limits (localStorage)
```

## Next steps to make money

1. Add [Stripe Checkout](https://stripe.com/docs/checkout) to `/pricing`
2. Deploy to Vercel with a custom domain
3. Post on r/learnprogramming, r/webdev, Indie Hackers
4. Optional: add OpenAI route for AI-powered deep explanations
