export interface Task {
  id: string;
  title: string;
  deliverable: string;
  definition: string;
  owner: "Human" | "AI" | "Both";
  inputPlaceholder?: string;
  tip?: string;
  example?: string;
  why?: string;
}

export interface Phase {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  gateName: string;
  gateRule: string;
  tasks: Task[];
}

export const phases: Phase[] = [
  {
    id: "phase-1",
    number: "01",
    title: "Human Decisions",
    subtitle: "Do first — everything else is blocked",
    description:
      "Front-load all the judgment calls. Every other phase depends on these answers. No AI can make these decisions for you — that's why they come first.",
    gateName: "Gate 1",
    gateRule: "All decisions documented, kill criteria written",
    tasks: [
      {
        id: "1.1",
        title: "Define the problem",
        deliverable:
          "One sentence: [Person] struggles with [problem] when [context]",
        definition:
          "Specific enough that you could find 5 people with this problem today",
        owner: "Human",
        inputPlaceholder:
          "e.g. Solo founders struggle with decision paralysis when trying to launch their first product...",
        tip: "Keep it to one sentence. If you need two, you haven't narrowed enough.",
        example:
          "Freelance designers struggle with scope creep when clients request changes after the project starts.",
        why: "A precise problem statement is the foundation everything else builds on. Vague problems lead to vague products.",
      },
      {
        id: "1.2",
        title: "Define the user",
        deliverable:
          "One paragraph describing who this is for — demographics, psychographics, where they hang out online",
        definition: "You could write a DM to this person right now",
        owner: "Human",
        inputPlaceholder:
          "e.g. Technical founders aged 25-40 who have built side projects but never launched a real business. They hang out on Twitter/X #buildinpublic, Indie Hackers, and Hacker News...",
        tip: 'Be specific about where they hang out online — you\'ll need this for distribution. "Everyone" is not a user.',
        example:
          "Freelance web designers with 1-3 years experience, earning $50-100k, who find clients through Dribbble and Twitter. They read Smashing Magazine and hang out in design-focused Discord servers.",
        why: "You need to be able to picture one real person. If you can't describe them well enough to DM them, you don't know your user yet.",
      },
      {
        id: "1.3",
        title: "Define the single action",
        deliverable:
          "The ONE thing a user does in v1. Not two things. One.",
        definition: 'Passes the "I can explain it in a tweet" test',
        owner: "Human",
        inputPlaceholder:
          "e.g. User fills out a guided checklist that sequences their launch tasks...",
        tip: "If you're tempted to add 'and also...', stop. That's v2.",
        example:
          "User uploads a project brief and gets a scope-locked contract they can send to their client in 60 seconds.",
        why: "One action means one thing to build, one thing to test, one thing to learn from. Complexity kills speed.",
      },
      {
        id: "1.4",
        title: "Name it",
        deliverable: "Name + available domain",
        definition:
          "Domain is purchasable. Name is spellable. Doesn't require explanation.",
        owner: "Human",
        inputPlaceholder: "e.g. LaunchDay — launchday.app",
        tip: "Don't overthink it. A good-enough name now beats a perfect name next month. Check domain availability before you get attached.",
        example: "ScopeShield — scopeshield.com ($12/yr on Namecheap)",
        why: "Naming feels important but it's one of the least important decisions. Ship with a decent name, rebrand later if needed.",
      },
      {
        id: "1.5",
        title: "Set the price",
        deliverable: "Free / freemium / paid. If paid, exact price.",
        definition: "You can say it out loud without flinching",
        owner: "Human",
        inputPlaceholder:
          "e.g. Free — monetize later with premium templates",
        tip: "If you're unsure, start free. You can always charge later, but early friction kills learning.",
        example:
          "Free for first 3 contracts, then $19/month. Validates willingness to pay without blocking initial adoption.",
        why: "The price itself matters less than having decided. Indecision here blocks everything downstream.",
      },
      {
        id: "1.6",
        title: "Distribution: first 50 users",
        deliverable:
          "List of exactly where you'll post/share/DM. Names, URLs, communities.",
        definition:
          'At least 3 specific channels. "Twitter" doesn\'t count — "the #buildinpublic hashtag + 10 DMs to people who tweeted about [topic]" counts.',
        owner: "Human",
        inputPlaceholder:
          "1. #buildinpublic on X — 3 thread posts + 10 DMs\n2. Indie Hackers — launch post in Products\n3. r/SideProject — launch post\n4. Personal newsletter (240 subscribers)",
        tip: "This is one of the three tasks that actually matter. Be embarrassingly specific. List real names and URLs.",
        example:
          "1. r/freelance — post showing the problem with real screenshots\n2. Dribbble Discord #general — share with context\n3. DM 15 designers I follow who tweet about client headaches\n4. Tweet thread with before/after contract example",
        why: "Most startups die from distribution failure, not product failure. If you can't write this list, you don't know your user well enough.",
      },
      {
        id: "1.7",
        title: "Success metric",
        deliverable:
          "One number that tells you if this is working in 7 days",
        definition:
          'It\'s a leading indicator, not a vanity metric. "50 signups" > "1000 page views"',
        owner: "Human",
        inputPlaceholder: "e.g. 50 people complete the full checklist",
        tip: 'Pick a number that proves demand, not interest. Signups > page views. Completed actions > signups.',
        example:
          "15 designers generate at least one contract using the tool within 7 days of launch.",
        why: "Without a number, you'll rationalize any outcome as success. The metric keeps you honest.",
      },
      {
        id: "1.8",
        title: "Kill criteria",
        deliverable: "What result in 7 days means you stop",
        definition:
          "Written down before you're emotionally attached",
        owner: "Human",
        inputPlaceholder:
          "e.g. Fewer than 10 people start the checklist, or 0 people complete Phase 1",
        tip: "Write this while you're still rational. You won't be after you've spent a week building.",
        example:
          "Kill if: fewer than 5 designers try it, OR zero designers use a generated contract with a real client.",
        why: "This is the other critical task. Without kill criteria, you'll spend months on something that isn't working because stopping feels like failure.",
      },
    ],
  },
  {
    id: "phase-2",
    number: "02",
    title: "Human Setup",
    subtitle: "Accounts & credentials — only you can do this",
    description:
      "Set up the infrastructure. These are boring but necessary — you need real accounts and real API keys before AI can build anything.",
    gateName: "Gate 2",
    gateRule: "All credentials in .env, all services tested",
    tasks: [
      {
        id: "2.1",
        title: "Buy domain",
        deliverable: "Domain registered, DNS accessible",
        definition: "Nameservers pointing to hosting provider",
        owner: "Human",
        inputPlaceholder:
          "e.g. Purchased launchday.app on Namecheap, DNS pointed to Vercel",
        tip: "Namecheap, Google Domains, or Cloudflare Registrar are all fine. Don't agonize over TLD.",
      },
      {
        id: "2.2",
        title: "Set up hosting",
        deliverable: "Vercel/Netlify/Railway account ready",
        definition: "Can deploy a hello world page to the domain",
        owner: "Human",
        inputPlaceholder:
          "e.g. Vercel account created, connected to GitHub repo",
        tip: "Vercel is the path of least resistance for Next.js. Railway if you need a backend server.",
      },
      {
        id: "2.3",
        title: "Auth provider",
        deliverable: "Clerk/Supabase Auth/Auth0 account + API keys",
        definition: "Test login works locally",
        owner: "Human",
        inputPlaceholder:
          "e.g. Clerk account set up, test login working locally",
        tip: "Clerk is fastest to integrate. Supabase Auth if you're already using Supabase for DB. Skip if auth isn't needed for v1.",
      },
      {
        id: "2.4",
        title: "Payments (if applicable)",
        deliverable: "Stripe account + API keys + product/price created",
        definition: "Test payment goes through in test mode",
        owner: "Human",
        inputPlaceholder:
          "e.g. N/A — free product for now. Or: Stripe test mode working, $29/mo product created",
        tip: "If your price is 'free', just write N/A and move on. Don't set up Stripe 'just in case'.",
      },
      {
        id: "2.5",
        title: "Database",
        deliverable: "Supabase/Planetscale/Neon provisioned",
        definition: "Connection string works",
        owner: "Human",
        inputPlaceholder:
          "e.g. Supabase project created, connection string tested",
        tip: "Supabase gives you Postgres + auth + storage in one. Neon if you just need Postgres. Skip if localStorage is enough for v1.",
      },
      {
        id: "2.6",
        title: "Analytics",
        deliverable: "Posthog/Plausible account + tracking snippet",
        definition: "Test event fires",
        owner: "Human",
        inputPlaceholder:
          "e.g. Plausible account created, script tag added, test pageview confirmed",
        tip: "Plausible for privacy-focused simplicity. PostHog if you want event tracking and session replay.",
      },
      {
        id: "2.7",
        title: "Email (if applicable)",
        deliverable: "Resend/Postmark/Loops account + API key",
        definition: "Test email sends",
        owner: "Human",
        inputPlaceholder:
          "e.g. Resend account created, test email delivered successfully",
        tip: "Skip if you don't need transactional emails in v1. You can always add this later.",
      },
      {
        id: "2.8",
        title: "Collect all credentials",
        deliverable: "Single .env file with all keys",
        definition: "Every key tested and working",
        owner: "Human",
        inputPlaceholder:
          "e.g. .env.local populated with all API keys, verified each one connects",
        tip: "Create a .env.example too (without real values) so you can commit it. Never commit the real .env.",
      },
    ],
  },
  {
    id: "phase-3",
    number: "03",
    title: "AI Execution",
    subtitle: "Runs in parallel once Phase 1 & 2 are done",
    description:
      "Hand off execution. Everything here can be done by AI agents or with AI assistance. The decisions from Phase 1 are the inputs; the credentials from Phase 2 are the tools.",
    gateName: "Gate 3",
    gateRule: "Landing page live, core action works end-to-end, launch posts drafted",
    tasks: [
      {
        id: "3.1",
        title: "Competitive scan",
        deliverable:
          "5 closest competitors, their pricing, their weakness",
        definition:
          'Founder reads it and says "yes, that\'s the landscape"',
        owner: "AI",
        inputPlaceholder:
          "Paste or describe AI-generated competitive analysis...",
        tip: "Feed your problem statement (1.1) and user description (1.2) to Claude and ask for competitors. Verify the results — AI sometimes hallucinates companies.",
      },
      {
        id: "3.2",
        title: "Technical spec",
        deliverable:
          "Stack, data model, user flow diagram, API endpoints",
        definition:
          "A developer (or AI agent) could build from this without asking questions",
        owner: "AI",
        inputPlaceholder:
          "Paste or describe the technical specification...",
        tip: "Share your single action (1.3) and credentials (2.8) with Claude. Ask it to write a technical spec that another AI agent could build from.",
      },
      {
        id: "3.3",
        title: "Landing page",
        deliverable:
          "Live page with hero, value prop, CTA, email capture",
        definition:
          "Passes the 5-second test: a stranger knows what it does",
        owner: "AI",
        inputPlaceholder:
          "e.g. Landing page deployed at launchday.app — hero, value prop, email capture working",
        tip: "Use v0 or Claude to generate the page. Deploy to Vercel. Test with a friend: can they explain what it does after 5 seconds?",
      },
      {
        id: "3.4",
        title: "Core product build",
        deliverable: "Working app with the single action from 1.3",
        definition:
          "One real user can complete the core action end-to-end",
        owner: "AI",
        inputPlaceholder:
          "e.g. Checklist app functional — user can progress through all 4 phases",
        tip: "This is the big one. Use the technical spec from 3.2 as the prompt. Build ugly and functional — polish comes later.",
      },
      {
        id: "3.5",
        title: "Copy & messaging",
        deliverable:
          "Tagline, 3 social post variants, email template, Product Hunt copy",
        definition:
          "Consistent voice. No jargon. Speaks to the user from 1.2",
        owner: "AI",
        inputPlaceholder: "Paste generated copy here...",
        tip: "Give Claude your user description (1.2) and ask it to write like it's talking to that specific person. No corporate speak.",
      },
      {
        id: "3.6",
        title: "SEO foundation",
        deliverable: "Meta tags, OG image, sitemap, robots.txt",
        definition:
          "Link preview looks good when shared. Pages are indexable.",
        owner: "AI",
        inputPlaceholder:
          "e.g. OG tags set, sitemap.xml generated, robots.txt allows crawling",
        tip: "Test your OG tags by pasting the URL into Twitter/X and LinkedIn post composers. The preview card should look good.",
      },
      {
        id: "3.7",
        title: "Legal minimum",
        deliverable: "Terms of service, privacy policy",
        definition:
          "Pages exist and are linked in footer. Not blank.",
        owner: "AI",
        inputPlaceholder:
          "e.g. /terms and /privacy pages live, linked in footer",
        tip: "AI can generate reasonable boilerplate. This isn't legal advice — get a real lawyer before you scale. But for launch, boilerplate is fine.",
      },
      {
        id: "3.8",
        title: "Feedback mechanism",
        deliverable: "In-app widget or feedback email",
        definition:
          "A user can tell you something is broken without leaving the app",
        owner: "AI",
        inputPlaceholder:
          "e.g. Feedback widget added — sends to feedback@launchday.app",
        tip: "A simple mailto: link or a Tally form is fine. Don't build a feedback system — use an existing tool.",
      },
      {
        id: "3.9",
        title: "Launch posts",
        deliverable:
          "Ready-to-publish posts for each channel from 1.6",
        definition:
          "Tailored to each platform's culture. Not copy-pasted.",
        owner: "AI",
        inputPlaceholder: "Paste draft launch posts here...",
        tip: "Give Claude your distribution channels (1.6) and ask for platform-native posts. A Reddit post should read like Reddit, not Twitter.",
      },
      {
        id: "3.10",
        title: "Monitoring",
        deliverable: "Error tracking (Sentry) + uptime check",
        definition:
          "You'll know within 5 minutes if the site goes down",
        owner: "AI",
        inputPlaceholder:
          "e.g. Sentry configured, BetterUptime pinging every 60 seconds",
        tip: "Sentry free tier + BetterUptime free tier. Takes 10 minutes to set up. Saves you from embarrassment on launch day.",
      },
    ],
  },
  {
    id: "phase-4",
    number: "04",
    title: "Post-Launch",
    subtitle: "Day 2–7: measure, learn, decide",
    description:
      "Execute the plan. Talk to real users. Let the data speak. This phase ends with the most important decision you'll make.",
    gateName: "Gate 4",
    gateRule: "Distribution executed, data collected, decision made",
    tasks: [
      {
        id: "4.1",
        title: "Execute distribution plan",
        deliverable: "Every channel from 1.6 has been posted to",
        definition: "Every channel from 1.6 has been posted to",
        owner: "Human",
        inputPlaceholder: "Check off each channel as you post...",
        tip: "Do this in one focused session. Post to every channel within a few hours. Momentum matters.",
      },
      {
        id: "4.2",
        title: "Respond to every user",
        deliverable: "< 2 hour response time for first 7 days",
        definition: "< 2 hour response time for first 7 days",
        owner: "Human",
        inputPlaceholder: "Track responses and conversations...",
        tip: "Set up notifications. Early users who get fast replies become your best advocates.",
      },
      {
        id: "4.3",
        title: "Daily metrics check",
        deliverable:
          "Dashboard or daily digest showing progress toward 1.7",
        definition: "AI summarizes, Human reviews",
        owner: "Both",
        inputPlaceholder: "Paste daily metrics summaries...",
        tip: "Check once per day, not every hour. Set a specific time. Compare against your success metric from 1.7.",
      },
      {
        id: "4.4",
        title: "Collect qualitative feedback",
        deliverable: "At least 3 real conversations with users",
        definition: "At least 3 real conversations with users",
        owner: "Human",
        inputPlaceholder:
          "Summarize user conversations and insights...",
        tip: "DM people who signed up. Ask: 'What were you hoping this would do?' and 'What's confusing?' — then shut up and listen.",
      },
      {
        id: "4.5",
        title: "7-day audit",
        deliverable:
          "Honest comparison: metric from 1.7 vs kill criteria from 1.8",
        definition: "Honest comparison with data",
        owner: "Both",
        inputPlaceholder:
          "Metric result vs. target vs. kill criteria...",
        tip: "Compare the actual number to what you wrote in 1.7 and 1.8. No spin. No 'but if you count...' — the raw number.",
      },
      {
        id: "4.6",
        title: "Decision: continue, pivot, or kill",
        deliverable: "Made with data, not hope",
        definition: "Made with data, not hope",
        owner: "Human",
        inputPlaceholder: "Your decision and reasoning...",
        tip: "This is the most important task in the entire process. Re-read your kill criteria from 1.8. What does the data say?",
        why: "Everything you've done leads to this moment. The whole point of shipping fast is to get to this decision fast — before you've invested so much that you can't walk away.",
      },
    ],
  },
];
