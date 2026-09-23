(function () {
  const KEY = "skillup-writing-saves";
  function loadAll() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function storeAll(list) { localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20))); }
  function piece() {
    const topic = document.getElementById("writeTopic");
    const box = document.getElementById("writeBox");
    const sec = document.querySelector("#writeSecs button.active");
    const params = new URLSearchParams(location.search);
    return {
      at: new Date().toISOString(),
      topic: topic ? topic.options[topic.selectedIndex].text : "Writing",
      section: sec ? sec.textContent : "Section",
      text: box ? box.value.trim() : "",
      words: box && box.value.trim() ? (box.value.trim().match(/\b[\w'-]+\b/g) || []).length : 0,
      assignmentId: params.get("assignment") || null
    };
  }
  function letter(p, student) {
    return ["SkillUP Selective Writing", "Student: " + (student || "Student"), "Topic: " + p.topic, "Section: " + p.section, "Words: " + p.words, "Saved: " + p.at.replace("T", " ").slice(0, 16), "", p.text || "(empty)"].join("\n");
  }
  function status(msg, ok) {
    const el = document.getElementById("writeSaveStatus");
    if (!el) return;
    el.textContent = msg;
    el.style.color = ok ? "#0D6B4A" : "#BB0E3D";
  }
  function mount() {
    const box = document.getElementById("writeWorkshop");
    if (!box || document.getElementById("writeSave")) return;
    const wrap = document.createElement("div");
    wrap.id = "writeSave";
    wrap.innerHTML = `<h3>Save and send</h3><p>Save a draft, email home, or send to the teacher dashboard (student sign-in required).</p><div class="save-grid"><label>Student name <input id="saveStudent" placeholder="Student name"></label><label>Teacher email <input id="saveTeacher" type="email" placeholder="teacher@school.edu.au"></label><label>Parent email <input id="saveParent" type="email" placeholder="parent@email.com"></label></div><div class="write-actions"><button type="button" class="check" id="saveDraft">Save draft</button><button type="button" class="next" id="saveDownload">Download</button><button type="button" class="check" id="saveSend">Email parent and teacher</button><button type="button" class="check" id="saveDash">Send to dashboard</button></div><p id="writeSaveStatus"></p><ul id="writeSaveList"></ul>`;
    const actions = box.querySelector(".write-actions");
    if (actions) actions.after(wrap); else box.appendChild(wrap);
    const last = JSON.parse(localStorage.getItem("skillup-writing-contacts") || "{}");
    if (last.student) wrap.querySelector("#saveStudent").value = last.student;
    if (last.teacher) wrap.querySelector("#saveTeacher").value = last.teacher;
    if (last.parent) wrap.querySelector("#saveParent").value = last.parent;
    wrap.querySelector("#saveDraft").onclick = saveDraft;
    wrap.querySelector("#saveDownload").onclick = download;
    wrap.querySelector("#saveSend").onclick = sendMail;
    wrap.querySelector("#saveDash").onclick = sendDash;
    renderList();
  }
  function contacts() {
    const c = { student: (document.getElementById("saveStudent") || {}).value || "", teacher: (document.getElementById("saveTeacher") || {}).value || "", parent: (document.getElementById("saveParent") || {}).value || "" };
    localStorage.setItem("skillup-writing-contacts", JSON.stringify(c));
    return c;
  }
  function saveDraft() {
    const p = piece();
    if (!p.text) return status("Write something before saving.");
    contacts();
    const list = loadAll(); list.unshift(p); storeAll(list); renderList();
    status("Draft saved on this device.", true);
  }
  function download() {
    const p = piece();
    if (!p.text) return status("Write something before downloading.");
    const blob = new Blob([letter(p, contacts().student)], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "skillup-writing-" + Date.now() + ".txt"; a.click();
    status("Downloaded.", true);
  }
  function sendMail() {
    const p = piece(); const c = contacts();
    if (!p.text) return status("Write something before sending.");
    const to = [c.teacher, c.parent].map((x) => x.trim()).filter(Boolean);
    if (!to.length) return status("Add a teacher email and/or a parent email.");
    location.href = "mailto:" + to.join(",") + "?subject=" + encodeURIComponent("SkillUP writing: " + p.topic) + "&body=" + encodeURIComponent(letter(p, c.student));
    status("Email window opened.", true);
  }
  async function sendDash() {
    const p = piece();
    if (!p.text) return status("Write something before sending.");
    status("Sending to dashboard…", true);
    try {
      const mod = await import("./writing-cloud.js?v=20260923");
      const result = await mod.submitWritingToDashboard({
        topic: p.topic, section: p.section, body: p.text, wordCount: p.words, assignmentId: p.assignmentId
      });
      if (result.ok) status("Sent. The teacher and linked parent can open it on the dashboard.", true);
      else status(result.reason || "Could not send.");
    } catch (err) {
      status(err.message || "Could not reach accounts.");
    }
  }
  function renderList() {
    const ul = document.getElementById("writeSaveList");
    if (!ul) return;
    const list = loadAll();
    ul.innerHTML = list.slice(0, 5).map((p, i) => "<li>" + p.topic + " · " + p.section + " · " + p.words + " words <button type=\"button\" data-load=\"" + i + "\">Load</button></li>").join("") || "<li>No drafts yet.</li>";
    ul.querySelectorAll("[data-load]").forEach((b) => {
      b.onclick = () => {
        const item = loadAll()[Number(b.dataset.load)];
        const box = document.getElementById("writeBox");
        if (item && box) { box.value = item.text; const wc = document.getElementById("writeWords"); if (wc) wc.textContent = item.words; status("Draft loaded.", true); }
      };
    });
  }
  document.addEventListener("DOMContentLoaded", mount);
  setTimeout(mount, 400);
  setTimeout(mount, 1200);
})();
