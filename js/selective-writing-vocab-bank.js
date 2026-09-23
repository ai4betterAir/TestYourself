(function () {
  const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const Q = (text, answer, choices, tip, topic, name) => ({
    text, answer, choices: shuffle([...new Set(choices.map(String))]), tip, topic, name
  });
  const words = [
    { w: "cognitive", meaning: "related to thinking, knowing or understanding", ex: "The puzzle improved her cognitive skills.", use: "Use for thinking, memory or mental effort.", tone: "formal academic" },
    { w: "fascination", meaning: "a strong interest or attraction", ex: "His fascination with space began after a planetarium visit.", use: "Use when someone is deeply interested, not just briefly curious.", tone: "positive" },
    { w: "meticulously", meaning: "very carefully and with great attention to detail", ex: "She meticulously checked every line of her draft.", use: "Use for careful, precise work.", tone: "formal" },
    { w: "consequently", meaning: "as a result; therefore", ex: "The bridge was closed; consequently, traffic moved slowly.", use: "Join a cause to its result.", tone: "formal linking" },
    { w: "albeit", meaning: "although; even if", ex: "The speech was short, albeit powerful.", use: "Add a contrast inside one sentence.", tone: "formal" },
    { w: "profound", meaning: "very deep or intense", ex: "The novel had a profound effect on the class.", use: "Use for deep feeling, thought or change.", tone: "strong formal" },
    { w: "resilient", meaning: "able to recover quickly from difficulty", ex: "The team stayed resilient after losing the first match.", use: "Describe people or systems that bounce back.", tone: "positive" },
    { w: "distinguish", meaning: "to see or show the difference between things", ex: "Readers must distinguish fact from opinion.", use: "Use when comparing two similar things.", tone: "academic" },
    { w: "elaborate", meaning: "to add more detail; detailed and complex", ex: "Please elaborate on your main idea with an example.", use: "Ask for or give extra detail.", tone: "academic" },
    { w: "convey", meaning: "to communicate an idea or feeling", ex: "The poem conveys loneliness through winter images.", use: "Use instead of 'show' or 'tell' in analysis.", tone: "academic" },
    { w: "significant", meaning: "important or large enough to notice", ex: "There was a significant rise in recycling.", use: "Use for importance, not just size.", tone: "academic" },
    { w: "analyse", meaning: "to examine something carefully in parts", ex: "Analyse the writer's word choice in paragraph two.", use: "Use in questions that ask how and why.", tone: "academic" },
    { w: "interpret", meaning: "to explain the meaning of something", ex: "Students interpreted the graph in different ways.", use: "Use when meaning is not obvious.", tone: "academic" },
    { w: "perspective", meaning: "a point of view", ex: "The diary gives a child's perspective on the journey.", use: "Name whose viewpoint is being shown.", tone: "academic" },
    { w: "contrast", meaning: "a clear difference; to compare differences", ex: "Contrast the two characters' choices.", use: "Use when differences matter more than similarities.", tone: "academic" },
    { w: "emphasise", meaning: "to give special importance to something", ex: "The heading emphasises the danger of waste.", use: "Use when a writer stresses one idea.", tone: "academic" },
    { w: "evaluate", meaning: "to judge how good, useful or successful something is", ex: "Evaluate whether the evidence supports the claim.", use: "Use when a judgement is required.", tone: "academic" },
    { w: "justify", meaning: "to give reasons that support a decision or opinion", ex: "Justify your answer with a quotation.", use: "Use when you must prove why you are right.", tone: "academic" },
    { w: "imply", meaning: "to suggest something without saying it directly", ex: "The final line implies that the narrator is unsure.", use: "Use for hinted meaning, not a direct statement.", tone: "academic" },
    { w: "compile", meaning: "to collect and put together", ex: "Compile three examples before you start writing.", use: "Use for gathering information into one place.", tone: "neutral formal" },
    { w: "concise", meaning: "short and clear, with no wasted words", ex: "A concise topic sentence guides the paragraph.", use: "Praise writing that is tight and clear.", tone: "positive" },
    { w: "ambiguous", meaning: "having more than one possible meaning", ex: "The ending is ambiguous, so readers disagree.", use: "Use when meaning is deliberately unclear.", tone: "analytical" },
    { w: "coherent", meaning: "logical and easy to follow", ex: "Link each sentence so the paragraph stays coherent.", use: "Use for organised writing.", tone: "positive academic" },
    { w: "nuance", meaning: "a small but important difference in meaning", ex: "The word request has a more polite nuance than demand.", use: "Use when two words are close but not the same.", tone: "precise" }
  ];
  const topics = [
    ["meaning", "Aa", "Word meaning", "Choose the precise definition"],
    ["usage", "✎", "Use in a sentence", "Pick the sentence that uses the word well"],
    ["blank", "□", "Best word in context", "Complete the sentence"],
    ["tone", "◎", "Tone and purpose", "Match the word to its job in writing"],
    ["mixed", "⚡", "Mixed writing vocabulary", "All writing-vocabulary skills"]
  ];
  function meaningQ(){const item=pick(words);const others=shuffle(words.filter(x=>x.w!==item.w)).slice(0,3).map(x=>x.meaning);return Q(`What does \u201c${item.w}\u201d mean?`,item.meaning,[item.meaning,...others],item.use,"meaning","Word meaning")}
  function usageQ(){const item=pick(words);const good=item.ex;const bad=[`The ${item.w} was a red bicycle.`, `Please ${item.w} the door before lunch.`, `They ate ${item.w} with rice.`];return Q(`Which sentence uses \u201c${item.w}\u201d correctly?`,good,[good,...shuffle(bad).slice(0,3)],`${item.use} Model: ${item.ex}`,"usage","Use in a sentence")}
  function blankQ(){const item=pick(words);const blanks={cognitive:"Regular reading can strengthen _______ development.",fascination:"Her _______ with insects led her to keep a nature journal.",meticulously:"He _______ labelled every sample in the experiment.",consequently:"The evidence was weak; _______, the claim was rejected.",albeit:"The answer was correct, _______ incomplete.",profound:"The speech had a _______ impact on the audience.",resilient:"After the setback, the group stayed _______.",distinguish:"Can you _______ the writer's view from the character's view?",elaborate:"_______ on that idea with one clear example.",convey:"What feeling does the image _______?",significant:"The graph shows a _______ change after week three.",analyse:"_______ the verbs that create tension.",interpret:"How do you _______ the final paragraph?",perspective:"The recount is written from a child's _______.",contrast:"_______ the two settings in the opening chapters.",emphasise:"Bold type is used to _______ the warning.",evaluate:"_______ how well the evidence supports the title.",justify:"_______ your choice with a short quotation.",imply:"The pause seems to _______ doubt.",compile:"_______ your notes before writing the introduction.",concise:"Replace the long clause with a _______ phrase.",ambiguous:"The pronoun is _______, so the reader is unsure who acted.",coherent:"Add a linking word to keep the paragraph _______.",nuance:"Explain the _______ between look and gaze."};const others=shuffle(words.filter(x=>x.w!==item.w)).slice(0,3).map(x=>x.w);return Q(blanks[item.w]||`Choose the best word: ${item.w}`,item.w,[item.w,...others],`${item.meaning}. Example: ${item.ex}`,"blank","Best word in context")}
  function toneQ(){const item=pick(words);const ans=`It is a ${item.tone} word used to ${item.use.replace(/^Use /,'').replace(/^Use for /,'show ')}`;const distractors=["It is slang used only in speech with friends.","It is a cooking term for mixing ingredients.","It names a type of sports equipment."];return Q(`In writing, what is the job of \u201c${item.w}\u201d?`,ans,[ans,...distractors],`${item.w}: ${item.meaning}. ${item.ex}`,"tone","Tone and purpose")}
  function question(topic){const t=topic==="mixed"?pick(["meaning","usage","blank","tone"]):topic;if(t==="usage")return usageQ();if(t==="blank")return blankQ();if(t==="tone")return toneQ();return meaningQ()}
  function learn(){const item=pick(words);return {title:item.w,meaning:item.meaning,example:item.ex,use:item.use,tone:item.tone}}
  window.SKILLUP_WRITING_VOCAB={topics,words,question,learn};
})();
