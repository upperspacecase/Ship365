export interface Task {
  id: string;
  title: string;
  deliverable: string;
  definition: string;
  owner: "Human" | "AI" | "Both";
  inputPlaceholder?: string;
}

export interface Phase {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tasks: Task[];
}

export const phases: Phase[] = [
  {
    id: "phase-1",
    number: "01",
    title: "Human Decisions",
    subtitle: "Do first — everything else is blocked",
    description:
      "Front-load all the judgment calls. Every other phase depends on these answers.",
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
      },
      {
        id: "1.3",
        title: "Define the single action",
        deliverable:
          'The ONE thing a user does in v1. Not two things. One.',
        definition: 'Passes the "I can explain it in a tweet" test',
        owner: "Human",
        inputPlaceholder:
          "e.g. User fills out a guided checklist that sequences their launch tasks...",
      },
      {
        id: "1.4",
        title: "Name it",
        deliverable: "Name + available domain",
        definition:
          "Domain is purchasable. Name is spellable. Doesn't require explanation.",
        owner: "Human",
        inputPlaceholder: "e.g. LaunchDay — launchday.app",
      },
      {
        id: "1.5",
        title: "Set the price",
        deliverable: "Free / freemium / paid. If paid, exact price.",
        definition: "You can say it out loud without flinching",
        owner: "Human",
        inputPlaceholder: "e.g. Free — monetize later with premium templates",
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
      },
    ],
  },
  {
    id: "phase-2",
    number: "02",
    title: "Human Setup",
    subtitle: "Accounts & credentials — only you can do this",
    description:
      "Set up the infrastructure. Every service tested, every key working.",
    tasks: [
      {
        id: "2.1",
        title: "Buy domain",
        deliverable: "Domain registered, DNS accessible",
        definition: "Nameservers pointing to hosting provider",
        owner: "Human",
        inputPlaceholder: "e.g. Purchased launchday.app on Namecheap, DNS pointed to Vercel",
      },
      {
        id: "2.2",
        title: "Set up hosting",
        deliverable: "Vercel/Netlify/Railway account ready",
        definition: "Can deploy a hello world page to the domain",
        owner: "Human",
        inputPlaceholder: "e.g. Vercel account created, connected to GitHub repo",
      },
      {
        id: "2.3",
        title: "Auth provider",
        deliverable: "Clerk/Supabase Auth/Auth0 account + API keys",
        definition: "Test login works locally",
        owner: "Human",
        inputPlaceholder: "e.g. Clerk account set up, test login working locally",
      },
      {
        id: "2.4",
        title: "Payments (if applicable)",
        deliverable: "Stripe account + API keys + product/price created",
        definition: "Test payment goes through in test mode",
        owner: "Human",
        inputPlaceholder: "e.g. N/A — free product for now. Or: Stripe test mode working, $29/mo product created",
      },
      {
        id: "2.5",
        title: "Database",
        deliverable: "Supabase/Planetscale/Neon provisioned",
        definition: "Connection string works",
        owner: "Human",
        inputPlaceholder: "e.g. Supabase project created, connection string tested",
      },
      {
        id: "2.6",
        title: "Analytics",
        deliverable: "Posthog/Plausible account + tracking snippet",
        definition: "Test event fires",
        owner: "Human",
        inputPlaceholder: "e.g. Plausible account created, script tag added, test pageview confirmed",
      },
      {
        id: "2.7",
        title: "Email (if applicable)",
        deliverable: "Resend/Postmark/Loops account + API key",
        definition: "Test email sends",
        owner: "Human",
        inputPlaceholder: "e.g. Resend account created, test email delivered successfully",
      },
      {
        id: "2.8",
        title: "Collect all credentials",
        deliverable: "Single .env file with all keys",
        definition: "Every key tested and working",
        owner: "Human",
        inputPlaceholder: "e.g. .env.local populated with all API keys, verified each one connects",
      },
    ],
  },
  {
    id: "phase-3",
    number: "03",
    title: "AI Execution",
    subtitle: "Runs in parallel once Phase 1 & 2 are done",
    description:
      "Hand off execution. AI builds while you focus on the human stuff.",
    tasks: [
      {
        id: "3.1",
        title: "Competitive scan",
        deliverable:
          "5 closest competitors, their pricing, their weakness",
        definition:
          'Founder reads it and says "yes, that\'s the landscape"',
        owner: "AI",
        inputPlaceholder: "Paste or describe AI-generated competitive analysis...",
      },
      {
        id: "3.2",
        title: "Technical spec",
        deliverable:
          "Stack, data model, user flow diagram, API endpoints",
        definition:
          "A developer (or AI agent) could build from this without asking questions",
        owner: "AI",
        inputPlaceholder: "Paste or describe the technical specification...",
      },
      {
        id: "3.3",
        title: "Landing page",
        deliverable:
          "Live page with hero, value prop, CTA, email capture",
        definition:
          "Passes the 5-second test: a stranger knows what it does",
        owner: "AI",
        inputPlaceholder: "e.g. Landing page deployed at launchday.app — hero, value prop, email capture working",
      },
      {
        id: "3.4",
        title: "Core product build",
        deliverable: "Working app with the single action from 1.3",
        definition:
          "One real user can complete the core action end-to-end",
        owner: "AI",
        inputPlaceholder: "e.g. Checklist app functional — user can progress through all 4 phases",
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
      },
      {
        id: "3.6",
        title: "SEO foundation",
        deliverable: "Meta tags, OG image, sitemap, robots.txt",
        definition:
          "Link preview looks good when shared. Pages are indexable.",
        owner: "AI",
        inputPlaceholder: "e.g. OG tags set, sitemap.xml generated, robots.txt allows crawling",
      },
      {
        id: "3.7",
        title: "Legal minimum",
        deliverable: "Terms of service, privacy policy",
        definition:
          "Pages exist and are linked in footer. Not blank.",
        owner: "AI",
        inputPlaceholder: "e.g. /terms and /privacy pages live, linked in footer",
      },
      {
        id: "3.8",
        title: "Feedback mechanism",
        deliverable: "In-app widget or feedback email",
        definition:
          "A user can tell you something is broken without leaving the app",
        owner: "AI",
        inputPlaceholder: "e.g. Feedback widget added — sends to feedback@launchday.app",
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
      },
      {
        id: "3.10",
        title: "Monitoring",
        deliverable: "Error tracking (Sentry) + uptime check",
        definition:
          "You'll know within 5 minutes if the site goes down",
        owner: "AI",
        inputPlaceholder: "e.g. Sentry configured, BetterUptime pinging every 60 seconds",
      },
    ],
  },
  {
    id: "phase-4",
    number: "04",
    title: "Post-Launch",
    subtitle: "Day 2–7: measure, learn, decide",
    description:
      "Execute the plan. Talk to users. Let the data decide what happens next.",
    tasks: [
      {
        id: "4.1",
        title: "Execute distribution plan",
        deliverable: "Every channel from 1.6 has been posted to",
        definition: "Every channel from 1.6 has been posted to",
        owner: "Human",
        inputPlaceholder: "Check off each channel as you post...",
      },
      {
        id: "4.2",
        title: "Respond to every user",
        deliverable: "< 2 hour response time for first 7 days",
        definition: "< 2 hour response time for first 7 days",
        owner: "Human",
        inputPlaceholder: "Track responses and conversations...",
      },
      {
        id: "4.3",
        title: "Daily metrics check",
        deliverable:
          "Dashboard or daily digest showing progress toward 1.7",
        definition: "AI summarizes, Human reviews",
        owner: "Both",
        inputPlaceholder: "Paste daily metrics summaries...",
      },
      {
        id: "4.4",
        title: "Collect qualitative feedback",
        deliverable: "At least 3 real conversations with users",
        definition: "At least 3 real conversations with users",
        owner: "Human",
        inputPlaceholder: "Summarize user conversations and insights...",
      },
      {
        id: "4.5",
        title: "7-day audit",
        deliverable:
          "Honest comparison: metric from 1.7 vs kill criteria from 1.8",
        definition: "Honest comparison with data",
        owner: "Both",
        inputPlaceholder: "Metric result vs. target vs. kill criteria...",
      },
      {
        id: "4.6",
        title: "Decision: continue, pivot, or kill",
        deliverable: "Made with data, not hope",
        definition: "Made with data, not hope",
        owner: "Human",
        inputPlaceholder: "Your decision and reasoning...",
      },
    ],
  },
];
