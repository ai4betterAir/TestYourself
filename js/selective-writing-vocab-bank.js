(function () {
  const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const Q = (text, answer, choices, tip, topic, name) => ({
    text, answer, choices: shuffle([...new Set(choices.map(String))]), tip, topic, name
  });
  const words = [
    { w: "eventually", group: "time", meaning: "after some time; in the end", ex: "The team practised each afternoon. Eventually, they won the final.", use: "Join a long process to its later result. Do not use for a sudden event.", tone: "time linker" },
    { w: "finally", group: "time", meaning: "at the last stage", ex: "She packed, checked the list and locked the door. Finally, she left.", use: "Close a sequence. Use once, at the last step.", tone: "time linker" },
    { w: "initially", group: "time", meaning: "at the start", ex: "Initially, the plan seemed simple. Later, extra costs appeared.", use: "Open a then-later contrast.", tone: "time linker" },
    { w: "meanwhile", group: "time", meaning: "at the same time, in another place or strand", ex: "The class wrote quietly. Meanwhile, the storm moved closer.", use: "Switch to a second action happening at the same time.", tone: "time linker" },
    { w: "subsequently", group: "time", meaning: "after that", ex: "The rule was announced. Subsequently, fewer bottles were used.", use: "Formal after-that. Prefer it in reports.", tone: "time linker" },
    { w: "consequently", group: "result", meaning: "as a result", ex: "The path was flooded. Consequently, the walk was cancelled.", use: "Cause in sentence 1, result in sentence 2.", tone: "result linker" },
    { w: "therefore", group: "result", meaning: "for that reason", ex: "The evidence was weak. Therefore, the claim was rejected.", use: "Join a reason to a conclusion.", tone: "result linker" },
    { w: "thus", group: "result", meaning: "so; in this way", ex: "Recycling rose by 20%. Thus, the target was met.", use: "Short formal so.", tone: "result linker" },
    { w: "hence", group: "result", meaning: "for this reason", ex: "The hall was booked. Hence, the concert moved outdoors.", use: "Formal therefore. Keep it rare.", tone: "result linker" },
    { w: "however", group: "contrast", meaning: "but; on the other hand", ex: "The idea was popular. However, it was too expensive.", use: "Start the second sentence to flip the first.", tone: "contrast linker" },
    { w: "although", group: "contrast", meaning: "even though", ex: "Although the climb was steep, they reached the ridge.", use: "Contrast inside one sentence. Comma after the first clause.", tone: "contrast linker" },
    { w: "whereas", group: "contrast", meaning: "while, showing a difference", ex: "Year 5 wrote stories, whereas Year 6 wrote speeches.", use: "Compare two sides in one sentence.", tone: "contrast linker" },
    { w: "nevertheless", group: "contrast", meaning: "even so; still", ex: "The rain was heavy. Nevertheless, the match continued.", use: "The second fact happens despite the first.", tone: "contrast linker" },
    { w: "despite this", group: "contrast", meaning: "even with that problem", ex: "The bus was late. Despite this, they arrived on time.", use: "Short contrast between two sentences.", tone: "contrast linker" },
    { w: "furthermore", group: "add", meaning: "also, adding a stronger point", ex: "The park is safer after dark. Furthermore, more families now use it.", use: "Add a second supporting point.", tone: "adding linker" },
    { w: "moreover", group: "add", meaning: "besides; what is more", ex: "The plan is cheaper. Moreover, it can start next term.", use: "Add extra support after a first reason.", tone: "adding linker" },
    { w: "in addition", group: "add", meaning: "as well", ex: "Students gain fitness. In addition, they learn teamwork.", use: "Add another benefit or fact.", tone: "adding linker" },
    { w: "for example", group: "example", meaning: "here is one case", ex: "Some habits waste water. For example, dripping taps lose litres each day.", use: "After a general claim, give one case.", tone: "example linker" },
    { w: "for instance", group: "example", meaning: "as one illustration", ex: "Small changes help. For instance, a lid on the bin stops birds spreading rubbish.", use: "Same job as for example.", tone: "example linker" },
    { w: "in particular", group: "example", meaning: "especially this one", ex: "Several rules need review. In particular, the phone ban is unclear.", use: "Zoom in on the most important case.", tone: "example linker" },
    { w: "fortunately", group: "comment", meaning: "luckily; it is good that", ex: "The rope slipped. Fortunately, the harness held.", use: "Show the writer judges the next fact as good.", tone: "comment adverb" },
    { w: "unfortunately", group: "comment", meaning: "it is a pity that", ex: "The idea was sound. Unfortunately, the deadline had passed.", use: "Show the next fact is a setback.", tone: "comment adverb" },
    { w: "obviously", group: "comment", meaning: "clearly; as anyone can see", ex: "The jar was empty. Obviously, someone had finished the biscuits.", use: "Only when the conclusion is truly clear. Do not use it to hide a weak reason.", tone: "comment adverb" },
    { w: "clearly", group: "comment", meaning: "it is easy to see that", ex: "Scores rose after the extra lesson. Clearly, the practice helped.", use: "Point to an easy conclusion from evidence.", tone: "comment adverb" },
    { w: "surprisingly", group: "comment", meaning: "against what you would expect", ex: "The smallest boat started last. Surprisingly, it finished first.", use: "Flag an unexpected turn.", tone: "comment adverb" },
    { w: "importantly", group: "comment", meaning: "this point matters more", ex: "The trip is fun. Importantly, it is also safe.", use: "Lift the key reason above the others.", tone: "comment adverb" }
  ];
  const topics = [
    ["time", "⏱", "Time linkers", "eventually, finally, initially, meanwhile"],
    ["result", "→", "Result linkers", "consequently, therefore, thus, hence"],
    ["contrast", "⇄", "Contrast linkers", "however, although, whereas, nevertheless"],
    ["add", "+", "Adding linkers", "furthermore, moreover, in addition"],
    ["example", "※", "Example linkers", "for example, for instance, in particular"],
    ["comment", "!", "Comment adverbs", "fortunately, unfortunately, obviously, clearly"],
    ["mixed", "⚡", "Mixed joining words", "All sentence-joining words"]
  ];
  function pool(topic) {
    if (!topic || topic === "mixed" || topic === "meaning" || topic === "usage" || topic === "blank" || topic === "tone") return words;
    const g = words.filter((x) => x.group === topic);
    return g.length ? g : words;
  }
  function meaningQ(topic) {
    const item = pick(pool(topic));
    const others = shuffle(words.filter((x) => x.w !== item.w)).slice(0, 3).map((x) => x.meaning);
    return Q("What does \u201c" + item.w + "\u201d do in writing?", item.meaning, [item.meaning, ...others], item.use, item.group, item.w);
  }
  function usageQ(topic) {
    const item = pick(pool(topic));
    const bad = [
      "The " + item.w + " was a red bicycle.",
      "Please " + item.w + " the door before lunch.",
      "They ate " + item.w + " with rice."
    ];
    return Q("Which sentence uses \u201c" + item.w + "\u201d to join ideas?", item.ex, [item.ex, ...shuffle(bad).slice(0, 3)], item.use + " Model: " + item.ex, item.group, item.w);
  }
  function blankQ(topic) {
    const item = pick(pool(topic));
    const blanks = {
      eventually: "They kept rewriting the ending. _______, the last version worked.",
      finally: "First the bags, then the tickets. _______, they boarded.",
      initially: "_______, the pond looked empty. Later, frogs appeared.",
      meanwhile: "One group measured rainfall. _______, the other mapped drains.",
      subsequently: "The warning was issued. _______, the beach was closed.",
      consequently: "The printer jammed. _______, the notices went out late.",
      therefore: "All votes were equal. _______, a second ballot was needed.",
      thus: "Costs fell by half. _______, the club could run two teams.",
      hence: "The hall was booked. _______, assembly moved to the oval.",
      however: "The design was neat. _______, it used too much plastic.",
      although: "_______ the path was muddy, they finished the walk.",
      whereas: "Year 5 chose narrative, _______ Year 6 chose persuasion.",
      nevertheless: "The odds were poor. _______, they attempted the climb.",
      "despite this": "The map was torn. _______, they found the track.",
      furthermore: "The rule is fair. _______, it is easy to follow.",
      moreover: "The kit is light. _______, spare parts are cheap.",
      "in addition": "The garden feeds birds. _______, it cools the playground.",
      "for example": "Litter harms wildlife. _______, plastic rings can trap birds.",
      "for instance": "Small acts add up. _______, one tap left running wastes a bucket.",
      "in particular": "Several signs are unclear. _______, the fire exit map is faded.",
      fortunately: "The rope frayed. _______, a second line held.",
      unfortunately: "The speech was ready. _______, the microphone failed.",
      obviously: "The jar was empty. _______, the biscuits were gone.",
      clearly: "Every draft improved. _______, feedback was useful.",
      surprisingly: "The youngest runner started last. _______, she won.",
      importantly: "The trip is enjoyable. _______, it is supervised."
    };
    const others = shuffle(words.filter((x) => x.w !== item.w)).slice(0, 3).map((x) => x.w);
    return Q(blanks[item.w] || "Choose the joining word: " + item.w, item.w, [item.w, ...others], item.meaning + ". " + item.ex, item.group, item.w);
  }
  function toneQ(topic) {
    const item = pick(pool(topic));
    const ans = "It is a " + item.tone + ": " + item.use;
    const distractors = [
      "It names a piece of sports equipment.",
      "It is a cooking verb.",
      "It is only used as a character name."
    ];
    return Q("What is the writing job of \u201c" + item.w + "\u201d?", ans, [ans, ...distractors], item.ex, item.group, item.w);
  }
  function question(topic) {
    const style = pick(["meaning", "usage", "blank", "tone"]);
    if (style === "usage") return usageQ(topic);
    if (style === "blank") return blankQ(topic);
    if (style === "tone") return toneQ(topic);
    return meaningQ(topic);
  }
  function learn(topic) {
    const item = pick(pool(topic));
    return { title: item.w, meaning: item.meaning, example: item.ex, use: item.use, tone: item.tone };
  }
  window.SKILLUP_WRITING_VOCAB = { topics, words, question, learn };
})();
