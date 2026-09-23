(function () {
  function mount() {
    const box = document.getElementById("writeWorkshop");
    if (!box || document.getElementById("writePunctHelp")) return;
    const help = document.createElement("details");
    help.id = "writePunctHelp";
    help.innerHTML = "<summary>Punctuation check-list</summary><ul><li><b>Comma splice:</b> two full sentences need a stop, a semicolon, or comma + and/but/so — not a comma alone.</li><li><b>Run-on:</b> two sentences with no join at all. Split them.</li><li><b>Fronted clause:</b> comma after it. <i>Before bed, screens go off.</i></li><li><b>Semicolon:</b> both sides must be complete sentences and closely linked. After however/therefore use a semicolon, then a comma.</li><li><b>Capital + end mark:</b> start with a capital; finish with . ? or !</li></ul><p class=\"write-hint\">Longer Australian drafting notes (OPC / NSW PCO) sit in the repo file docs/australian-drafting-punctuation.md.</p>";
    const head = box.querySelector(".write-head");
    if (head) head.after(help);
    else box.prepend(help);
  }
  document.addEventListener("DOMContentLoaded", mount);
  setTimeout(mount, 400);
  setTimeout(mount, 1200);
})();
