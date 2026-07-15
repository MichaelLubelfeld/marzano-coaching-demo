const prompts = {
    artifact: `Generate a full FTEM-aligned coaching artifact based on the Florida Marzano Focused Teacher Evaluation Model. Map evidence to FTEM elements, include Focus Statements, Desired Effects, rubric level, coaching tips, and a micro-practice.`,
    elements: `Analyze these observation notes using the Florida Marzano FTEM model. Identify the most relevant FTEM elements, explain the Desired Effect, and provide actionable coaching tips.`,
    script: `Create a 90–120 second FTEM-aligned coaching script for a post-observation conversation. Use nonjudgmental language, reference Desired Effects, and include one actionable next step.`
};

function openCopilot365(type) {
    const url = `https://copilot.microsoft.com/?q=${encodeURIComponent(prompts[type])}`;
    window.open(url, "_blank");
}

function openCopilotBing(type) {
    const url = `https://copilot.bing.com/?q=${encodeURIComponent(prompts[type])}`;
    window.open(url, "_blank");
}

function copyPrompt(type) {
    navigator.clipboard.writeText(prompts[type]);
    alert("Prompt copied to clipboard!");
}
