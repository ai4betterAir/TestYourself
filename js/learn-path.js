(function () {
  const years = [
    { id: "K", label: "Kindy" }, { id: "1", label: "Year 1" }, { id: "2", label: "Year 2" },
    { id: "3", label: "Year 3" }, { id: "4", label: "Year 4" }, { id: "5", label: "Year 5" }, { id: "6", label: "Year 6" }
  ];
  const vocabPages = { "1": "vocabulary-year1-stories.html", "2": "vocabulary-year2.html", "3": "vocabulary-year3.html", "4": "vocabulary-year4.html", "5": "vocabulary-year5.html", "6": "vocabulary-year6.html", K: "vocabulary-year1-stories.html" };
  const catalog = {
    maths: { name: "Maths", sections: [] },
    vocabulary: { name: "Vocabulary", pages: vocabPages, sections: [] },
    english: { name: "English", sections: [] },
    selective: { name: "Selective", years: ["5", "6"], sections: [] }
  };

  function subjectUrl(subject, year) {
    if (subject === "maths") return "practice.html?grade=" + encodeURIComponent(year) + "&focus=1";
    if (subject === "english") return "english-practice.html?grade=" + encodeURIComponent(year);
    if (subject === "vocabulary") return vocabPages[year] || "vocabulary.html";
    return "selective-practice.html?grade=" + encodeURIComponent(year);
  }

  function render() {
    const yearBox = document.getElementById("yearPicker");
    const subjectBox = document.getElementById("subjectPicker");
    const sectionBox = document.getElementById("sectionPanel");
    if (!yearBox || !subjectBox || !sectionBox) return;
    const state = {
      year: localStorage.getItem("skillup-year") || "5",
      subject: localStorage.getItem("skillup-subject") || ""
    };

    function paintYears() {
      yearBox.innerHTML = years.map((y) => `<button type="button" class="pick ${state.year === y.id ? "on" : ""}" data-year="${y.id}">${y.label}</button>`).join("");
      yearBox.querySelectorAll("button").forEach((b) => {
        b.onclick = () => {
          state.year = b.dataset.year;
          localStorage.setItem("skillup-year", state.year);
          paintYears();
          paintSubjects();
          paintHint();
        };
      });
    }

    function paintSubjects() {
      const keys = ["maths", "vocabulary", "english", "selective"];
      subjectBox.innerHTML = keys.map((k) => {
        const disabled = k === "selective" && !["5", "6"].includes(state.year);
        return `<button type="button" class="pick subject ${k} ${state.subject === k ? "on" : ""}" data-subject="${k}" ${disabled ? "disabled" : ""}>${catalog[k].name}</button>`;
      }).join("");
      subjectBox.querySelectorAll("button").forEach((b) => {
        b.onclick = () => {
          state.subject = b.dataset.subject;
          localStorage.setItem("skillup-subject", state.subject);
          location.href = subjectUrl(state.subject, state.year);
        };
      });
    }

    function paintHint() {
      sectionBox.innerHTML = `<p class="hint">Pick a subject. Maths, Vocabulary, English and Selective each open their main section page — same layout as Selective.</p>`;
    }

    paintYears();
    paintSubjects();
    paintHint();
  }

  document.addEventListener("DOMContentLoaded", render);
})();
