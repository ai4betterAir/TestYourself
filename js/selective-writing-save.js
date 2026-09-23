(function () {
  const KEY = "skillup-writing-saves";
  function loadAll() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function storeAll(list) { localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20))); }

  function piece() {
    const topic = document.getElementById("writeTopic");
    const box = document.getElementById("writeBox");
    const sec = document.querySelector("#writeSecs button.active");
    return {
      at: new Date().toISOString(),
      topic: topic ? topic.options[topic.selectedIndex].text : "Writing",
      section: sec ? sec.textContent : "Section",
      text: box ? box.value.trim() : "",
      words: box && box.value.trim() ? (box.value.trim().match(/\b[\w'-]+\b/g) || []).length : 0
    };
  }

  function letter(p, student) {
    return [
      "SkillUP Selective Writing",
      "Student: " + (student || "Student"),
      "Topic: " + p.topic,
      "Section: " + p.section,
      "Words: " + p.words,
      "Saved: " + p.at.replace("T", " ").slice(0, 16),
      "",
      p.text || "(empty)"
    ].join("\n");
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
    wrap.innerHTML = `
      <h3>Save and send</h3>
      <p>Save a draft on this device, download a copy, or email it to the parent and the teacher who set the work.</p>
      <div class="save-grid">
        <label>Student name <input id="saveStudent" placeholder="Student name"></label>
        <label>Teacher email <input id="saveTeacher" type="email" placeholder="teacher@school.edu.au"></label>
        <label>Parent email <input id="saveParent" type="email" placeholder="parent@email.com"></label>
      </div>
      <div class="write-actions">
        <button type="button" class="check" id="saveDraft">Save draft</button>
        <button type="button" class="next" id="saveDownload">Download</button>
        <button type="button" class="check" id="saveSend">Send to parent and teacher</button>
      </div>
      <p id="writeSaveStatus"></p>
      <ul id="writeSaveList"></ul>`;
    const actions = box.querySelector(".write-actions");
    if (actions) actions.after(wrap);
    else box.appendChild(wrap);
    const last = JSON.parse(localStorage.getItem("skillup-writing-contacts") || "{}");
    if (last.student) wrap.querySelector("#saveStudent").value = last.student;
    if (last.teacher) wrap.querySelector("#saveTeacher").value = last.teacher;
    if (last.parent) wrap.querySelector("#saveParent").value = last.parent;
    wrap.querySelector("#saveDraft").onclick = saveDraft;
    wrap.querySelector("#saveDownload").onclick = download;
    wrap.querySelector("#saveSend").onclick = sendMail;
    renderList();
  }

  function contacts() {
    const c = {
      student: (document.getElementById("saveStudent") || {}).value || "",
      teacher: (document.getElementById("saveTeacher") || {}).value || "",
      parent: (document.getElementById("saveParent") || {}).value || ""
    };
    localStorage.setItem("skillup-writing-contacts", JSON.stringify(c));
    return c;
  }

  function saveDraft() {
    const p = piece();
    if (!p.text) return status("Write something before saving.");
    contacts();
    const list = loadAll();
    list.unshift(p);
    storeAll(list);
    renderList();
    status("Draft saved on this device.", true);
  }

  function download() {
    const p = piece();
    if (!p.text) return status("Write something before downloading.");
    const blob = new Blob([letter(p, contacts().student)], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "skillup-writing-" + Date.now() + ".txt";
    a.click();
    status("Downloaded. Attach this file in an email if the send button is blocked.", true);
  }

  function sendMail() {
    const p = piece();
    const c = contacts();
    if (!p.text) return status("Write something before sending.");
    const to = [c.teacher, c.parent].map((x) => x.trim()).filter(Boolean);
    if (!to.length) return status("Add a teacher email and/or a parent email.");
    const subject = encodeURIComponent("SkillUP writing: " + p.topic + " (" + p.section + ")");
    const body = encodeURIComponent(letter(p, c.student));
    location.href = "mailto:" + to.join(",") + "?subject=" + subject + "&body=" + body;
    status("Email window opened for parent and teacher.", true);
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
        if (item && box) {
          box.value = item.text;
          const wc = document.getElementById("writeWords");
          if (wc) wc.textContent = item.words;
          status("Draft loaded.", true);
        }
      };
    });
  }

  document.addEventListener("DOMContentLoaded", mount);
  setTimeout(mount, 400);
  setTimeout(mount, 1200);
})();
