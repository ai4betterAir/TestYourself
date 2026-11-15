// Each row contains a model, a question, the correct choice and two alternatives.
const kindergartenActivities = {
  maths: [
    ['Counting','Touch each boat once as you count.','Four boats are at the jetty. One more arrives. How many now?','5','4','6'],
    ['Number order','Count on by one along the path.','What comes between 7 and 9?','8','6','10'],
    ['Simple addition','Put two apples beside one more apple.','How many apples are there altogether?','3','2','4'],
    ['Shapes','A triangle has three straight sides and three corners.','Which shape has three corners?','Triangle','Circle','Square'],
    ['Patterns','Listen to the pair that repeats: red, blue.','Red, blue, red, blue, red … What comes next?','Blue','Red','Yellow'],
    ['Measurement','Line up the ends of two ribbons. Cover each one with equal blocks, with no gaps.','One ribbon covers 3 blocks. The other covers 5. Which is longer?','The 5-block ribbon','The 3-block ribbon','They are equal']
  ],
  english: [
    ['Letters & sounds','Say “moon” slowly. Listen to the sound at the start.','Which word starts with the same sound?','Mat','Sun','Fish'],
    ['Words','Say these sounds slowly. Then slide them together: s · a · t.','Which word did you make?','Sat','Tap','Sit'],
    ['Sentences','“The dog runs.” tells us who does something and what they do.','Which group of words tells a whole idea?','The cat sleeps.','The cat','A little'],
    ['Capital letters','Names start with capital letters. This is my friend Sam.','How do we write the name of a girl called Mia?','Mia','mia','miA'],
    ['Full stops','I see a frog. The dot shows where my telling sentence ends.','What goes at the end of “The frog hops”?','A full stop','A comma','A space only'],
    ['Early writing','Make a label for a box so your friend knows what is inside.','Your box holds toy cars. Which label will help?','Cars','Hats','Cups']
  ],
  reading: [
    ['Sounds & words','Listen: f · i · sh. Blend the sounds without a break.','Which word can you hear?','Fish','Fan','Dish'],
    ['Picture clues','Imagine a picture of a wet path. A child holds an open umbrella.','Which word fits this picture?','Rainy','Snowy','Sunny'],
    ['Story order','First Kit finds a seed. Then Kit plants it. Last, Kit waters the soil.','What does Kit do just before watering?','Plants the seed','Finds the seed','Picks a flower'],
    ['Characters','Pip the duck swims. Jo the frog sits on a rock and watches Pip.','Who sits on the rock?','Jo','Pip','A fish'],
    ['Key details','A red bag hangs on a hook. A blue hat is inside the bag.','What colour is the hat?','Blue','Red','Green'],
    ['Read aloud','Read these words with a grown-up: “Stop, Pip! A big bus is coming!”','Which word would you say in an urgent voice?','Stop!','A','is']
  ],
  vocabulary: [
    ['Everyday words','At school, a cubby is a little space for your things.','Where could you put your schoolbag?','In your cubby','In the sky','In a puddle'],
    ['Naming words','A naming word names a person, place or thing. “Cup” names a thing.','Which word names something you can hold?','Spoon','Jump','Soft'],
    ['Action words','An action word tells us what someone does. A frog can hop.','Which word tells an action?','Clap','Desk','Blue'],
    ['Describing words','A describing word tells us what something is like. A fluffy scarf feels soft.','Which word describes the scarf?','Fluffy','Scarf','Wear'],
    ['Word groups','A pear and an apple belong in the fruit group.','Which word belongs with pear and apple?','Banana','Sock','Pencil'],
    ['Words in stories','“I am chilly,” said Kim, pulling on a jumper.','What does chilly mean here?','A little cold','Very loud','Full of food']
  ],
  science: [
    ['Living things','A seed sprouts. Its roots grow down and a shoot grows up.','Which of these can grow from a seed?','A bean plant','A pebble','A spoon'],
    ['Weather','Watch a flag outside. When the air moves, the flag flutters.','What could make the flag flutter?','Wind','A shadow','Moonlight'],
    ['Materials','A raincoat helps keep water away from your clothes.','Which material would work best for a rain cover?','Waterproof fabric','Tissue paper','A paper towel'],
    ['Movement','Push a toy car gently across the floor. Watch its wheels turn.','How do the wheels move?','They roll','They melt','They grow'],
    ['Earth & sky','On a sunny day a tree blocks some sunlight and makes a shadow.','What is making the daylight?','The Sun','The tree','The soil'],
    ['Investigating','Look closely at a leaf. Describe what you actually notice.','Which sentence tells an observation?','The leaf has lines.','It might fall tomorrow.','I wonder how old it is.']
  ],
  'general-knowledge': [
    ['My community','A library has books people can borrow, read and return.','Who can help you find a book there?','A librarian','A pilot','A baker'],
    ['Australia','Kangaroos move on strong back legs. A young kangaroo is called a joey.','Which animal carries its joey in a pouch?','A kangaroo','A kookaburra','A goldfish'],
    ['Animals','A bird has feathers. A fish has fins. Look for a feature that sets them apart.','Which animal has feathers?','A cockatoo','A cat','A lizard'],
    ['Nature','After rain, water can collect in a hollow in the ground.','What is a small pool of rainwater called?','A puddle','A hill','A branch'],
    ['Celebrations','Families celebrate in different ways. They may sing, share food or give cards.','Which is a kind way to join a celebration?','Ask about the tradition','Tell everyone to be the same','Laugh at a new custom'],
    ['Everyday facts','A clock helps us tell the time. A calendar shows days and dates.','Which would help you find your birthday date?','A calendar','A ruler','A torch']
  ]
};
