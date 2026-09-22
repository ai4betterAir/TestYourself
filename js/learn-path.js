(function () {
  const years = [
    { id: "K", label: "Kindy" },
    { id: "1", label: "Year 1" },
    { id: "2", label: "Year 2" },
    { id: "3", label: "Year 3" },
    { id: "4", label: "Year 4" },
    { id: "5", label: "Year 5" },
    { id: "6", label: "Year 6" }
  ];

  const catalog = {
    maths: {
      name: "Maths",
      sections: [
        {
          id: "number",
          name: "Number & Algebra",
          items: [
            { id: "number", name: "Number sense" },
            { id: "addition", name: "Addition" },
            { id: "subtraction", name: "Subtraction" },
            { id: "multiplication", name: "Multiplication" },
            { id: "division", name: "Division" },
            { id: "fractions", name: "Fractions" },
            { id: "decimals", name: "Decimals" },
            { id: "algebra", name: "Patterns & algebra" }
          ]
        },
        {
          id: "measure",
          name: "Measurement & Space",
          items: [
            { id: "money", name: "Money" },
            { id: "time", name: "Time" },
            { id: "length", name: "Length" },
            { id: "area", name: "Area" },
            { id: "shapes2d", name: "2D shapes" },
            { id: "shapes3d", name: "3D objects" }
          ]
        },
        {
          id: "data",
          name: "Statistics & Probability",
          items: [
            { id: "data", name: "Data & graphs" },
            { id: "chance", name: "Chance" }
          ]
        },
        {
          id: "problem",
          name: "Problem Solving",
          items: [
            { id: "wordproblems", name: "Word problems" },
            { id: "mixed", name: "Mixed challenge" }
          ]
        }
      ]
    },
    vocabulary: {
      name: "Vocabulary",
      pages: {
        "1": "vocabulary-year1-stories.html",
        "2": "vocabulary-year2.html",
        "3": "vocabulary-year3.html",
        "4": "vocabulary-year4.html",
        "5": "vocabulary-year5.html",
        "6": "vocabulary-year6.html",
        K: "vocabulary-year1-stories.html"
      },
      sections: [
        {
          id: "meaning",
          name: "Word meaning",
          items: [
            { id: "meanings", name: "Meanings" },
            { id: "context", name: "Words in context" }
          ]
        },
        {
          id: "relations",
          name: "Word relationships",
          items: [
            { id: "synonyms", name: "Synonyms" },
            { id: "antonyms", name: "Antonyms" }
          ]
        },
        {
          id: "structure",
          name: "Spelling & structure",
          items: [
            { id: "spelling", name: "Spelling" },
            { id: "roots", name: "Roots & word parts" }
          ]
        }
      ]
    },
    english: {
      name: "English",
      sections: [
        {
          id: "reading",
          name: "Reading",
          items: [
            { id: "reading", name: "Guided reading lessons" },
            { id: "library", name: "Reading library" }
          ]
        },
        {
          id: "language",
          name: "Language",
          items: [
            { id: "grammar", name: "Grammar" },
            { id: "spelling", name: "Spelling" }
          ]
        },
        {
          id: "writing",
          name: "Writing",
          items: [{ id: "writing", name: "Writing & planning" }]
        }
      ]
    },
    selective: {
      name: "Selective",
      years: ["5", "6"],
      sections: [
        {
          id: "reasoning",
          name: "Mathematical Reasoning",
          items: [{ id: "maths", name: "Start practice" }]
        },
        {
          id: "thinking",
          name: "Thinking Skills",
          items: [{ id: "thinking", name: "Start practice" }]
        },
        {
          id: "reading",
          name: "Reading",
          items: [{ id: "reading", name: "Start practice" }]
        }
      ]
    }
  };

  function href(subject, year, section, item) {
    if (subject === "maths") {
      return `practice.html?grade=${encodeURIComponent(year)}&topic=${encodeURIComponent(item.id)}&focus=1`;
    }
    if (subject === "english") {
      if (item.id === "library" && year === "1") return "english-year1-reading.html";
      if (item.id === "library" && year === "2") return "english-year2-reading.html";
      return `english-practice.html?grade=${encodeURIComponent(year)}&skill=${encodeURIComponent(item.id === "library" ? "reading" : item.id)}`;
    }
    if (subject === "vocabulary") {
      const page = catalog.vocabulary.pages[year] || "vocabulary.html";
      return `${page}#${item.id}`;
    }
    return "selective-practice.html";
  }

  function render() {
    const yearBox = document.getElementById("yearPicker");
    const subjectBox = document.getElementById("subjectPicker");
    const sectionBox = document.getElementById("sectionPanel");
    if (!yearBox || !subjectBox || !sectionBox) return;

    const state = {
      year: localStorage.getItem("skillup-year") || "5",
      subject: localStorage.getItem("skillup-subject") || "",
      section: ""
    };

    function paintYears() {
      yearBox.innerHTML = years
        .map(
          (y) =>
            `<button type="button" class="pick ${state.year === y.id ? "on" : ""}" data-year="${y.id}">${y.label}</button>`
        )
        .join("");
      yearBox.querySelectorAll("button").forEach((b) => {
        b.onclick = () => {
          state.year = b.dataset.year;
          state.section = "";
          localStorage.setItem("skillup-year", state.year);
          paintYears();
          paintSubjects();
          paintSections();
        };
      });
    }

    function paintSubjects() {
      const keys = ["maths", "vocabulary", "english", "selective"];
      subjectBox.innerHTML = keys
        .map((k) => {
          const disabled = k === "selective" && !["5", "6"].includes(state.year);
          return `<button type="button" class="pick subject ${k} ${state.subject === k ? "on" : ""}" data-subject="${k}" ${disabled ? "disabled" : ""}>${catalog[k].name}</button>`;
        })
        .join("");
      subjectBox.querySelectorAll("button").forEach((b) => {
        b.onclick = () => {
          state.subject = b.dataset.subject;
          state.section = "";
          localStorage.setItem("skillup-subject", state.subject);
          paintSubjects();
          paintSections();
        };
      });
    }

    function paintSections() {
      if (!state.subject) {
        sectionBox.innerHTML = `<p class="hint">Choose a year and a subject. Main sections will appear here.</p>`;
        return;
      }
      const course = catalog[state.subject];
      sectionBox.innerHTML = `<div class="section-grid">${course.sections
        .map((s) => {
          const open = state.section === s.id;
          return `<article class="main-sec ${open ? "open" : ""}" data-section="${s.id}">
            <button type="button" class="sec-btn">${s.name}</button>
            <div class="subs" ${open ? "" : "hidden"}>
              ${s.items
                .map(
                  (item) =>
                    `<a class="sub" href="${href(state.subject, state.year, s.id, item)}">${item.name} →</a>`
                )
                .join("")}
            </div>
          </article>`;
        })
        .join("")}</div>`;
      sectionBox.querySelectorAll(".sec-btn").forEach((btn) => {
        btn.onclick = () => {
          const id = btn.parentElement.dataset.section;
          state.section = state.section === id ? "" : id;
          paintSections();
        };
      });
    }

    paintYears();
    paintSubjects();
    paintSections();
  }

  document.addEventListener("DOMContentLoaded", render);
})();
