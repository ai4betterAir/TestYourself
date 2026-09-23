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
  const WEAK = /^(very|really|good|bad|nice|stuff|things|sad|happy|said)$/i;
  const TYPOS = {
    teh:"the", recieve:"receive", recieved:"received", definately:"definitely", seperate:"separate", seperately:"separately",
    occured:"occurred", occurence:"occurrence", grammer:"grammar", untill:"until", begining:"beginning", adress:"address",
    tommorrow:"tomorrow", truely:"truly", whitch:"which", wich:"which", becuase:"because", becaus:"because",
    freind:"friend", thier:"their", accomodate:"accommodate", enviroment:"environment", goverment:"government",
    independant:"independent", neccessary:"necessary", succesful:"successful", sucessful:"successful",
    writting:"writing", writen:"written", arguement:"argument", beleive:"believe", belive:"believe",
    alot:"a lot", aswell:"as well", eachother:"each other", infront:"in front", atleast:"at least",
    occassion:"occasion", publically:"publicly", realy:"really", finaly:"finally", usualy:"usually",
    imporant:"important", diferent:"different", proberly:"probably", probly:"probably", wether:"whether",
    wheather:"weather", kidz:"kids", doesnt:"doesn't", cant:"can't", wont:"won't", isnt:"isn't", didnt:"didn't",
    dont:"don't", theyre:"they're", youre:"you're", its:"it's"
  };
  const words = (t) => (t.trim().match(/\b[\w'-]+\b/g) || []).length;
  function esc(s) { return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  function analyse(text) {
    const issues = [];
    const parts = text.split(/(\s+|[^\w']+)/);
    let html = "";
    let prevWord = "";
    let atSentenceStart = true;
    parts.forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { html += part; return; }
      if (/^[^\w']+$/.test(part)) {
        if (/[,]{2,}|[.]{3,}|[!]{3,}|[?]{3,}/.test(part) || /[,.!?][,.!?]/.test(part) && part !== "...") {
          html += "<mark class=\"mark-punct\" title=\"Check punctuation\">" + esc(part) + "</mark>";
          issues.push({ type: "punct", tip: "Repeated or mixed punctuation: " + part });
        } else html += esc(part);
        if (/[.!?]/.test(part)) atSentenceStart = true;
        return;
      }
      const raw = part;
      const key = raw.toLowerCase();
      let cls = "", title = "";
      if (TYPOS[key] && !(key === "its" && !/^(a|the|own|place|effect|impact)$/i.test(prevWord))) {
        if (key === "its") {
          /* skip generic its */
        } else {
          cls = "mark-spell"; title = "Spelling: try \u201c" + TYPOS[key] + "\u201d";
          issues.push({ type: "spell", tip: raw + " → " + TYPOS[key] });
        }
      }
      if (!cls && WEAK.test(key)) { cls = "mark-weak"; title = "Thin word — choose a more precise one"; issues.push({ type: "weak", tip: raw }); }
      if (!cls && prevWord && prevWord.toLowerCase() === key) { cls = "mark-gram"; title = "Repeated word"; issues.push({ type: "gram", tip: "Repeated \u201c" + raw + "\u201d" }); }
      if (!cls && atSentenceStart && /^[a-z]/.test(raw)) { cls = "mark-punct"; title = "Start the sentence with a capital"; issues.push({ type: "punct", tip: "Capitalise \u201c" + raw + "\u201d" }); }
      if (!cls && key === "i") { cls = "mark-gram"; title = "The pronoun I is always capital"; issues.push({ type: "gram", tip: "i → I" }); }
      if (cls) html += "<mark class=\"" + cls + "\" title=\"" + esc(title) + "\">" + esc(raw) + "</mark>";
      else html += esc(raw);
      prevWord = raw;
      atSentenceStart = false;
    });
    const trimmed = text.trim();
    if (trimmed && !/[.!?]$/.test(trimmed)) {
      issues.push({ type: "punct", tip: "The last sentence needs end punctuation (. ? !)" });
    }
    if (/[a-zA-Z]\s+[,.]/.test(text) === false && /\s[,.]/.test(text)) {
      issues.push({ type: "punct", tip: "Remove the space before a comma or full stop." });
    }
    if (/[a-zA-Z][,.;:][a-zA-Z]/.test(text)) {
      issues.push({ type: "punct", tip: "Add a space after a comma or full stop." });
    }
    return { html, issues };
  }

  function build() {
    if (document.getElementById("writeWorkshop")) return;
    const host = document.querySelector(".wrap") || document.querySelector("main");
    if (!host) return;
    const box = document.createElement("section");
    box.id = "writeWorkshop";
    box.hidden = true;
    box.innerHTML = `<div class="write-head"><h2>Selective Writing workshop</h2><p>Check marks spelling in pink, punctuation in gold, grammar in purple, and thin words in green.</p></div><label class="write-label">Topic</label><select id="writeTopic"></select><p class="write-prompt" id="writePrompt"></p><div class="write-secs" id="writeSecs"></div><p class="write-hint" id="writeHint"></p><div class="write-count"><b id="writeWords">0</b> words · target <span id="writeTarget">60–90</span></div><textarea id="writeBox" rows="12" placeholder="Type here…"></textarea><div class="write-actions"><button type="button" class="check" id="writeCheck">Check this section</button><button type="button" class="next" id="writeClear">Clear</button></div><div id="writeFeedback" class="write-feedback" hidden></div>`;
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
    const text = document.getElementById("writeBox").value;
    const s = currentSec(), t = currentTopic();
    const n = words(text);
    const found = JOINERS.filter((w) => new RegExp("\\b" + w.replace(" ", "\\s+") + "\\b", "i").test(text));
    const marked = analyse(text);
    const notes = [];
    if (!text.trim()) notes.push("Write something first.");
    else {
      if (n < s.min) notes.push("Too short (" + n + " words). Target " + s.min + "–" + s.max + ".");
      else if (n > s.max + 40) notes.push("A little long (" + n + "). Cut repeats.");
      else notes.push("Word count is in a useful band (" + n + ").");
      if (found.length) notes.push("Joining words used: " + found.join(", ") + ".");
      else notes.push("Add a joining word: however, therefore, for example, consequently.");
      const spell = marked.issues.filter((i) => i.type === "spell");
      const punct = marked.issues.filter((i) => i.type === "punct");
      const gram = marked.issues.filter((i) => i.type === "gram");
      if (spell.length) notes.push("Spelling: " + spell.map((i) => i.tip).join("; ") + ".");
      if (punct.length) notes.push("Punctuation: " + punct.map((i) => i.tip).join("; ") + ".");
      if (gram.length) notes.push("Grammar: " + gram.map((i) => i.tip).join("; ") + ".");
      if (!spell.length && !punct.length && !gram.length) notes.push("No common spelling, punctuation or grammar flags in this checker.");
    }
    const options = suggest(t, s);
    const host = document.getElementById("writeFeedback");
    host.hidden = false;
    host.innerHTML = "<h3>Check</h3><div class=\"write-legend\"><span class=\"lg-spell\">Spelling</span><span class=\"lg-punct\">Punctuation</span><span class=\"lg-gram\">Grammar</span><span class=\"lg-weak\">Thin word</span></div><div class=\"write-marked\">" + (marked.html || "—") + "</div><ul>" + notes.map((x) => "<li>" + x + "</li>").join("") + "</ul><h3>Ways to lift this</h3>" + options.map((x, i) => "<article><b>Option " + (i + 1) + "</b><p>" + x + "</p></article>").join("");
  }
  function suggest(topic, sec) {
    if (sec.id === "intro") return [hook(topic) + " " + stance(topic), "Start with a small scene, then state your view in one sentence.", "Preview two reasons without arguing them yet."];
    if (sec.id === "body") return ["Use PEEL: point, example, explain, link.", "However, this only works if the example is specific.", "Therefore, end the paragraph by tying the example back to the prompt."];
    if (sec.id === "end") return ["In short, " + stance(topic) + " This matters because daily habits shape learning.", "Do not add a new reason.", "Close with consequently or finally."];
    return ["Plan 5 minutes, write 20, edit 5.", "300–450 words is enough if every paragraph earns its place.", "Check form: story, letter or speech must match the prompt."];
  }
  function hook(t) { if (t.type === "narrative") return "The street was almost dark when the doorway lit up."; if (t.type === "speech") return "Year 6, one small change would make tomorrow's lessons easier."; return "Every evening choice either protects learning or quietly steals it."; }
  function stance(t) { if (t.id === "screens") return "Screens should stay off in the last hour before bed."; if (t.id === "homework") return "Weekend homework should be rare, not routine."; if (t.id === "park") return "A playground would serve more families than extra car parks."; if (t.id === "uniform") return "Uniforms can support belonging if students still have some choice."; if (t.id === "speech") return "Ten quiet minutes at the start of class would help everyone settle."; return "The idea is worth exploring from more than one side."; }
  window.SKILLUP_WRITING_WORKSHOP = { show() { build(); const el = document.getElementById("writeWorkshop"); if (el) el.hidden = false; }, hide() { const el = document.getElementById("writeWorkshop"); if (el) el.hidden = true; } };
  build();
})();
