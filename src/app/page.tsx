"use client";

import Link from "next/link";

const phases = [
  {
    number: "01",
    title: "Human Decisions",
    subtitle: "Do first — everything else is blocked",
    description:
      "Define your problem, user, single action, name, price, distribution plan, success metric, and kill criteria. Front-load all the judgment calls.",
    tasks: 8,
    tag: "HUMAN",
  },
  {
    number: "02",
    title: "Human Setup",
    subtitle: "Accounts & credentials only you can create",
    description:
      "Buy domain, set up hosting, auth, payments, database, analytics, and email. Collect all credentials into a single .env file.",
    tasks: 8,
    tag: "HUMAN",
  },
  {
    number: "03",
    title: "AI Execution",
    subtitle: "Runs in parallel once Phase 1 & 2 are done",
    description:
      "Competitive scan, technical spec, landing page, core product build, copy, SEO, legal, feedback mechanism, launch posts, and monitoring.",
    tasks: 10,
    tag: "AI",
  },
  {
    number: "04",
    title: "Post-Launch",
    subtitle: "Day 2–7: measure, learn, decide",
    description:
      "Execute distribution, respond to every user, check daily metrics, collect feedback, run a 7-day audit, and make the continue/pivot/kill decision.",
    tasks: 6,
    tag: "BOTH",
  },
];

const hardTruths = [
  {
    number: "1.6",
    title: "Distribution",
    text: "Where your first 50 users come from. Not \"Twitter\" — specific channels, specific people, specific DMs.",
  },
  {
    number: "1.8",
    title: "Kill Criteria",
    text: "What result in 7 days means you stop. Written down before you're emotionally attached.",
  },
  {
    number: "4.6",
    title: "The Decision",
    text: "Continue, pivot, or kill. Made with data, not hope.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/90 backdrop-blur-sm border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-gold font-display text-xl tracking-wide">
            [ Launch in a Day ]
          </span>
          <Link
            href="/checklist"
            className="bg-gold text-dark px-5 py-2 text-sm font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors"
          >
            Start Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/95 to-dark" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(232,197,71,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(232,197,71,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-8 font-medium">
            For Solo Founders
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] mb-8 text-white">
            Launch in
            <br />
            <span className="text-gold">a Day.</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
            A guided checklist that walks you from idea to live product.
            Front-load the decisions. Let AI handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/checklist"
              className="bg-gold text-dark px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors w-full sm:w-auto"
            >
              Start the Checklist
            </Link>
            <a
              href="#how-it-works"
              className="border border-dark-border text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:border-gold hover:text-gold transition-colors w-full sm:w-auto"
            >
              How It Works
            </a>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-text-muted to-transparent" />
        </div>
      </section>

      {/* Core Insight */}
      <section className="py-24 bg-dark-secondary">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border-l-2 border-gold pl-8">
            <p className="text-gold uppercase tracking-[0.2em] text-xs mb-4">
              Core Insight
            </p>
            <p className="text-2xl md:text-3xl font-display leading-relaxed text-white">
              The bottleneck isn&rsquo;t building — it&rsquo;s{" "}
              <span className="text-gold">decisions and account setup</span>.
            </p>
            <p className="text-lg text-text-muted mt-4">
              Front-load all human judgment, then let AI execute in parallel.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-dark">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-xs mb-4">
              The Process
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              Four phases. Zero fluff.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {phases.map((phase) => (
              <div
                key={phase.number}
                className="bg-dark-card border border-dark-border p-8 hover:border-gold/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-gold font-display text-4xl opacity-50 group-hover:opacity-100 transition-opacity">
                    {phase.number}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 tracking-wider font-medium ${
                      phase.tag === "HUMAN"
                        ? "bg-gold/10 text-gold"
                        : phase.tag === "AI"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-purple-500/10 text-purple-400"
                    }`}
                  >
                    {phase.tag}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {phase.title}
                </h3>
                <p className="text-sm text-gold/70 mb-4">{phase.subtitle}</p>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  {phase.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <div className="flex gap-1">
                    {Array.from({ length: phase.tasks }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 border border-dark-border group-hover:border-gold/30 transition-colors"
                      />
                    ))}
                  </div>
                  <span className="ml-2">{phase.tasks} tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Gates */}
      <section className="py-24 bg-dark-secondary">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-xs mb-4">
              Guardrails
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              Quality gates.
            </h2>
            <p className="text-text-muted mt-4 text-lg">
              You cannot proceed to the next phase until the current one is
              complete.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                gate: "Gate 1",
                rule: "All decisions documented, kill criteria written",
              },
              {
                gate: "Gate 2",
                rule: "All credentials in .env, all services tested",
              },
              {
                gate: "Gate 3",
                rule: "Landing page live, core action works, launch posts drafted",
              },
              {
                gate: "Gate 4",
                rule: "Distribution executed across all channels",
              },
            ].map((g, i) => (
              <div
                key={i}
                className="flex items-center gap-6 p-6 border border-dark-border bg-dark-card"
              >
                <div className="w-20 shrink-0 text-center">
                  <span className="text-gold font-display text-sm">
                    {g.gate}
                  </span>
                </div>
                <div className="w-px h-8 bg-dark-border" />
                <p className="text-text-muted text-sm">{g.rule}</p>
                <div className="ml-auto shrink-0">
                  <svg
                    className="w-5 h-5 text-dark-border"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hard Truths */}
      <section className="py-24 bg-dark">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] text-xs mb-4">
              The Hard Truth
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
              Three tasks that actually matter.
            </h2>
            <p className="text-text-muted text-lg">
              Skip these and you&rsquo;ve built a side project, not tested a
              business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {hardTruths.map((truth) => (
              <div
                key={truth.number}
                className="border border-gold/20 bg-gold/5 p-8"
              >
                <span className="text-gold font-display text-3xl">
                  {truth.number}
                </span>
                <h3 className="text-white font-semibold text-lg mt-4 mb-3">
                  {truth.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {truth.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What This Is NOT */}
      <section className="py-24 bg-dark-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-12 text-center">
            What this is <span className="text-gold">not</span>.
          </h2>
          <div className="space-y-4">
            {[
              "Not a SaaS platform — it's a structured, opinionated checklist",
              'Not time-bound — "in a day" is aspirational, not a constraint',
              "Not a replacement for talking to users — it gets you to the point where you CAN talk to users, with a real thing",
              "Not a guarantee — it's a process for generating signal fast",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 border-b border-dark-border"
              >
                <span className="text-gold mt-1 shrink-0">&#x2715;</span>
                <p className="text-text-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-dark relative">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(232,197,71,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,197,71,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-6xl text-white mb-6">
            Stop planning.
            <br />
            <span className="text-gold">Start shipping.</span>
          </h2>
          <p className="text-text-muted text-lg mb-10 max-w-xl mx-auto">
            32 tasks. 4 phases. 4 quality gates. Everything you need to go from
            idea to live product — with nothing you don&rsquo;t.
          </p>
          <Link
            href="/checklist"
            className="inline-block bg-gold text-dark px-10 py-5 text-sm font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors"
          >
            Start the Checklist
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-gold font-display text-sm">
            [ Launch in a Day ]
          </span>
          <p className="text-text-muted text-xs">
            Built for founders who ship.
          </p>
        </div>
      </footer>
    </div>
  );
}
