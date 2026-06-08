const STORAGE_KEY = "stackwise.rulingArchive.v1";

const seedRulings = [
  {
    id: "seed-sheoldred-brainstorm",
    question: "Does [[Sheoldred, the Apocalypse]] make you gain life for every card drawn? If I cast Brainstorm to draw 3, do I gain 6 or 2 life?",
    answer:
      "What happens:\n\n1. You cast Brainstorm.\n2. Brainstorm resolves.\n3. You draw three cards.\n4. Sheoldred, the Apocalypse triggers three separate times, once for each card you drew.\n5. After Brainstorm fully finishes resolving, those three Sheoldred triggers go on the stack.\n6. Each trigger makes you gain 2 life.\n7. You gain 6 life total.\n\nEven though Brainstorm says \"draw three cards\" in one instruction, the game treats drawing multiple cards as that many individual card draws for triggered abilities like Sheoldred.",
    tags: ["Sheoldred, the Apocalypse", "Brainstorm", "draw", "triggered abilities", "life gain"],
    createdAt: "2026-06-08T00:00:00.000Z",
    updatedAt: "2026-06-08T00:00:00.000Z"
  }
];

let archive = [];
let selectedId = "";

const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setStatus(text) {
  $("#archiveStatus").textContent = text;
}

function makeId() {
  return `ruling-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadArchive() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const savedIds = new Set(saved.map((item) => item.id));
    archive = [...seedRulings.filter((item) => !savedIds.has(item.id)), ...saved];
  } catch {
    archive = [...seedRulings];
  }
  selectedId = archive[0]?.id || "";
}

function persistArchive() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(archive));
}

function tagsFromInput() {
  return $("#tagsInput")
    .value.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function titleFromQuestion(question) {
  const clean = question.replace(/\[\[|\]\]/g, "").trim();
  if (!clean) return "Untitled ruling";
  return clean.length > 86 ? `${clean.slice(0, 86)}...` : clean;
}

function selectedRuling() {
  return archive.find((ruling) => ruling.id === selectedId) || null;
}

function matchesSearch(ruling, search) {
  if (!search) return true;
  const haystack = [ruling.question, ruling.answer, ...(ruling.tags || [])].join(" ").toLowerCase();
  return haystack.includes(search.toLowerCase());
}

function renderArchiveList() {
  const search = $("#archiveSearch").value.trim();
  const filtered = archive.filter((ruling) => matchesSearch(ruling, search));
  $("#archiveCount").textContent = `${filtered.length} ruling${filtered.length === 1 ? "" : "s"}`;

  if (!filtered.length) {
    $("#archiveList").innerHTML = `<div class="empty-state">No saved rulings match that search.</div>`;
    return;
  }

  $("#archiveList").innerHTML = filtered
    .map(
      (ruling) => `
        <button class="archive-item ${ruling.id === selectedId ? "active" : ""}" type="button" data-ruling-id="${escapeHtml(ruling.id)}">
          <strong>${escapeHtml(titleFromQuestion(ruling.question))}</strong>
          <span>${escapeHtml((ruling.tags || []).slice(0, 4).join(", ") || "No tags")}</span>
        </button>
      `
    )
    .join("");
}

function renderPreview(ruling) {
  $("#previewQuestion").textContent = ruling?.question || "No question selected";
  $("#previewAnswer").innerHTML = ruling?.answer ? escapeHtml(ruling.answer).replaceAll("\n", "<br />") : "Saved rulings will appear here.";
  $("#previewTags").innerHTML = (ruling?.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
}

function renderEditor() {
  const ruling = selectedRuling();
  $("#editorTitle").textContent = ruling ? "Edit ruling" : "New ruling";
  $("#questionInput").value = ruling?.question || "";
  $("#answerInput").value = ruling?.answer || "";
  $("#tagsInput").value = (ruling?.tags || []).join(", ");
  $("#deleteRuling").disabled = !ruling;
  renderPreview(ruling);
  renderArchiveList();
}

function clearEditor() {
  selectedId = "";
  $("#editorTitle").textContent = "New ruling";
  $("#questionInput").value = "";
  $("#answerInput").value = "";
  $("#tagsInput").value = "";
  $("#deleteRuling").disabled = true;
  renderPreview(null);
  renderArchiveList();
  $("#questionInput").focus();
}

function saveRuling() {
  const question = $("#questionInput").value.trim();
  const answer = $("#answerInput").value.trim();
  const tags = tagsFromInput();

  if (!question || !answer) {
    setStatus("Question and answer required");
    return;
  }

  const now = new Date().toISOString();
  const existing = selectedRuling();

  if (existing) {
    existing.question = question;
    existing.answer = answer;
    existing.tags = tags;
    existing.updatedAt = now;
  } else {
    const ruling = {
      id: makeId(),
      question,
      answer,
      tags,
      createdAt: now,
      updatedAt: now
    };
    archive.unshift(ruling);
    selectedId = ruling.id;
  }

  persistArchive();
  renderEditor();
  setStatus("Ruling saved");
}

function deleteRuling() {
  const ruling = selectedRuling();
  if (!ruling) return;
  archive = archive.filter((item) => item.id !== ruling.id);
  selectedId = archive[0]?.id || "";
  persistArchive();
  renderEditor();
  setStatus("Ruling deleted");
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

async function copyCurrentRuling() {
  const ruling = selectedRuling();
  const question = $("#questionInput").value.trim();
  const answer = $("#answerInput").value.trim();
  const tags = tagsFromInput();
  const text = [`Question:\n${question || ruling?.question || ""}`, `Answer:\n${answer || ruling?.answer || ""}`, `Tags: ${tags.join(", ")}`].join("\n\n");
  await copyText(text);
  setStatus("Copied");
}

async function exportArchive() {
  const text = JSON.stringify(archive, null, 2);
  await copyText(text);
  setStatus("Archive copied as JSON");
}

function bindEvents() {
  $("#archiveSearch").addEventListener("input", renderArchiveList);
  $("#newRuling").addEventListener("click", clearEditor);
  $("#saveRuling").addEventListener("click", saveRuling);
  $("#deleteRuling").addEventListener("click", deleteRuling);
  $("#copyRuling").addEventListener("click", copyCurrentRuling);
  $("#exportArchive").addEventListener("click", exportArchive);

  ["questionInput", "answerInput", "tagsInput"].forEach((id) => {
    $(`#${id}`).addEventListener("input", () => {
      renderPreview({
        question: $("#questionInput").value,
        answer: $("#answerInput").value,
        tags: tagsFromInput()
      });
    });
  });

  $("#archiveList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-ruling-id]");
    if (!button) return;
    selectedId = button.dataset.rulingId;
    renderEditor();
    setStatus("Ruling loaded");
  });
}

loadArchive();
bindEvents();
renderEditor();
