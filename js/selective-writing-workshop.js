(function () {
  const TOPICS = [
    { id: "screens", type: "persuasive", title: "Screens before bed", prompt: "Should children be allowed screens in the hour before bedtime? Write to persuade a parent audience.", form: "Persuasive essay", keys: ["screen", "phone", "bed", "sleep", "night", "parent"] },
    { id: "homework", type: "persuasive", title: "Weekend homework", prompt: "Homework should not be set on weekends. Write to persuade your school principal.", form: "Persuasive letter", keys: ["homework", "weekend", "principal", "rest", "family"] },
    { id: "park", type: "persuasive", title: "A new park", prompt: "Your council will either build a new playground or extra car parks. Write to persuade the council.", form: "Persuasive letter", keys: ["park", "playground", "council", "car", "children"] },
    { id: "uniform", type: "discursive", title: "School uniform", prompt: "Some people say uniforms build belonging. Others say they hide individuality. Explore both sides, then give a reasoned view.", form: "Discursive essay", keys: ["uniform", "belong", "individual", "school"] },
    { id: "wrong", type: "discursive", title: "When things go wrong", prompt: "The greatest discoveries happen when things go wrong. Explore this idea.", form: "Discursive / reflective", keys: ["wrong", "discover", "mistake", "fail", "learn"] },
    { id: "door", type: "narrative", title: "The doorway", prompt: "Write a story inspired by a glowing doorway at the edge of a quiet street at dusk.", form: "Narrative", keys: ["door", "street", "glow", "dusk", "light"] },
    { id: "change", type: "narrative", title: "A changed view", prompt: "Write about a moment that changed how you saw someone.", form: "Narrative", keys: ["saw", "changed", "moment", "noticed"] },
    { id: "speech", type: "speech", title: "One small change", prompt: "Write a short speech to Year 6: one small school change that would help students learn better.", form: "Speech", keys: ["year", "school", "change", "learn", "class"] }
  ];
  const SECTIONS = [
    { id: "intro", label: "Introduction", min: 60, max: 90, hint: "Hook + position + preview of two reasons." },
    { id: "body", label: "Body", min: 120, max: 180, hint: "PEEL: point, evidence, explain, link." },
    { id: "end", label: "Conclusion", min: 50, max: 80, hint: "Restate. Why it matters. No new idea." },
    { id: "full", label: "Full piece", min: 300, max: 450, hint: "300–450 words. Beginning, middle, end." }
  ];
  let currentSectionId = "intro";
  const JOINERS = ["eventually","finally","initially","meanwhile","consequently","therefore","thus","however","although","whereas","nevertheless","furthermore","moreover","in addition","for example","for instance","fortunately","unfortunately","obviously","clearly","importantly"];
  const WEAK = /^(very|really|good|bad|nice|stuff|things|sad|happy|said|try|understand)$/i;
  const TYPOS = { teh:"the", recieve:"receive", definately:"definitely", seperate:"separate", grammer:"grammar", becuase:"because", thier:"their", beleive:"believe", writting:"writing", alot:"a lot", dont:"don't", cant:"can't", wont:"won't", doesnt:"doesn't", didnt:"didn't", isnt:"isn't", theyre:"they're", youre:"you're" };
  const FRAG_START = /^(so that|so we|because|although|which|who|when|if|and then|and we)\b/i;
  const words = (t) => (t.trim().match(/\b[\w'-]+\b/g) || []).length;
  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  function analyse(text, topic) {
    const issues = [];
    const low = text.toLowerCase();
    const n = words(text);
    let html = "";
    let prev = "";
    let start = true;
    text.split(/(\s+|[^\w']+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { html += part; return; }
      if (/^[^\w']+$/.test(part)) {
        html += esc(part);
        if (/[.!?]/.test(part)) start = true;
        return;
      }
      const key = part.toLowerCase();
      let cls = "", title = "";
      if (TYPOS[key]) { cls = "mark-spell"; title = "Spelling: " + TYPOS[key]; issues.push({ type: "spell", tip: part + " → " + TYPOS[key], word: part }); }
      if (!cls && /^(she|he|they|it|her|him)$/i.test(part) && n < 25) { cls = "mark-gram"; title = "This pronoun has no person named yet"; issues.push({ type: "gram", tip: "“" + part + "” has no clear person. Name who you mean." }); }
      if (!cls && WEAK.test(key)) { cls = "mark-weak"; title = "Vague word"; issues.push({ type: "weak", tip: "“" + part + "” is vague." }); }
      if (!cls && start && /^[a-z]/.test(part)) { cls = "mark-punct"; title = "Capital letter needed"; issues.push({ type: "punct", tip: "Capitalise “" + part + "”." }); }
      if (cls) html += "<mark class=\"" + cls + "\" title=\"" + esc(title) + "\">" + esc(part) + "</mark>";
      else html += esc(part);
      prev = part; start = false;
    });
    if (FRAG_START.test(text.trim())) {
      issues.push({ type: "gram", tip: "This opening is a fragment. “" + text.trim().slice(0, 40) + "…” cannot stand as a full sentence. Add a main clause: who does what." });
      html = "<mark class=\"mark-gram\" title=\"Sentence fragment\">" + html + "</mark>";
    }
    if (text.trim() && !/[.!?]$/.test(text.trim())) issues.push({ type: "punct", tip: "Add a full stop, question mark or exclamation mark at the end." });
    const hits = (topic.keys || []).filter((k) => low.includes(k));
    if (text.trim() && hits.length === 0) issues.push({ type: "task", tip: "This text does not mention the topic (“" + topic.title + "”). Markers score task first. Use words from the prompt." });
    if (n > 0 && n < 12) issues.push({ type: "task", tip: "Only " + n + " words — there is no position, reason or example yet." });
    return { html, issues, hits, n };
  }

  function specificFixes(text, topic, sec) {
    const t = text.trim() || "(empty)";
    const rewrite = stance(topic);
    const out = [];
    if (FRAG_START.test(t)) {
      out.push("Your line starts with a joining tag and never finishes the thought. Rewrite as a full sentence, e.g. “Parents should switch screens off before bed so children can sleep well.”");
    }
    if (/\b(she|he|they)\b/i.test(t) && words(t) < 25) {
      out.push("“She/he/they” is unclear. Name the person: a Year 6 student, a parent, or you.");
    }
    if ((topic.keys || []).every((k) => !t.toLowerCase().includes(k))) {
      out.push("Stay on this prompt: “" + topic.prompt + "” Your sentence never names that issue.");
    }
    if (sec.id === "intro" || sec.id === "full") {
      out.push("A tighter opening for this topic: “" + hook(topic) + " " + rewrite + "”");
    }
    if (sec.id === "body") {
      out.push("Turn your idea into PEEL for this topic. Point: " + rewrite + " Example: one specific evening at home. Explain how that example supports the point. Link back with Therefore.");
    }
    if (sec.id === "end") {
      out.push("Close on this topic only: “In short, " + rewrite + " Consequently, families can protect tomorrow’s learning tonight.”");
    }
    if (!out.length) out.push("Keep the meaning, but name the topic and finish the sentence.");
    return out.slice(0, 3);
  }

  function build() {
    if (document.getElementById("writeWorkshop")) return;
    const host = document.querySelector(".wrap") || document.querySelector("main");
    if (!host) return;
    const box = document.createElement("section");
    box.id = "writeWorkshop";
    box.hidden = true;
    box.innerHTML = `<div class="write-head"><h2>Selective Writing workshop</h2><p>Check now comments on <em>your</em> sentences: task, fragment, vague pronoun, spelling and punctuation.</p></div><label class="write-label">Topic</label><select id="writeTopic"></select><p class="write-prompt" id="writePrompt"></p><div class="write-secs" id="writeSecs"></div><p class="write-hint" id="writeHint"></p><div class="write-count"><b id="writeWords">0</b> words · target <span id="writeTarget">60–90</span></div><textarea id="writeBox" rows="12" placeholder="Type here…"></textarea><div class="write-actions"><button type="button" class="check" id="writeCheck">Check this section</button><button type="button" class="next" id="writeClear">Clear</button></div><div id="writeFeedback" class="write-feedback" hidden></div>`;
    host.insertBefore(box, host.querySelector("#practiceView") || host.firstChild);
    const sel = box.querySelector("#writeTopic");
    TOPICS.forEach((t) => { const o = document.createElement("option"); o.value = t.id; o.textContent = t.form + " · " + t.title; sel.appendChild(o); });
    SECTIONS.forEach((s, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.dataset.sec = s.id; b.textContent = s.label;
      if (!i) b.className = "active";
      box.querySelector("#writeSecs").appendChild(b);
    });
    sel.onchange = refresh;
    box.querySelector("#writeSecs").onclick = (e) => {
      const b = e.target.closest("button"); if (!b) return;
      currentSectionId = b.dataset.sec;
      box.querySelectorAll("#writeSecs button").forEach((x) => x.classList.toggle("active", x === b));
      refresh();
    };
    box.querySelector("#writeBox").oninput = () => { box.querySelector("#writeWords").textContent = words(box.querySelector("#writeBox").value); };
    box.querySelector("#writeCheck").onclick = check;
    box.querySelector("#writeClear").onclick = () => { box.querySelector("#writeBox").value = ""; box.querySelector("#writeWords").textContent = "0"; box.querySelector("#writeFeedback").hidden = true; };
    refresh();
  }
  function currentTopic() { return TOPICS.find((t) => t.id === document.getElementById("writeTopic").value) || TOPICS[0]; }
  function currentSec() { return SECTIONS.find((s) => s.id === currentSectionId) || SECTIONS[0]; }
  function refresh() {
    const t = currentTopic(), s = currentSec();
    document.getElementById("writePrompt").textContent = t.prompt + "  Form: " + t.form + ".";
    document.getElementById("writeHint").textContent = s.hint;
    document.getElementById("writeTarget").textContent = s.min + "–" + s.max;
    document.getElementById("writeWords").textContent = words(document.getElementById("writeBox").value);
  }
  function check() {
    const text = document.getElementById("writeBox").value;
    const s = currentSec(), t = currentTopic();
    const marked = analyse(text, t);
    const notes = [];
    notes.push("Section: " + s.label + ". Target " + s.min + "–" + s.max + " words. You wrote " + marked.n + ".");
    if (!text.trim()) notes.push("The box is empty.");
    marked.issues.forEach((i) => notes.push(i.tip));
    const join = JOINERS.filter((w) => new RegExp("\\b" + w.replace(" ", "\\s+") + "\\b", "i").test(text));
    if (text.trim() && !join.length) notes.push("No joining word yet. After a full sentence, try however or therefore.");
    const host = document.getElementById("writeFeedback");
    host.hidden = false;
    host.innerHTML = "<h3>On your writing</h3><div class=\"write-legend\"><span class=\"lg-spell\">Spelling</span><span class=\"lg-punct\">Punctuation</span><span class=\"lg-gram\">Grammar / fragment</span><span class=\"lg-weak\">Vague word</span></div><div class=\"write-marked\">" + (marked.html || "—") + "</div><ul>" + notes.map((x) => "<li>" + x + "</li>").join("") + "</ul><h3>Fix this piece</h3>" + specificFixes(text, t, s).map((x, i) => "<article><b>Fix " + (i + 1) + "</b><p>" + x + "</p></article>").join("");
  }
  function hook(t) {
    if (t.type === "narrative") return "The street was almost dark when the doorway lit up.";
    if (t.type === "speech") return "Year 6, one small change would make tomorrow’s lessons easier.";
    if (t.id === "screens") return "An hour of screen light at night steals the next morning’s focus.";
    return "This choice will shape how students learn this year.";
  }
  function stance(t) {
    if (t.id === "screens") return "Screens should stay off in the last hour before bed.";
    if (t.id === "homework") return "Weekend homework should be rare, not routine.";
    if (t.id === "park") return "A playground would serve more families than extra car parks.";
    if (t.id === "uniform") return "Uniforms can support belonging if students still have some choice.";
    if (t.id === "speech") return "Ten quiet minutes at the start of class would help everyone settle.";
    if (t.id === "door") return "I had to decide whether to step through.";
    return "The idea is worth exploring from more than one side.";
  }
  window.SKILLUP_WRITING_WORKSHOP = {
    show() { build(); const el = document.getElementById("writeWorkshop"); if (el) el.hidden = false; },
    hide() { const el = document.getElementById("writeWorkshop"); if (el) el.hidden = true; }
  };
  build();
})();
