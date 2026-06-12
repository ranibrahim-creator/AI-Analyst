const pages = document.querySelectorAll(".page");
const routeLinks = document.querySelectorAll("[data-route]");
const startAnalysisButton = document.querySelector("[data-start-analysis]");
const startFlowButton = document.querySelector("[data-start-flow]");
const approveButton = document.querySelector("[data-approve-step]");
const cancelButton = document.querySelector("[data-cancel-step]");
const openLiveReportButton = document.querySelector("[data-open-live-report]");
const chatStream = document.querySelector("#chat-stream");
const runStatus = document.querySelector("#run-status");
const agentTitle = document.querySelector("#agent-title");
const objectiveEcho = document.querySelector("#objective-echo");
const checkpointCard = document.querySelector("#checkpoint-card");
const checkpointTitle = document.querySelector("#checkpoint-title");
const checkpointCopy = document.querySelector("#checkpoint-copy");
const checkpointList = document.querySelector("#checkpoint-list");
const objectiveInput = document.querySelector("#analysis-objective");
const historyList = document.querySelector("#history-list");
const recentsList = document.querySelector("#recents-list");
const reportView = document.querySelector("#report-view");
const greeting = document.querySelector("#greeting");
const chipButtons = document.querySelectorAll(".chip");

const agents = [
  {
    name: "Planning Agent",
    step: "Plan review",
    status: "Mapping objective",
    thoughts: [
      "Reading the objective and deciding what evidence belongs in the report.",
      "Turning the request into a checkpointed plan with assumptions you can approve.",
      "Shaping the final article so it includes owners, timing, and clear actions."
    ],
    copy: "Proposed scope before any query work starts.",
    bullets: [
      "Target: seller support tickets, help-center chat, escalation notes.",
      "Lens: payment, catalog, fulfillment, returns, ads, onboarding.",
      "Compare high-volume sellers with first-45-day sellers."
    ]
  },
  {
    name: "SQL Agent",
    step: "SQL review",
    status: "Designing query",
    thoughts: [
      "Drafting the query shape for ticket volume, resolution time, and escalations.",
      "Choosing metrics that feed both charts and a written narrative.",
      "Flagging fields that need human review before extraction."
    ],
    copy: "Auditable extraction strategy from the approved plan.",
    bullets: [
      "Aggregate by contact driver, queue, market, and seller tenure.",
      "Join escalation events to resolution timestamps.",
      "Return only the fields needed for analysis and traceability."
    ]
  },
  {
    name: "Theme Agent",
    step: "Themes review",
    status: "Clustering themes",
    thoughts: [
      "Grouping repeated seller pain points into measurable themes.",
      "Separating sentiment from urgency so noise does not dominate.",
      "Comparing top themes against recent macro usage and repeat contacts."
    ],
    copy: "Qualitative layer that explains why the metrics moved.",
    bullets: [
      "Payment reconciliation is the highest-friction theme.",
      "Catalog rejections concentrate among newer sellers.",
      "Fulfillment issues create repeat contacts when ownership is unclear."
    ]
  },
  {
    name: "Report Agent",
    step: "Report",
    status: "Composing report",
    thoughts: [
      "Converting metrics and themes into a written article.",
      "Ranking recommendations by operational impact and clarity.",
      "Preparing the analytics preview before the report opens."
    ],
    copy: "Ready to hand off charts and the written report.",
    bullets: [
      "Executive summary, evidence, interpretation, and actions.",
      "Charts preview first so reviewers can validate the signal.",
      "Save the report to history for follow-up questions."
    ]
  }
];

const liveReportTemplate = {
  id: "rpt-live",
  tag: "New",
  title: "Seller support intelligence brief",
  date: "Jun 12, 2026",
  focus: "Payments, catalog, fulfillment, sentiment",
  meta: ["18,420 conversations", "4-week lookback", "Seller support", "Confidence 94%"],
  sections: [
    {
      h3: "Executive summary",
      body: [
        "Treat the current seller-support pattern as an operational clarity problem, not only a queue-volume problem. The highest-frequency conversations cluster around payment reconciliation, catalog rejection loops, and fulfillment ownership.",
        "These topics create repeat contacts because sellers can see the issue, but cannot see the next owner, next action, or expected timing. The most effective response is a visible support-intelligence layer: clearer status messages, better first-response macros, and weekly unresolved-issue digests."
      ]
    },
    {
      h3: "What changed in the last four weeks",
      callout:
        "Payment-related conversations are the clearest signal — the largest share of contacts and the strongest repeat-contact behavior when sellers ask about invoice adjustments, payout timing, and reconciliation proof.",
      body: [
        "Catalog conversations remain concentrated among newer sellers, who ask multiple versions of the same question because the rejection reason is visible but the expected fix is not specific enough.",
        "Fulfillment and returns create a different friction: sellers know something is delayed, but not whether support, warehouse, or courier operations owns the next step."
      ]
    },
    {
      h3: "Evidence by theme",
      evidence: [
        { label: "Priority theme", title: "Payment reconciliation", text: "High-volume sellers repeatedly ask for payout status clarity after invoice adjustments." },
        { label: "Risk segment", title: "New marketplace sellers", text: "First 45-day sellers show higher confusion around SKU quality and routing." },
        { label: "Best intervention", title: "Guided support macros", text: "Macros with next action, owner, and timing reduce repeat-contact intent." }
      ]
    },
    {
      h3: "Suggested narrative for leadership",
      body: [
        "Seller support friction is driven by uncertainty after an issue is already known. The seller does not need generic reassurance; they need a precise answer that explains what happened, who owns the next step, and when the next update arrives.",
        "Keep the four-agent workflow as a reviewable pipeline: planning validates scope, SQL validates evidence, themes validate interpretation, and the report packages the decision. Approvals between stages keep the output safe while the interface still feels fast."
      ]
    }
  ],
  recommendations: [
    "Publish a payment-status card in the partner journey with payout ETA, adjustment reason, and the finance owner.",
    "Add catalog rejection examples to the first response for new sellers, with the exact attribute to correct.",
    "Create a weekly digest for unresolved fulfillment and returns escalations, grouped by owner and aging bucket.",
    "Track repeat-contact reduction by theme after each macro launches — the main success metric, not just first-response time."
  ]
};

let currentStep = 0;
let flowRunning = false;
let runToken = 0;
let openReportId = null;
let reportContext = "history";
let liveReportSaved = false;

let historyReports = [
  {
    id: "rpt-042",
    tag: "Payments",
    title: "Payment dispute and payout clarity",
    date: "Jun 10, 2026",
    focus: "Payments · reconciliation · invoice adjustments",
    meta: ["12,140 conversations", "Finance + support", "Confidence 92%"],
    sections: [
      {
        h3: "Executive summary",
        body: [
          "Repeat contacts around payouts spike after invoice adjustments. Sellers can see a changed amount but cannot see why it changed or when the corrected payout lands.",
          "A single seller-visible status explanation removes most of the avoidable follow-up volume in this theme."
        ]
      },
      {
        h3: "Evidence by theme",
        evidence: [
          { label: "Top question", title: "Where is my payout?", text: "Asked repeatedly within 48h of an invoice adjustment." },
          { label: "Driver", title: "Invoice adjustments", text: "Adjustments without a reason field create disputes." },
          { label: "Owner gap", title: "Finance vs. support", text: "Sellers cannot tell which team owns the resolution." }
        ]
      }
    ],
    recommendations: [
      "Add payout status explanations with reason and expected date.",
      "Create a macro for invoice adjustment disputes.",
      "Route high-risk sellers to finance support directly."
    ]
  },
  {
    id: "rpt-039",
    tag: "Onboarding",
    title: "New seller onboarding friction",
    date: "Jun 03, 2026",
    focus: "Catalog · onboarding · SKU quality",
    meta: ["8,760 conversations", "First-45-day sellers", "Confidence 90%"],
    sections: [
      {
        h3: "Executive summary",
        body: [
          "New sellers repeat catalog questions because rejection reasons are visible but the fix is not specific. The same SKU is resubmitted several times.",
          "First responses that include a concrete example fix sharply reduce resubmission loops."
        ]
      },
      {
        h3: "Evidence by theme",
        evidence: [
          { label: "Pattern", title: "Rejection loops", text: "Multiple resubmissions of the same SKU within a week." },
          { label: "Gap", title: "Vague reasons", text: "Rejection text lacks the attribute that needs correcting." },
          { label: "Segment", title: "Long-tail SKUs", text: "Concentrated in newer sellers and niche categories." }
        ]
      }
    ],
    recommendations: [
      "Add catalog rejection examples to first responses.",
      "Prompt sellers about missing attributes before submission.",
      "Improve first-response article links for onboarding."
    ]
  },
  {
    id: "rpt-034",
    tag: "Fulfillment",
    title: "Fulfillment escalation trend",
    date: "May 27, 2026",
    focus: "Fulfillment · returns · escalation ownership",
    meta: ["6,410 conversations", "Ops + courier", "Confidence 88%"],
    sections: [
      {
        h3: "Executive summary",
        body: [
          "Escalations rose when sellers could not tell whether support, warehouse, or courier operations owned the next step. The delay was visible; the owner was not.",
          "Exposing the owner and an ETA band in replies reduces escalation pressure."
        ]
      },
      {
        h3: "Evidence by theme",
        evidence: [
          { label: "Driver", title: "Ownership ambiguity", text: "No clear next owner shown to the seller." },
          { label: "Pattern", title: "Aged escalations", text: "Tickets re-opened while waiting on handoffs." },
          { label: "Hot spot", title: "Warehouse handoff", text: "Most delays appear at the warehouse-to-courier seam." }
        ]
      }
    ],
    recommendations: [
      "Expose the owner field in replies.",
      "Add ETA bands to fulfillment updates.",
      "Review the warehouse handoff queue weekly."
    ]
  }
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
  });
}

function setRoute(route) {
  pages.forEach((page) => page.classList.toggle("active-page", page.id === route));
  routeLinks.forEach((link) => link.classList.toggle("active", link.dataset.route === route));

  if (route === "history") {
    renderHistory();
  }

  window.location.hash = route;
  document.querySelector(".app-main").scrollTo({ top: 0, behavior: "smooth" });
}

function setGreeting() {
  const hour = new Date().getHours();
  let part = "evening";
  if (hour < 12) {
    part = "morning";
  } else if (hour < 18) {
    part = "afternoon";
  }
  greeting.textContent = `Good ${part}, Tech Care`;
}

function addBubble(kind, speaker, message, target = chatStream) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${kind}`;
  bubble.innerHTML = `<small>${escapeHtml(speaker)}</small><p>${escapeHtml(message)}</p>`;
  target.appendChild(bubble);
  target.scrollTop = target.scrollHeight;
  return bubble;
}

function addThinkingBubble(agent) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble agent";
  bubble.innerHTML = `<small>${escapeHtml(agent)}</small><p class="thinking" aria-label="${escapeHtml(agent)} is thinking"><i></i><i></i><i></i></p>`;
  chatStream.appendChild(bubble);
  chatStream.scrollTop = chatStream.scrollHeight;
  return bubble;
}

function updateStepIndicators() {
  document.querySelectorAll("[data-step-indicator]").forEach((step, index) => {
    step.classList.toggle("active", index === currentStep && flowRunning);
    step.classList.toggle("complete", index < currentStep || (!flowRunning && currentStep >= agents.length));
  });
}

function showCheckpoint(agent) {
  checkpointTitle.textContent = agent.step;
  checkpointCopy.textContent = agent.copy;
  checkpointList.innerHTML = agent.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("");
  checkpointCard.classList.remove("hidden");
  approveButton.disabled = false;
  cancelButton.disabled = false;
}

function runAgentStep() {
  const agent = agents[currentStep];
  const activeRun = runToken;

  if (!agent) {
    finishFlow();
    return;
  }

  flowRunning = true;
  checkpointCard.classList.add("hidden");
  approveButton.disabled = true;
  cancelButton.disabled = true;
  agentTitle.textContent = agent.name;
  runStatus.textContent = agent.status;
  runStatus.classList.add("running");
  updateStepIndicators();

  let delay = 250;
  agent.thoughts.forEach((thought, index) => {
    setTimeout(() => {
      if (activeRun !== runToken || !flowRunning) {
        return;
      }
      const thinking = addThinkingBubble(agent.name);
      setTimeout(() => {
        if (activeRun !== runToken || !flowRunning) {
          thinking.remove();
          return;
        }
        thinking.innerHTML = `<small>${escapeHtml(agent.name)}</small><p>${escapeHtml(thought)}</p>`;
        chatStream.scrollTop = chatStream.scrollHeight;

        if (index === agent.thoughts.length - 1) {
          setTimeout(() => {
            if (activeRun !== runToken || !flowRunning) {
              return;
            }
            runStatus.textContent = "Needs approval";
            runStatus.classList.remove("running");
            showCheckpoint(agent);
          }, 400);
        }
      }, 480);
    }, delay);
    delay += 920;
  });
}

function startFlow() {
  runToken += 1;
  currentStep = 0;
  flowRunning = true;
  liveReportSaved = false;
  startFlowButton.disabled = true;
  chatStream.innerHTML = "";
  const objective = objectiveInput.value.trim() || "Run a seller support analysis.";
  objectiveEcho.textContent = objective;
  setRoute("analysis");
  addBubble("user", "You", objective);
  runAgentStep();
}

function finishFlow() {
  flowRunning = false;
  startFlowButton.disabled = false;
  checkpointCard.classList.add("hidden");
  currentStep = agents.length;
  updateStepIndicators();
  runStatus.textContent = "Report ready";
  runStatus.classList.remove("running");
  agentTitle.textContent = "Analysis complete";
  addBubble("agent", "Tech Care AI", "All checkpoints approved. Charts are ready, then the written report opens.");
  saveLiveReport();
  setTimeout(() => setRoute("analytics"), 550);
}

function cancelFlow() {
  flowRunning = false;
  runToken += 1;
  startFlowButton.disabled = false;
  checkpointCard.classList.add("hidden");
  runStatus.textContent = "Cancelled";
  runStatus.classList.remove("running");
  agentTitle.textContent = "Analysis cancelled";
  addBubble("user", "You", "Cancel.");
  addBubble("agent", "Tech Care AI", "Run cancelled. Adjust the objective on home and run again.");
  updateStepIndicators();
}

function saveLiveReport() {
  if (liveReportSaved) {
    return;
  }
  const objective = objectiveInput.value.trim();
  const report = { ...liveReportTemplate };
  if (objective) {
    report.prompt = objective;
  }
  historyReports = [report, ...historyReports.filter((item) => item.id !== "rpt-live")];
  liveReportSaved = true;
  renderRecents();
}

function getReport(id) {
  return historyReports.find((report) => report.id === id) || historyReports[0];
}

function renderReport(report, context) {
  openReportId = report.id;
  reportContext = context;

  const backLabel = context === "history" ? "Back to history" : "Back to analytics";
  const meta = (report.meta || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("");

  const sections = (report.sections || [])
    .map((section) => {
      let inner = `<h3>${escapeHtml(section.h3)}</h3>`;
      if (section.callout) {
        inner += `<div class="article-callout">${escapeHtml(section.callout)}</div>`;
      }
      if (section.body) {
        inner += section.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
      }
      if (section.evidence) {
        inner +=
          `<div class="evidence-grid">` +
          section.evidence
            .map(
              (item) =>
                `<div><span class="insight-label">${escapeHtml(item.label)}</span><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text)}</p></div>`
            )
            .join("") +
          `</div>`;
      }
      return `<section class="article-section">${inner}</section>`;
    })
    .join("");

  const recommendations = (report.recommendations || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  reportView.innerHTML = `
    <button class="report-back" type="button" data-report-back>${escapeHtml(backLabel)}</button>
    <article class="report-doc">
      <header class="report-doc-head">
        <span class="doc-tag">${escapeHtml(report.tag)}</span>
        <h2>${escapeHtml(report.title)}</h2>
        <p class="muted">${escapeHtml(report.date)} · ${escapeHtml(report.focus)}</p>
        <div class="artifact-meta">${meta}</div>
      </header>
      <div class="artifact-body">
        ${sections}
        <section class="article-section">
          <h3>Recommended actions</h3>
          <ol class="recommendations">${recommendations}</ol>
        </section>
      </div>

      <section class="report-ask">
        <h3>Ask about this report</h3>
        <div id="report-qa" class="qa-thread">
          <div class="chat-bubble agent compact">
            <small>Report AI</small>
            <p>Ask for a deeper cut by market, theme, queue, or operational owner.</p>
          </div>
        </div>
        <form id="report-question-form" class="composer report-composer">
          <input id="report-question" type="text" placeholder="Ask a follow-up about this report..." autocomplete="off" />
          <button class="primary-action" type="submit">Ask</button>
        </form>
      </section>
    </article>
  `;

  reportView.querySelector("[data-report-back]").addEventListener("click", () => {
    setRoute(context === "history" ? "history" : "analytics");
  });

  const form = reportView.querySelector("#report-question-form");
  const input = reportView.querySelector("#report-question");
  const thread = reportView.querySelector("#report-qa");
  form.addEventListener("submit", (event) => handleQuestion(event, input, thread, report.title));
}

function openReport(id, context) {
  renderReport(getReport(id), context);
  setRoute("report");
}

function renderHistory() {
  historyList.innerHTML = historyReports
    .map(
      (report) => `
      <button class="history-item" type="button" data-history-id="${escapeHtml(report.id)}">
        <span>${escapeHtml(report.tag)}</span>
        <strong>${escapeHtml(report.title)}</strong>
        <small>${escapeHtml(report.date)} · ${escapeHtml(report.focus)}</small>
      </button>`
    )
    .join("");

  historyList.querySelectorAll("[data-history-id]").forEach((item) => {
    item.addEventListener("click", () => openReport(item.dataset.historyId, "history"));
  });
}

function renderRecents() {
  recentsList.innerHTML = historyReports
    .slice(0, 6)
    .map(
      (report) =>
        `<button class="recents-item" type="button" data-recent-id="${escapeHtml(report.id)}">${escapeHtml(report.title)}</button>`
    )
    .join("");

  recentsList.querySelectorAll("[data-recent-id]").forEach((item) => {
    item.addEventListener("click", () => openReport(item.dataset.recentId, "history"));
  });
}

function answerQuestion(question, reportTitle) {
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
  return `For "${reportTitle}", the strongest next step is to segment by seller tenure and contact driver, then compare repeat-contact reduction after the recommended macro launches.`;
}

function handleQuestion(event, input, target, reportTitle) {
  event.preventDefault();
  const question = input.value.trim();
  if (!question) {
    return;
  }
  addBubble("user", "You", question, target);
  input.value = "";

  const thinking = document.createElement("div");
  thinking.className = "chat-bubble agent compact";
  thinking.innerHTML = `<small>Report AI</small><p class="thinking"><i></i><i></i><i></i></p>`;
  target.appendChild(thinking);
  target.scrollTop = target.scrollHeight;

  setTimeout(() => {
    thinking.innerHTML = `<small>Report AI</small><p>${escapeHtml(answerQuestion(question, reportTitle))}</p>`;
    target.scrollTop = target.scrollHeight;
  }, 620);
}

routeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    setRoute(link.dataset.route);
  });
});

startAnalysisButton.addEventListener("click", () => {
  setRoute("home");
  setTimeout(() => objectiveInput.focus(), 80);
});

startFlowButton.addEventListener("click", startFlow);

chipButtons.forEach((chip) => {
  chip.addEventListener("click", () => {
    objectiveInput.value = chip.dataset.prompt;
    objectiveInput.focus();
  });
});

approveButton.addEventListener("click", () => {
  const agent = agents[currentStep];
  addBubble("user", "You", `Approved ${agent.step}.`);
  currentStep += 1;
  updateStepIndicators();
  if (currentStep >= agents.length) {
    finishFlow();
    return;
  }
  runAgentStep();
});

cancelButton.addEventListener("click", cancelFlow);

openLiveReportButton.addEventListener("click", () => {
  saveLiveReport();
  openReport("rpt-live", "analytics");
});

setGreeting();
renderHistory();
renderRecents();

const initialRoute = window.location.hash.replace("#", "") || "home";
setRoute(document.getElementById(initialRoute) ? initialRoute : "home");
