(function () {
  const TOPICS = [
    { id: "screens", type: "persuasive", title: "Screens before bed", prompt: "Should children be allowed screens in the hour before bedtime? Write to persuade a parent audience.", form: "Persuasive essay" },
    { id: "homework", type: "persuasive", title: "Weekend homework", prompt: "Homework should not be set on weekends. Write to persuade your school principal.", form: "Persuasive letter" },
    { id: "park", type: "persuasive", title: "A new park", prompt: "Your council will either build a new playground or extra car parks. Write to persuade the council.", form: "Persuasive letter" },
    { id: "uniform", type: "discursive", title: "School uniform", prompt: "Some people say uniforms build belonging. Others say they hide individuality. Explore both sides, then give a reasoned view.", form: "Discursive essay" },
    { id: "wrong", type: "discursive", title: "When things go wrong", prompt: "The greatest discoveries happen when things go wrong. Explore this idea.", form: "Discursive / reflective" },
    { id: "door", type: "narrative", title: "The doorway", prompt: "Write a story inspired by a glowing doorway at the edge of a quiet street at dusk.", form: "Narrative" },
    { id: "change", type: "narrative", title: "A changed view", prompt: "Write about a moment that changed how you saw someone.", form: "Narrative" },
    { id: "speech", type: "speech", title: "One small change", prompt: "Write a short speech to Year 6: one small school change that would help students learn better.", form: "Speech" }
  ];
  const SECTIONS = [
    { id: "intro", label: "Introduction", min: 60, max: 90, hint: "Hook + position + preview of reasons." },
    { id: "body", label: "Body", min: 120, max: 180, hint: "One or two PEEL paragraphs. Point, evidence, explain, link." },
    { id: "end", label: "Conclusion", min: 50, max: 80, hint: "Restate the position in new words. Why it matters. No new big idea." },
    { id: "full", label: "Full piece", min: 300, max: 450, hint: "Aim for 300-450 words in 30 minutes. Quality beats padding." }
  ];
  const JOINERS = ["eventually","finally","initially","meanwhile","consequently","therefore","thus","however","although","whereas","nevertheless","furthermore","moreover","in addition","for example","for instance","fortunately","unfortunately","obviously","clearly","importantly"];
  const WEAK = /\b(very|really|good|bad|nice|stuff|things|a lot|got|get|sad|happy|said)\b/gi;
  const words = (t) => (t.trim().match(/\b[\w'-]+\b/g) || []).length;
  function build() {
    if (document.getElementById("writeWorkshop")) return;
    const host = document.querySelector(".wrap") || document.querySelector("main");
    if (!host) return;
    const box = document.createElement("section");
    box.id = "writeWorkshop";
    box.hidden = true;
    box.innerHTML = `<div class="write-head"><h2>Selective Writing workshop</h2><p>Real test: 30 minutes, typed, 25% of the score. Practise intro, body or conclusion, or a full piece. Check gives word-count advice and better joining words.</p></div><label class="write-label">Topic</label><select id="writeTopic"></select><p class="write-prompt" id="writePrompt"></p><div class="write-secs" id="writeSecs"></div><p class="write-hint" id="writeHint"></p><div class="write-count"><b id="writeWords">0</b> words · target <span id="writeTarget">60–90</span></div><textarea id="writeBox" rows="12" placeholder="Type here…"></textarea><div class="write-actions"><button type="button" class="check" id="writeCheck">Check this section</button><button type="button" class="next" id="writeClear">Clear</button></div><div id="writeFeedback" class="write-feedback" hidden></div>`;
    host.insertBefore(box, host.querySelector("#practiceView") || host.firstChild);
    const sel = box.querySelector("#writeTopic");
    TOPICS.forEach((t) => { const o = document.createElement("option"); o.value = t.id; o.textContent = t.form + " · " + t.title; sel.appendChild(o); });
    SECTIONS.forEach((s, i) => { const b = document.createElement("button"); b.type = "button"; b.dataset.sec = s.id; b.textContent = s.label; if (!i) b.className = "active"; box.querySelector("#writeSecs").appendChild(b); });
    sel.onchange = refresh;
    box.querySelector("#writeSecs").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; box.querySelectorAll("#writeSecs button").forEach((x) => x.classList.toggle("active", x === b)); refresh(); };
    box.querySelector("#writeBox").oninput = () => { box.querySelector("#writeWords").textContent = words(box.querySelector("#writeBox").value); };
    box.querySelector("#writeCheck").onclick = check;
    box.querySelector("#writeClear").onclick = () => { box.querySelector("#writeBox").value = ""; box.querySelector("#writeWords").textContent = "0"; box.querySelector("#writeFeedback").hidden = true; };
    refresh();
  }
  function currentTopic() { return TOPICS.find((t) => t.id === document.getElementById("writeTopic").value) || TOPICS[0]; }
  function currentSec() { const id = document.querySelector("#writeSecs button.active")?.dataset.sec || "intro"; return SECTIONS.find((s) => s.id === id); }
  function refresh() { const t = currentTopic(), s = currentSec(); document.getElementById("writePrompt").textContent = t.prompt + "  Form: " + t.form + "."; document.getElementById("writeHint").textContent = s.hint; document.getElementById("writeTarget").textContent = s.min + "–" + s.max; document.getElementById("writeWords").textContent = words(document.getElementById("writeBox").value); }
  function check() {
    const text = document.getElementById("writeBox").value.trim();
    const s = currentSec(), t = currentTopic();
    const n = words(text);
    const found = JOINERS.filter((w) => new RegExp("\\b" + w.replace(" ", "\\s+") + "\\b", "i").test(text));
    const weakHits = [...new Set((text.match(WEAK) || []).map((x) => x.toLowerCase()))];
    const notes = [];
    if (!text) notes.push("Write something first.");
    else {
      if (n < s.min) notes.push("Too short (" + n + " words). Target " + s.min + "–" + s.max + " so markers can see developed ideas.");
      else if (n > s.max + 40) notes.push("A little long (" + n + "). Cut repeats rather than padding.");
      else notes.push("Word count is in a useful band (" + n + ").");
      if (s.id === "intro" && !/[.!?].+[.!?]/s.test(text)) notes.push("Introduction: add a hook, a clear position, and a preview of two reasons.");
      if (s.id === "body" && !/(for example|for instance|because|therefore|this shows)/i.test(text)) notes.push("Body: add one concrete example and a Therefore or This shows sentence.");
      if (s.id === "end" && /firstly|another reason/i.test(text)) notes.push("Conclusion: do not start a new argument. Restate and say why it matters.");
      if (found.length) notes.push("Joining words used: " + found.join(", ") + ".");
      else notes.push("Add a joining word: however, therefore, for example, consequently, or finally.");
      if (weakHits.length) notes.push("Swap thin words: " + weakHits.slice(0, 5).join(", ") + ".");
    }
    const options = suggest(t, s);
    const host = document.getElementById("writeFeedback");
    host.hidden = false;
    host.innerHTML = "<h3>Check</h3><ul>" + notes.map((x) => "<li>" + x + "</li>").join("") + "</ul><h3>Ways to lift this</h3>" + options.map((x, i) => "<article><b>Option " + (i + 1) + "</b><p>" + x + "</p></article>").join("");
  }
  function suggest(topic, sec) {
    if (sec.id === "intro") return [hook(topic) + " " + stance(topic), "Start with a small scene, then state your view in one sentence.", "Preview two reasons without arguing them yet."];
    if (sec.id === "body") return ["Use PEEL: point, example, explain, link.", "However, this only works if the example is specific, not 'everyone knows'.", "Therefore, end the paragraph by tying the example back to the prompt."];
    if (sec.id === "end") return ["In short, " + stance(topic) + " This matters because daily habits shape learning.", "Do not add a new reason. Lift the best one.", "Close with one precise joining word: consequently or finally."];
    return ["Plan 5 minutes, write 20, edit 5.", "300–450 words is enough if every paragraph earns its place.", "Check form: story, letter or speech must match the prompt."];
  }
  function hook(t) { if (t.type === "narrative") return "The street was almost dark when the doorway lit up."; if (t.type === "speech") return "Year 6, one small change would make tomorrow's lessons easier."; return "Every evening choice either protects learning or quietly steals it."; }
  function stance(t) { if (t.id === "screens") return "Screens should stay off in the last hour before bed."; if (t.id === "homework") return "Weekend homework should be rare, not routine."; if (t.id === "park") return "A playground would serve more families than extra car parks."; if (t.id === "uniform") return "Uniforms can support belonging if students still have some choice."; if (t.id === "speech") return "Ten quiet minutes at the start of class would help everyone settle."; return "The idea is worth exploring from more than one side."; }
  window.SKILLUP_WRITING_WORKSHOP = { show() { build(); const el = document.getElementById("writeWorkshop"); if (el) el.hidden = false; }, hide() { const el = document.getElementById("writeWorkshop"); if (el) el.hidden = true; } };
  build();
})();
