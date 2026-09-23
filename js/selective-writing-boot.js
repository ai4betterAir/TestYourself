(function () {
  function add() {
    const bar = document.querySelector(".streambar");
    if (!bar) return;
    if (!bar.querySelector('[data-stream="writing"]')) {
      const v = document.createElement("button");
      v.dataset.stream = "writing";
      v.textContent = "Writing Vocabulary";
      bar.appendChild(v);
    }
    if (!bar.querySelector('[data-stream="essay"]')) {
      const b = document.createElement("button");
      b.dataset.stream = "essay";
      b.textContent = "Writing";
      bar.appendChild(b);
      b.addEventListener("click", () => {
        document.querySelectorAll(".streambar button").forEach((x) => x.classList.toggle("active", x === b));
        ["practiceView", "mockView", "vocabLearn"].forEach((id) => {
          const n = document.getElementById(id);
          if (n) n.hidden = true;
        });
        if (window.SKILLUP_WRITING_WORKSHOP) window.SKILLUP_WRITING_WORKSHOP.show();
      });
    }
    bar.querySelectorAll('button:not([data-stream="essay"])').forEach((btn) => {
      if (btn.dataset.boundHide) return;
      btn.dataset.boundHide = "1";
      btn.addEventListener("click", () => {
        if (window.SKILLUP_WRITING_WORKSHOP) window.SKILLUP_WRITING_WORKSHOP.hide();
        const pv = document.getElementById("practiceView");
        if (pv && btn.dataset.stream !== "essay") pv.hidden = false;
      });
    });
  }
  add();
  setTimeout(add, 200);
  setTimeout(add, 800);
  setTimeout(add, 2000);
})();
