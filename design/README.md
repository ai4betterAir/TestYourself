# Reusable topic page designs

Review `topic-designs.html`, then open `topic-design.html?design=number` or another ID.
These are additive design previews. They do not replace practice, assessment, or question-bank routes.

| ID | Template | Suitable topics |
|---|---|---|
| number | Number studio | Counting, place value, addition, subtraction |
| fractions | Fraction lab | Fractions, decimals, percentages, ratio |
| geometry | Shape explorer | Shapes, angles, measurement, spatial reasoning |
| problems | Problem-solving desk | Word problems, money, algebra, multistep tasks |
| reading | Reading room | English reading, comprehension, inference |
| writing | Writing workshop | English writing, planning, revision, grammar |
| vocabulary | Word builder | Separate vocabulary, word meanings, roots, spelling |
| science | Discovery lab | Science concepts and fair investigations |
| world | World explorer | Geography, history, culture, general knowledge |
| oc | OC reasoning studio | OC reading, mathematical reasoning, thinking skills |
| selective | Selective strategy desk | Selective reasoning, reading, writing |
| naplan | NAPLAN practice desk | Year 3/5 domain practice and test familiarisation |

`topics.js` holds the 12 sample configurations: copy, artwork, accent, steps and example question.
`render.js` supplies common UI components and topic-specific model panels.
`topics.css` supplies shared responsive styles and content-driven layout variants.

For later integration, map each existing topic to a template ID, then supply its year-specific content and real question-bank adapter. Preserve the existing authentication, saved results, question selection, timers and scoring controllers. The preview includes one sample question per design, with feedback and reset; it does not save scores or run a full test. Changing the design selector replaces the current sample activity. Samples are illustrative, not a curriculum coverage claim.
