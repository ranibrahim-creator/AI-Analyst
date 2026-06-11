const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("[data-route]");
const routeButtons = document.querySelectorAll("[data-route-button]");
const startAnalysisButton = document.querySelector("[data-start-analysis]");
const startFlowButton = document.querySelector("[data-start-flow]");
const approveButton = document.querySelector("[data-approve-step]");
const cancelButton = document.querySelector("[data-cancel-step]");
const chatStream = document.querySelector("#chat-stream");
const runStatus = document.querySelector("#run-status");
const agentTitle = document.querySelector("#agent-title");
const checkpointCard = document.querySelector("#checkpoint-card");
const checkpointTitle = document.querySelector("#checkpoint-title");
const checkpointCopy = document.querySelector("#checkpoint-copy");
const checkpointList = document.querySelector("#checkpoint-list");
const objectiveInput = document.querySelector("#analysis-objective");
const historyList = document.querySelector("#history-list");
const historyDetail = document.querySelector("#history-detail-content");
const reportQuestionForm = document.querySelector("#report-question-form");
const reportQuestion = document.querySelector("#report-question");
const reportQa = document.querySelector("#report-qa");
const historyQuestionForm = document.querySelector("#history-question-form");
const historyQuestion = document.querySelector("#history-question");
const historyQa = document.querySelector("#history-qa");

const agents = [
  {
    name: "Planning Agent",
    step: "Plan review",
    status: "Mapping objective",
    thoughts: [
      "I am reading the Tech Care objective and isolating the seller-support outcome.",
      "I am turning the request into a safe sampling plan with human-readable assumptions.",
      "I am checking that the report will include operational owners, not just ticket counts."
    ],
    copy: "The plan agent proposes a support-intelligence scope before any query work starts.",
    bullets: [
      "Target conversations: seller support tickets, help-center chat, escalation notes.",
      "Primary lens: payment, catalog, fulfillment, returns, ads, and onboarding friction.",
      "Sampling guardrail: compare high-volume sellers with first-45-day sellers."
    ]
  },
  {
    name: "SQL Agent",
    step: "SQL review",
    status: "Designing query",
    thoughts: [
      "I am drafting the query shape for ticket volume, resolution time, and escalation join paths.",
      "I am adding date-window and seller-segment filters so the charts stay explainable.",
      "I am flagging fields that need human review before extraction proceeds."
    ],
    copy: "The SQL agent translates the approved plan into an auditable extraction strategy.",
    bullets: [
      "Aggregate tickets by contact driver, queue, market, and seller tenure.",
      "Join escalation events to resolution timestamps for operational bottleneck detection.",
      "Return only the fields needed for analysis and report traceability."
    ]
  },
  {
    name: "Theme Agent",
    step: "Themes review",
    status: "Clustering themes",
    thoughts: [
      "I am grouping repeated seller pain points into measurable service themes.",
      "I am separating sentiment from urgency so noisy messages do not dominate the report.",
      "I am comparing the top themes against recent support macro usage."
    ],
    copy: "The themes agent prepares the qualitative layer that explains why the metrics moved.",
    bullets: [
      "Payment reconciliation appears as the highest-friction theme.",
      "Catalog rejections are concentrated among newer sellers and long-tail SKUs.",
      "Fulfillment and returns issues create repeat contacts when ownership is unclear."
    ]
  },
  {
    name: "Report Agent",
    step: "Report approval",
    status: "Composing report",
    thoughts: [
      "I am converting metrics and themes into a leadership-ready narrative.",
      "I am ranking recommendations by operational impact and clarity for Tech Care owners.",
      "I am preparing the analytics preview before the final report opens."
    ],
    copy: "The report agent is ready to hand off charts and the final Tech Care intelligence brief.",
    bullets: [
      "Include executive summary, key risks, evidence, and recommended support actions.",
      "Show chart preview before the written report so reviewers can validate the signal.",
      "Save the completed report into history for follow-up questions."
    ]
  }
];

let currentStep = 0;
let flowRunning = false;
let selectedHistoryId = "rpt-042";
let runToken = 0;
let historyReports = [
  {
    id: "rpt-042",
    tag: "Completed",
    title: "Payment dispute and payout clarity report",
    date: "Jun 10, 2026",
    summary: "Detected a high repeat-contact pattern around payout adjustments after invoice reconciliation.",
    focus: "Payments, reconciliation, invoice adjustments",
    actions: ["Add payout status explanations", "Create macro for invoice adjustment disputes", "Route high-risk sellers to finance support"]
  },
  {
    id: "rpt-039",
    tag: "Completed",
    title: "New seller onboarding friction report",
    date: "Jun 03, 2026",
    summary: "Found catalog rejection confusion and repeated questions around SKU quality rules.",
    focus: "Catalog, onboarding, SKU quality",
    actions: ["Add rejection examples", "Prompt sellers with missing attributes", "Improve first-response article links"]
  },
  {
    id: "rpt-034",
    tag: "Completed",
    title: "Fulfillment escalation trend report",
    date: "May 27, 2026",
    summary: "Escalations increased when sellers could not identify whether support, warehouse, or courier teams owned the next step.",
    focus: "Fulfillment, returns, escalation ownership",
    actions: ["Expose owner field in replies", "Add ETA bands", "Review warehouse handoff queue"]
  }
];

function setRoute(route) {
  pages.forEach((page) => page.classList.toggle("active-page", page.id === route));
  navLinks.forEach((link) => link.classList.toggle("active", link.dataset.route === route));

  if (route === "history") {
    renderHistory();
  }

  window.location.hash = route;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
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
  bubble.innerHTML = `<small>${agent}</small><p class="thinking" aria-label="${agent} is thinking"><i></i><i></i><i></i></p>`;
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
  checkpointList.innerHTML = agent.bullets.map((bullet) => `<li>${bullet}</li>`).join("");
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

        thinking.innerHTML = `<small>${agent.name}</small><p>${thought}</p>`;
        chatStream.scrollTop = chatStream.scrollHeight;

        if (index === agent.thoughts.length - 1) {
          setTimeout(() => {
            if (activeRun !== runToken || !flowRunning) {
              return;
            }

            runStatus.textContent = "Needs approval";
            runStatus.classList.remove("running");
            showCheckpoint(agent);
          }, 450);
        }
      }, 520);
    }, delay);

    delay += 980;
  });
}

function startFlow() {
  runToken += 1;
  currentStep = 0;
  flowRunning = true;
  startFlowButton.disabled = true;
  chatStream.innerHTML = "";
  addBubble("user", "Reviewer", objectiveInput.value.trim() || "Run a Tech Care seller support analysis.");
  runAgentStep();
}

function finishFlow() {
  flowRunning = false;
  startFlowButton.disabled = false;
  checkpointCard.classList.add("hidden");
  currentStep = agents.length;
  updateStepIndicators();
  runStatus.textContent = "Analytics ready";
  runStatus.classList.remove("running");
  agentTitle.textContent = "Analysis complete";
  addBubble(
    "agent",
    "Tech Care AI",
    "All checkpoints are approved. I prepared the analytics layer before opening the final report."
  );
  saveGeneratedReport();
  setTimeout(() => setRoute("analytics"), 650);
}

function cancelFlow() {
  flowRunning = false;
  runToken += 1;
  startFlowButton.disabled = false;
  checkpointCard.classList.add("hidden");
  runStatus.textContent = "Cancelled";
  runStatus.classList.remove("running");
  agentTitle.textContent = "Analysis cancelled";
  addBubble("user", "Reviewer", "Cancel analysis.");
  addBubble("agent", "Tech Care AI", "The run is cancelled. You can adjust the objective and launch the squad again.");
  updateStepIndicators();
}

function saveGeneratedReport() {
  const generatedId = "rpt-live";
  const exists = historyReports.some((report) => report.id === generatedId);

  if (exists) {
    return;
  }

  historyReports = [
    {
      id: generatedId,
      tag: "New",
      title: "Tech Care seller support intelligence brief",
      date: "Jun 11, 2026",
      summary: "Live four-agent run covering payment, catalog, fulfillment, and seller sentiment signals.",
      focus: "Payments, catalog, fulfillment, returns, seller sentiment",
      actions: ["Publish payment-status card", "Improve catalog rejection replies", "Create weekly unresolved-escalation digest"]
    },
    ...historyReports
  ];
  selectedHistoryId = generatedId;
}

function renderHistory() {
  historyList.innerHTML = historyReports
    .map(
      (report) => `
      <button class="history-item ${report.id === selectedHistoryId ? "active" : ""}" type="button" data-history-id="${report.id}">
        <span>${report.tag}</span>
        <strong>${report.title}</strong>
        <small>${report.date} - ${report.focus}</small>
      </button>
    `
    )
    .join("");

  document.querySelectorAll("[data-history-id]").forEach((item) => {
    item.addEventListener("click", () => {
      selectedHistoryId = item.dataset.historyId;
      renderHistory();
    });
  });

  renderHistoryDetail();
}

function renderHistoryDetail() {
  const report = historyReports.find((item) => item.id === selectedHistoryId) || historyReports[0];
  historyDetail.innerHTML = `
    <p class="eyebrow">Opened report</p>
    <h3>${report.title}</h3>
    <p>${report.summary}</p>
    <div class="insight-grid">
      <div>
        <span class="insight-label">Date</span>
        <strong>${report.date}</strong>
        <p>Archived from the Tech Care report history.</p>
      </div>
      <div>
        <span class="insight-label">Focus</span>
        <strong>${report.focus}</strong>
        <p>Use the input below to ask AI for deeper context.</p>
      </div>
      <div>
        <span class="insight-label">Actions</span>
        <strong>${report.actions.length} recommended</strong>
        <p>${report.actions[0]}</p>
      </div>
    </div>
    <h3>Saved recommendations</h3>
    <ol class="recommendations">
      ${report.actions.map((action) => `<li>${action}</li>`).join("")}
    </ol>
  `;
}

function answerQuestion(question, reportTitle) {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes("payment") || lowerQuestion.includes("payout")) {
    return `For ${reportTitle}, payment questions should be split into invoice adjustment, payout ETA, and reconciliation proof. The highest-impact follow-up is a seller-visible status explanation.`;
  }

  if (lowerQuestion.includes("catalog") || lowerQuestion.includes("sku")) {
    return `For ${reportTitle}, catalog friction is most actionable when the answer includes the rejected attribute, an example fix, and the queue that owns re-review.`;
  }

  if (lowerQuestion.includes("owner") || lowerQuestion.includes("action")) {
    return `For ${reportTitle}, assign one owner per recommendation and track repeat contact rate, escalation share, and time-to-next-action as the success metrics.`;
  }

  return `For ${reportTitle}, the strongest next step is to segment the report by seller tenure and contact driver, then compare repeat-contact reduction after the recommended support macro is launched.`;
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
    thinking.innerHTML = `<small>Report AI</small><p>${answerQuestion(question, reportTitle)}</p>`;
    target.scrollTop = target.scrollHeight;
  }, 650);
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    setRoute(link.dataset.route);
  });
});

routeButtons.forEach((button) => {
  button.addEventListener("click", () => setRoute(button.dataset.routeButton));
});

startAnalysisButton.addEventListener("click", () => {
  setRoute("analysis");
  setTimeout(() => objectiveInput.focus(), 100);
});

startFlowButton.addEventListener("click", startFlow);

approveButton.addEventListener("click", () => {
  const agent = agents[currentStep];
  addBubble("user", "Reviewer", `Approved ${agent.step}.`);
  currentStep += 1;
  updateStepIndicators();

  if (currentStep >= agents.length) {
    finishFlow();
    return;
  }

  runAgentStep();
});

cancelButton.addEventListener("click", cancelFlow);

reportQuestionForm.addEventListener("submit", (event) => {
  handleQuestion(event, reportQuestion, reportQa, "the final Tech Care intelligence brief");
});

historyQuestionForm.addEventListener("submit", (event) => {
  const report = historyReports.find((item) => item.id === selectedHistoryId) || historyReports[0];
  handleQuestion(event, historyQuestion, historyQa, report.title);
});

const initialRoute = window.location.hash.replace("#", "") || "home";
setRoute(document.getElementById(initialRoute) ? initialRoute : "home");
renderHistory();
