// Agent pipeline definition + sample analytics + report content.

export const AGENTS = [
  {
    id: "plan",
    name: "Planning agent",
    role: "Scope & sampling",
    thoughts: [
      "Reading the objective and deciding what evidence belongs in the report.",
      "Turning the request into a checkpointed plan with assumptions you can approve.",
      "Shaping the output so it includes owners, timing, and clear next actions.",
    ],
    proposal: [
      "Target: seller support tickets, help-center chat, and escalation notes.",
      "Lens: payment, catalog, fulfillment, returns, ads, and onboarding.",
      "Compare high-volume sellers with first-45-day sellers.",
    ],
  },
  {
    id: "sql",
    name: "SQL agent",
    role: "Query strategy",
    thoughts: [
      "Drafting the query shape for ticket volume, resolution time, and escalations.",
      "Choosing metrics that feed both the charts and a written narrative.",
      "Flagging fields that need human review before extraction.",
    ],
    proposal: [
      "Aggregate by contact driver, queue, market, and seller tenure.",
      "Join escalation events to resolution timestamps.",
      "Return only the fields needed for analysis and traceability.",
    ],
  },
  {
    id: "themes",
    name: "Theme agent",
    role: "Pattern extraction",
    thoughts: [
      "Grouping repeated seller pain points into measurable themes.",
      "Separating sentiment from urgency so noise does not dominate.",
      "Comparing top themes against recent macro usage and repeat contacts.",
    ],
    proposal: [
      "Payment reconciliation is the highest-friction theme.",
      "Catalog rejections concentrate among newer sellers.",
      "Fulfillment issues create repeat contacts when ownership is unclear.",
    ],
  },
  {
    id: "report",
    name: "Report agent",
    role: "Synthesis",
    thoughts: [
      "Converting metrics and themes into a written article.",
      "Ranking recommendations by operational impact and clarity.",
      "Preparing the analytics checkpoint before the report is written.",
    ],
    proposal: [
      "Executive summary, evidence, interpretation, and actions.",
      "Charts shown first so reviewers can validate the signal.",
      "Save the report to history for follow-up questions.",
    ],
  },
];

export const ANALYTICS = {
  metrics: [
    { label: "Conversations", value: "18,420", trend: "+12% vs. prior period" },
    { label: "Avg. resolution", value: "9.4h", trend: "2.1h above target" },
    { label: "Escalation share", value: "14.8%", trend: "-3.2 pts after triage" },
    { label: "Seller sentiment", value: "71", trend: "Healthy, volatile" },
  ],
  drivers: [
    { label: "Payments", value: 32 },
    { label: "Catalog", value: 27 },
    { label: "Fulfillment", value: 21 },
    { label: "Returns", value: 13 },
    { label: "Ads", value: 7 },
  ],
  health: [
    { label: "Resolved cleanly", value: 58 },
    { label: "Needs follow-up", value: 28 },
    { label: "Escalated", value: 14 },
  ],
  confidence: [
    { label: "Plan", value: 88 },
    { label: "SQL", value: 91 },
    { label: "Themes", value: 86 },
    { label: "Report", value: 94 },
  ],
};

export function buildLiveReport(objective) {
  return {
    id: "rpt-live",
    tag: "New",
    title: "Seller support intelligence brief",
    date: "Jun 12, 2026",
    focus: "Payments · catalog · fulfillment · sentiment",
    objective: objective || "Seller support analysis",
    meta: ["18,420 conversations", "4-week lookback", "Seller support", "Confidence 94%"],
    sections: [
      {
        heading: "Executive summary",
        paragraphs: [
          "Treat the current seller-support pattern as an operational clarity problem, not only a queue-volume problem. The highest-frequency conversations cluster around payment reconciliation, catalog rejection loops, and fulfillment ownership.",
          "These topics create repeat contacts because sellers can see the issue but not the next owner, next action, or expected timing. The most effective response is a visible support-intelligence layer.",
        ],
      },
      {
        heading: "What changed in the last four weeks",
        paragraphs: [
          "Payment-related conversations are the clearest signal — the largest share of contacts and the strongest repeat-contact behavior around invoice adjustments and payout timing.",
          "Fulfillment and returns create a different friction: sellers know something is delayed but not whether support, warehouse, or courier owns the next step.",
        ],
      },
      {
        heading: "Suggested narrative for leadership",
        paragraphs: [
          "Friction is driven by uncertainty after an issue is already known. The seller needs a precise answer that explains what happened, who owns the next step, and when the next update arrives.",
          "Keep the four-agent workflow as a reviewable pipeline so output stays safe while the interface still feels fast.",
        ],
      },
    ],
    recommendations: [
      "Publish a payment-status card with payout ETA, adjustment reason, and finance owner.",
      "Add catalog rejection examples to the first response for new sellers.",
      "Create a weekly digest for unresolved fulfillment and returns escalations.",
      "Track repeat-contact reduction by theme as the main success metric.",
    ],
  };
}

export const INITIAL_HISTORY = [
  {
    id: "rpt-042",
    tag: "Payments",
    title: "Payment dispute and payout clarity",
    date: "Jun 10, 2026",
    focus: "Payments · reconciliation · invoice adjustments",
    objective: "Explain repeat payout questions after invoice adjustments.",
    meta: ["12,140 conversations", "Finance + support", "Confidence 92%"],
    sections: [
      {
        heading: "Executive summary",
        paragraphs: [
          "Repeat contacts around payouts spike after invoice adjustments. Sellers can see a changed amount but cannot see why it changed or when the corrected payout lands.",
          "A single seller-visible status explanation removes most of the avoidable follow-up volume in this theme.",
        ],
      },
    ],
    recommendations: [
      "Add payout status explanations with reason and expected date.",
      "Create a macro for invoice adjustment disputes.",
      "Route high-risk sellers to finance support directly.",
    ],
  },
  {
    id: "rpt-039",
    tag: "Onboarding",
    title: "New seller onboarding friction",
    date: "Jun 03, 2026",
    focus: "Catalog · onboarding · SKU quality",
    objective: "Find where new seller support breaks down.",
    meta: ["8,760 conversations", "First-45-day sellers", "Confidence 90%"],
    sections: [
      {
        heading: "Executive summary",
        paragraphs: [
          "New sellers repeat catalog questions because rejection reasons are visible but the fix is not specific. The same SKU is resubmitted several times.",
          "First responses that include a concrete example fix sharply reduce resubmission loops.",
        ],
      },
    ],
    recommendations: [
      "Add catalog rejection examples to first responses.",
      "Prompt sellers about missing attributes before submission.",
      "Improve first-response article links for onboarding.",
    ],
  },
  {
    id: "rpt-034",
    tag: "Fulfillment",
    title: "Fulfillment escalation trend",
    date: "May 27, 2026",
    focus: "Fulfillment · returns · escalation ownership",
    objective: "Explain the rise in fulfillment escalations.",
    meta: ["6,410 conversations", "Ops + courier", "Confidence 88%"],
    sections: [
      {
        heading: "Executive summary",
        paragraphs: [
          "Escalations rose when sellers could not tell whether support, warehouse, or courier owned the next step. The delay was visible; the owner was not.",
          "Exposing the owner and an ETA band in replies reduces escalation pressure.",
        ],
      },
    ],
    recommendations: [
      "Expose the owner field in replies.",
      "Add ETA bands to fulfillment updates.",
      "Review the warehouse handoff queue weekly.",
    ],
  },
];

export function answerQuestion(question, reportTitle) {
  const q = question.toLowerCase();
  if (q.includes("payment") || q.includes("payout")) {
    return `For "${reportTitle}", split payment questions into invoice adjustment, payout ETA, and reconciliation proof. The highest-impact follow-up is a seller-visible status explanation.`;
  }
  if (q.includes("catalog") || q.includes("sku")) {
    return `For "${reportTitle}", catalog friction is most actionable when the answer includes the rejected attribute, an example fix, and the queue that owns re-review.`;
  }
  if (q.includes("owner") || q.includes("action")) {
    return `For "${reportTitle}", assign one owner per recommendation and track repeat-contact rate, escalation share, and time-to-next-action.`;
  }
  return `For "${reportTitle}", segment by seller tenure and contact driver, then compare repeat-contact reduction after the recommended macro launches.`;
}
