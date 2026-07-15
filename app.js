const ELEMENTS = [
  {
    id: "CSB1",
    name: "Establishing and communicating learning goals",
    keywords: ["learning goal", "objective", "standard", "target"],
    tips: [
      "Co-construct the learning goal with students and reference it visually throughout the lesson.",
      "Connect the goal explicitly to prior learning and upcoming units to build coherence.",
      "Invite students to restate the goal in their own words to check for understanding."
    ]
  },
  {
    id: "CSB2",
    name: "Engaging students",
    keywords: ["engaged", "participation", "discussion", "hands-on", "collaborative"],
    tips: [
      "Use brief, structured turn-and-talks to increase active participation.",
      "Embed low-risk response formats to surface thinking from all students.",
      "Vary modalities to sustain attention and access."
    ]
  },
  {
    id: "CSB3",
    name: "Checking for understanding",
    keywords: ["check for understanding", "CFU", "questioning", "monitoring", "formative"],
    tips: [
      "Plan intentional CFU moments aligned to key concepts.",
      "Use open-ended prompts that require explanation, not just recall.",
      "Track patterns in student responses to adjust pacing and re-teaching."
    ]
  },
  {
    id: "CSB4",
    name: "Feedback and formative assessment",
    keywords: ["feedback", "rubric", "criteria", "assessment", "exit ticket"],
    tips: [
      "Anchor feedback to clear success criteria.",
      "Balance corrective feedback with reinforcing feedback that names strengths.",
      "Provide time in class for students to act on feedback."
    ]
  }
];

function buildCoachingScript(stance, elements) {
  const intro =
    stance === "directive"
      ? "I’d like to focus our next steps on a few high-leverage Marzano elements I observed."
      : stance === "facilitative"
      ? "Let’s reflect together on some Marzano elements that surfaced in your lesson."
      : "I’d like to partner with you around a few Marzano elements that can amplify student learning.";

  const lines = elements.map(el => `• ${el.name} (${el.id})`);
  return `${intro}\n\n${lines.join("\n")}\n\nWhich of these feels most important to you right now, and why?`;
}

function detectElements(notes) {
  const text = notes.toLowerCase();
  const matched = [];

  ELEMENTS.forEach(el => {
    const hit = el.keywords.some(k => text.includes(k));
    if (hit) matched.push(el);
  });

  if (matched.length === 0) {
    return [ELEMENTS[0], ELEMENTS[1]];
  }
  return matched;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function generateArtifactHTML(notes, stance) {
  const elements = detectElements(notes);

  let html = `
    <h2>Marzano-Aligned Coaching Artifact</h2>
    <div class="artifact-section">
      <strong>Observation summary:</strong>
      <p>${escapeHtml(notes.trim()).replace(/\n/g, "<br>")}</p>
    </div>
    <div class="artifact-section">
      <strong>Focused Marzano elements:</strong>
      <div>
        ${elements
          .map(el => `<span class="element-tag">${el.id}</span> ${el.name}`)
          .join("<br>")}
      </div>
    </div>
    <div class="artifact-section">
      <strong>Targeted coaching tips (1–3 per element):</strong>
  `;

  elements.forEach(el => {
    const tips = el.tips.slice(0, 3);
    html += `
      <div style="margin-top:0.5rem;">
        <em>${el.name}</em>
        <ul class="tip-list">
          ${tips.map(t => `<li>${t}</li>`).join("")}
        </ul>
      </div>
    `;
  });

  const script = buildCoachingScript(stance, elements);

  html += `
    </div>
    <div class="artifact-section">
      <strong>Coaching conversation script:</strong>
      <div class="script-block">${escapeHtml(script)}</div>
    </div>
  `;

  return html;
}

const notesEl = document.getElementById("notes");
const stanceEl = document.getElementById("stance");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const printBtn = document.getElementById("printBtn");
const outputEl = document.getElementById("output");

generateBtn.addEventListener("click", () => {
  const notes = notesEl.value.trim();
  if (!notes) {
    alert("Please paste observation notes first.");
    return;
  }

  const stance = stanceEl.value;
  const artifactHTML = generateArtifactHTML(notes, stance);
  outputEl.innerHTML = artifactHTML;

  copyBtn.disabled = false;
  printBtn.disabled = false;
});

copyBtn.addEventListener("click", async () => {
  const html = outputEl.innerHTML;
  try {
    await navigator.clipboard.writeText(html);
    alert("Coaching artifact HTML copied to clipboard.");
  } catch {
    alert("Unable to copy. You can still select and copy manually.");
  }
});

printBtn.addEventListener("click", () => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head><title>Marzano Coaching Artifact</title></head>
      <body>${outputEl.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
});
