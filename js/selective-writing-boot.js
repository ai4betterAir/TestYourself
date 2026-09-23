(function () {
  function add() {
    const bar = document.querySelector(".streambar");
    if (!bar || bar.querySelector('[data-stream="essay"]')) return;
    const b = document.createElement("button");
    b.dataset.stream = "essay";
    b.textContent = "Writing";
    bar.appendChild(b);
    b.addEventListener("click", () => {
      document.querySelectorAll(".streambar button").forEach((x) => x.classList.toggle("active", x === b));
      ["practiceView", "mockView", "vocabLearn"].forEach((id) => { const n = document.getElementById(id); if (n) n.hidden = true; });
      if (window.SKILLUP_WRITING_WORKSHOP) window.SKILLUP_WRITING_WORKSHOP.show();
    });
    bar.querySelectorAll('button:not([data-stream="essay"])').forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.SKILLUP_WRITING_WORKSHOP) window.SKILLUP_WRITING_WORKSHOP.hide();
        const pv = document.getElementById("practiceView"); if (pv) pv.hidden = false;
      });
    });
  }
  add();
  setTimeout(add, 500);
})();
