const theme=document.createElement('link');theme.rel='stylesheet';theme.href='css/theme.css';document.head.appendChild(theme);

const state = {
  grade: "Year 5",
  path: "Learn & Practice"
};

const gradePills = [...document.querySelectorAll("#gradePills button")];
const pathCards = [...document.querySelectorAll(".path-card")];
const gradeCards = [...document.querySelectorAll("[data-grade-card]")];
const selectedPath = document.getElementById("selectedPath");
const continueBtn = document.getElementById("continueBtn");
const toast = document.getElementById("toast");
const menuBtn = document.querySelector(".menu-btn");
const mainNav = document.querySelector(".main-nav");

function updateSelection() {
  selectedPath.textContent = `${state.grade} · ${state.path}`;
}

function selectGrade(grade) {
  state.grade = grade;
  gradePills.forEach((button) => {
    const active = button.dataset.grade === grade;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  updateSelection();
}

function selectPath(path) {
  state.path = path;
  pathCards.forEach((button) => {
    const active = button.dataset.path === path;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  updateSelection();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
}

gradePills.forEach((button) => {
  button.addEventListener("click", () => selectGrade(button.dataset.grade));
});

pathCards.forEach((button) => {
  button.addEventListener("click", () => selectPath(button.dataset.path));
});

gradeCards.forEach((card) => {
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Choose ${card.dataset.gradeCard}`);
  const choose = () => {
    selectGrade(card.dataset.gradeCard);
    document.getElementById("quick-start").scrollIntoView({ behavior: "smooth" });
  };
  card.addEventListener("click", choose);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose();
    }
  });
});

continueBtn.addEventListener("click", () => {
  if (state.grade === "Year 5" && state.path === "Learn & Practice") {
    window.location.href = "YR5/index.html";
  } else {
    showToast(`${state.grade} · ${state.path} selected. More learning modules are being added.`);
  }
});

const fractionCard = [...document.querySelectorAll(".topic-card")].find((card) =>
  card.querySelector("h3")?.textContent.includes("Fractions")
);

if (fractionCard) {
  fractionCard.style.cursor = "pointer";
  fractionCard.tabIndex = 0;
  fractionCard.addEventListener("click", () => {
    window.location.href = "YR5/fractions.html";
  });
  fractionCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter") window.location.href = "YR5/fractions.html";
  });
}

const problemCard = [...document.querySelectorAll(".topic-card")].find((card) =>
  card.querySelector("h3")?.textContent.includes("Problem Solving")
);

if (problemCard) {
  problemCard.style.cursor = "pointer";
  problemCard.tabIndex = 0;
  problemCard.addEventListener("click", () => {
    window.location.href = "word-problems.html";
  });
  problemCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter") window.location.href = "word-problems.html";
  });
}

document.querySelectorAll("[data-test]").forEach((button) => {
  button.addEventListener("click", () => {
    const test = button.dataset.test;
    state.path = "Test Preparation";
    if (test.includes("NAPLAN")) state.grade = "Year 5";
    if (test.includes("Opportunity")) state.grade = "Year 4";
    if (test.includes("Selective")) state.grade = "Year 6";
    selectGrade(state.grade);
    selectPath(state.path);
    showToast(`${test} selected. Practice modules will be connected to this pathway.`);
  });
});

menuBtn.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  menuBtn.textContent = open ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  });
});

updateSelection();