const home = document.getElementById("home");
const quiz = document.getElementById("quiz");
const done = document.getElementById("done");
const inputs = document.getElementById("inputs");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const checkBtn = document.getElementById("checkBtn");
const skipBtn = document.getElementById("skipBtn");
const timerEl = document.getElementById("timer");

let all = [];
let set = [];
let i = 0;
let partsCorrect = 0;
let partsTotal = 0;
let streak = 0;
let bestStreak = 0;
let name = "";
let mode = "practice";
let limitSec = 0;
let tick = null;
let left = 0;
let locked = false;
let log = [];
let lastMisses = [];

function shuffle(arr) {
  const a = arr.slice();
  for (let n = a.length - 1; n > 0; n--) {
    const j = Math.floor(Math.random() * (n + 1));
    [a[n], a[j]] = [a[j], a[n]];
  }
  return a;
}

function num(v) {
  if (v === "" || v == null) return NaN;
  return Number(String(v).replace(/[$,\s]/g, ""));
}

function same(a, b) {
  return Number.isFinite(a) && Math.abs(a - b) < 1e-9;
}

Promise.all([
  fetch("data/questions.json").then((r) => (r.ok ? r.json() : null)).catch(() => null),
  fetch("data/questions-1-101.json").then((r) => r.json()).catch(() => ({ questions: [] })),
  fetch("data/questions-102-202.json").then((r) => r.json()).catch(() => ({ questions: [] }))
]).then(([full, a, b]) => {
  all = full && full.questions && full.questions.length
    ? full.questions
    : [...(a.questions || []), ...(b.questions || [])];
  const skills = [...new Set(all.flatMap((q) => q.skills || []))].sort();
  const sel = document.getElementById("skillSelect");
  skills.forEach((s) => {
    const o = document.createElement("option");
    o.value = s;
    o.textContent = s;
    sel.appendChild(o);
  });
}).catch(() => { feedback.textContent = "Could not load questions"; });

function buildSet(fromMisses) {
  name = document.getElementById("playerName").value.trim();
  mode = document.getElementById("modeSelect").value;
  limitSec = Number(document.getElementById("timerSec").value) || 0;
  if (fromMisses && lastMisses.length) {
    set = lastMisses.map((m) => all.find((q) => q.id === m.id)).filter(Boolean);
  } else {
    const start = Math.max(1, Number(document.getElementById("startFrom").value) || 1);
    const skill = document.getElementById("skillSelect").value;
    let pool = all.filter((q) => q.id >= start);
    if (skill !== "all") pool = pool.filter((q) => (q.skills || []).includes(skill));
    if (document.getElementById("orderSelect").value === "shuffle") pool = shuffle(pool);
    const countVal = document.getElementById("countSelect").value;
    const n = countVal === "all" ? pool.length : Number(countVal);
    set = pool.slice(0, n);
  }
  i = 0;
  partsCorrect = 0;
  partsTotal = 0;
  streak = 0;
  bestStreak = 0;
  log = [];
  return set.length > 0;
}

function goQuiz() {
  home.classList.add("hidden");
  done.classList.add("hidden");
  quiz.classList.remove("hidden");
  show();
}

document.getElementById("startBtn").onclick = () => {
  if (!buildSet(false)) return;
  goQuiz();
};

document.getElementById("retryMissBtn").onclick = () => {
  if (!buildSet(true)) return;
  goQuiz();
};

function stopTimer() {
  if (tick) clearInterval(tick);
  tick = null;
}

function startTimer() {
  stopTimer();
  if (!limitSec) {
    timerEl.textContent = "";
    return;
  }
  left = limitSec;
  timerEl.textContent = left + "s";
  tick = setInterval(() => {
    left -= 1;
    timerEl.textContent = left + "s";
    if (left <= 0) {
      stopTimer();
      mark(true);
    }
  }, 1000);
}

function show() {
  const q = set[i];
  locked = false;
  document.getElementById("progress").textContent = `${i + 1}/${set.length}  #${q.id}`;
  document.getElementById("score").textContent = `${partsCorrect}/${partsTotal || 0}  streak ${streak}`;
  document.getElementById("qTitle").textContent = `Question ${q.id}`;
  document.getElementById("skills").textContent = (q.skills || []).join(" · ");
  document.getElementById("qText").textContent = q.text;
  document.getElementById("qPrompt").textContent = q.prompt;
  inputs.innerHTML = "";
  q.answers.forEach((_, idx) => {
    const inp = document.createElement("input");
    inp.type = "number";
    inp.step = "any";
    inp.className = "ans";
    inp.id = "a" + idx;
    inp.placeholder = q.answers.length > 1 ? (idx === 0 ? "(a)" : "(b)") : "Answer";
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!locked) mark(false);
        else next();
      }
    });
    inputs.appendChild(inp);
  });
  feedback.textContent = "";
  feedback.className = "";
  nextBtn.classList.add("hidden");
  checkBtn.classList.remove("hidden");
  skipBtn.classList.toggle("hidden", mode === "exam");
  document.getElementById("a0").focus();
  startTimer();
}

function readGiven(q) {
  return q.answers.map((_, idx) => num(document.getElementById("a" + idx).value));
}

function mark(timedOut) {
  if (locked) return;
  locked = true;
  stopTimer();
  const q = set[i];
  const given = readGiven(q);
  const flags = q.answers.map((ans, idx) => same(given[idx], ans));
  const nOk = flags.filter(Boolean).length;
  partsCorrect += nOk;
  partsTotal += q.answers.length;
  const allOk = nOk === q.answers.length;
  if (allOk) {
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);
  } else streak = 0;
  log.push({ id: q.id, text: q.text, given, answers: q.answers, flags, timedOut });
  document.getElementById("score").textContent = `${partsCorrect}/${partsTotal}  streak ${streak}`;
  if (mode === "practice") {
    feedback.className = allOk ? "ok" : "bad";
    feedback.textContent = timedOut
      ? "Time up. Answer: " + q.answers.join(", ")
      : allOk
        ? (q.answers.length > 1 ? `Correct (${nOk}/${q.answers.length})` : "Correct")
        : `Answer: ${q.answers.join(", ")}  (${nOk}/${q.answers.length})`;
    q.answers.forEach((_, idx) => {
      document.getElementById("a" + idx).classList.add(flags[idx] ? "ok-box" : "bad-box");
    });
    checkBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");
    nextBtn.focus();
  } else {
    next();
  }
}

checkBtn.onclick = () => mark(false);
skipBtn.onclick = () => mark(false);
nextBtn.onclick = next;

function next() {
  i += 1;
  if (i >= set.length) finish();
  else show();
}

function finish() {
  stopTimer();
  quiz.classList.add("hidden");
  done.classList.remove("hidden");
  lastMisses = log.filter((r) => r.flags.some((f) => !f));
  const who = name ? name + ": " : "";
  const pct = partsTotal ? Math.round((100 * partsCorrect) / partsTotal) : 0;
  document.getElementById("summary").textContent =
    `${who}${partsCorrect}/${partsTotal} parts (${pct}%). Best streak ${bestStreak}. Missed ${lastMisses.length}.`;
  const ul = document.getElementById("review");
  ul.innerHTML = "";
  lastMisses.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = `#${r.id}: you ${r.given.map((v) => (Number.isFinite(v) ? v : "—")).join(", ")} · answer ${r.answers.join(", ")}`;
    ul.appendChild(li);
  });
  document.getElementById("retryNowBtn").classList.toggle("hidden", !lastMisses.length);
  document.getElementById("retryMissBtn").classList.toggle("hidden", !lastMisses.length);
}

document.getElementById("againBtn").onclick = () => {
  done.classList.add("hidden");
  home.classList.remove("hidden");
};

document.getElementById("retryNowBtn").onclick = () => {
  if (!buildSet(true)) return;
  goQuiz();
};
