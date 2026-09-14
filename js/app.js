const home = document.getElementById("home");
const quiz = document.getElementById("quiz");
const done = document.getElementById("done");
const inputs = document.getElementById("inputs");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const checkBtn = document.getElementById("checkBtn");

let all = [];
let set = [];
let i = 0;
let correct = 0;
let name = "";

fetch("data/questions.json")
  .then((r) => r.json())
  .then((data) => { all = data.questions; })
  .catch(() => { feedback.textContent = "Could not load questions.json"; });

document.getElementById("startBtn").onclick = () => {
  name = document.getElementById("playerName").value.trim();
  const start = Math.max(1, Number(document.getElementById("startFrom").value) || 1);
  const countVal = document.getElementById("countSelect").value;
  const pool = all.filter((q) => q.id >= start);
  const n = countVal === "all" ? pool.length : Number(countVal);
  set = pool.slice(0, n);
  i = 0;
  correct = 0;
  if (!set.length) return;
  home.classList.add("hidden");
  done.classList.add("hidden");
  quiz.classList.remove("hidden");
  show();
};

function show() {
  const q = set[i];
  document.getElementById("progress").textContent = `Question ${i + 1} of ${set.length}  (#${q.id})`;
  document.getElementById("score").textContent = `Score ${correct}`;
  document.getElementById("qTitle").textContent = `Question ${q.id}`;
  document.getElementById("qText").textContent = q.text;
  document.getElementById("qPrompt").textContent = q.prompt;
  inputs.innerHTML = "";
  q.answers.forEach((_, idx) => {
    const inp = document.createElement("input");
    inp.type = "number";
    inp.className = "ans";
    inp.id = "a" + idx;
    inp.placeholder = q.answers.length > 1 ? (idx === 0 ? "(a)" : "(b)") : "Answer";
    inputs.appendChild(inp);
  });
  feedback.textContent = "";
  feedback.className = "";
  nextBtn.classList.add("hidden");
  checkBtn.classList.remove("hidden");
  document.getElementById("a0").focus();
}

checkBtn.onclick = () => {
  const q = set[i];
  const given = q.answers.map((_, idx) => Number(document.getElementById("a" + idx).value));
  const ok = given.every((v, idx) => v === q.answers[idx]);
  if (ok) {
    correct += 1;
    feedback.textContent = "Correct";
    feedback.className = "ok";
  } else {
    feedback.textContent = "Answer: " + q.answers.join(", ");
    feedback.className = "bad";
  }
  document.getElementById("score").textContent = `Score ${correct}`;
  checkBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");
};

nextBtn.onclick = () => {
  i += 1;
  if (i >= set.length) finish();
  else show();
};

function finish() {
  quiz.classList.add("hidden");
  done.classList.remove("hidden");
  const who = name ? name + ", " : "";
  document.getElementById("summary").textContent =
    `${who}you scored ${correct} out of ${set.length}.`;
}

document.getElementById("againBtn").onclick = () => {
  done.classList.add("hidden");
  home.classList.remove("hidden");
};
