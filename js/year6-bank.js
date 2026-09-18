// Year 6 topics follow the broad structure of Progress in Mathematics Grade 6.
// All questions are newly written for SkillUP and do not reproduce the textbook.
(function () {
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = values => values[randomInt(0, values.length - 1)];
  const shuffle = values => [...values].sort(() => Math.random() - 0.5);
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
  const decimal = (value, places = 2) => Number(value.toFixed(places)).toString();
  const fraction = (numerator, denominator) => {
    const divisor = gcd(numerator, denominator);
    return `${numerator / divisor}/${denominator / divisor}`;
  };
  const money = value => `$${value.toFixed(2)}`;

  const topics = [
    ['number', '123', 'Number Sense & Decimal Operations', 'Place value, rounding, four operations, exponents and scientific notation'],
    ['algebra', 'x', 'Algebra & Expressions', 'Expressions, equations, inequalities, formulas, functions and patterns'],
    ['integers', '−', 'Integers', 'Compare, order and calculate with positive and negative numbers'],
    ['fractions', '½', 'Fractions & Number Theory', 'Factors, primes, GCF, LCM, rational numbers and fraction operations'],
    ['data', '▅', 'Probability, Data & Statistics', 'Probability, surveys, averages, range, tables and graphs'],
    ['geometry', '∠', 'Geometry', 'Angles, polygons, circles, transformations, symmetry and solid figures'],
    ['ratiopercent', '%', 'Ratio, Proportion & Percent', 'Ratios, rates, proportions, percentages, discounts, tax and interest'],
    ['measurement', 'cm', 'Measurement', 'Units, time, perimeter, area, circumference, surface area and volume'],
    ['mixed', '⚡', 'Mixed Year 6 Challenge', 'Questions selected from all eight Year 6 topics']
  ];

  function numericChoices(answer, step = 1, minimum = -Infinity) {
    const values = new Set([Number(answer)]);
    let offset = 1;
    while (values.size < 4) {
      values.add(Math.max(minimum, Number(answer) + step * offset));
      if (values.size < 4) values.add(Math.max(minimum, Number(answer) - step * offset));
      offset += 1;
    }
    return shuffle([...values].map(String));
  }

  function question(text, answer, choices, tip, explanation) {
    const correct = String(answer);
    const options = [...new Set(choices.map(String))];
    if (!options.includes(correct)) options.unshift(correct);
    return {
      text,
      answer: correct,
      choices: shuffle(options.slice(0, 4)),
      tip,
      explanation: explanation || `${tip} The correct answer is ${correct}.`
    };
  }

  function numberQuestion() {
    const mode = randomInt(0, 6);
    if (mode === 0) {
      const whole = randomInt(120, 980);
      const tenths = randomInt(1, 9);
      const hundredths = randomInt(1, 9);
      const value = `${whole}.${tenths}${hundredths}`;
      return question(
        `What is the value of the digit ${tenths} in ${value}?`,
        decimal(tenths / 10),
        [decimal(tenths / 10), String(tenths), decimal(tenths / 100), String(tenths * 10)],
        'Use the position of the digit to find its value.',
        `${tenths} is in the tenths place, so its value is ${tenths}/10 = ${decimal(tenths / 10)}.`
      );
    }
    if (mode === 1) {
      const value = randomInt(1001, 9999) / 100;
      const answer = Math.round(value * 10) / 10;
      return question(
        `Round ${value.toFixed(2)} to the nearest tenth.`,
        decimal(answer, 1),
        [decimal(answer, 1), decimal(Math.floor(value * 10) / 10, 1), decimal(Math.ceil(value), 1), value.toFixed(2)],
        'Look at the hundredths digit.',
        `The hundredths digit decides whether the tenths digit stays the same or increases by 1. The result is ${decimal(answer, 1)}.`
      );
    }
    if (mode === 2) {
      const a = randomInt(120, 999) / 10;
      const b = randomInt(20, 399) / 10;
      const answer = decimal(a + b);
      return question(
        `${a.toFixed(1)} + ${b.toFixed(1)} = ?`,
        answer,
        [answer, decimal(a - b), decimal(a + b + 1), decimal(a + b - 0.1)],
        'Line up the decimal points before adding.',
        `${a.toFixed(1)} + ${b.toFixed(1)} = ${answer}.`
      );
    }
    if (mode === 3) {
      const a = randomInt(12, 89) / 10;
      const b = randomInt(2, 9);
      const answer = decimal(a * b);
      return question(
        `${a.toFixed(1)} × ${b} = ?`,
        answer,
        [answer, decimal(a + b), decimal(a * (b + 1)), decimal(a * b / 10)],
        'Multiply as whole numbers, then place the decimal point.',
        `${a.toFixed(1)} × ${b} = ${answer}.`
      );
    }
    if (mode === 4) {
      const divisor = randomInt(2, 9);
      const quotient = randomInt(12, 98) / 10;
      const dividend = decimal(divisor * quotient);
      return question(
        `${dividend} ÷ ${divisor} = ?`,
        decimal(quotient),
        [decimal(quotient), decimal(quotient * divisor), decimal(quotient / 10), decimal(quotient + divisor)],
        'Use the related multiplication fact.',
        `${divisor} × ${decimal(quotient)} = ${dividend}, so ${dividend} ÷ ${divisor} = ${decimal(quotient)}.`
      );
    }
    if (mode === 5) {
      const base = randomInt(2, 9);
      const exponent = pick([2, 3]);
      const answer = base ** exponent;
      return question(
        `What is ${base}${exponent === 2 ? '²' : '³'}?`,
        answer,
        numericChoices(answer, base, 0),
        'An exponent tells how many times the base is used as a factor.',
        `${base}${exponent === 2 ? '²' : '³'} = ${Array(exponent).fill(base).join(' × ')} = ${answer}.`
      );
    }
    const coefficient = randomInt(2, 9);
    const exponent = randomInt(3, 6);
    const standard = coefficient * 10 ** exponent;
    return question(
      `Which is the standard form of ${coefficient} × 10^${exponent}?`,
      standard.toLocaleString('en-US'),
      [standard.toLocaleString('en-US'), (coefficient * 10 ** (exponent - 1)).toLocaleString('en-US'), `${coefficient}${'0'.repeat(exponent - 1)}`, `${coefficient}.${'0'.repeat(exponent)}`],
      'Multiplying by a power of 10 moves the digits to the left.',
      `${coefficient} × 10^${exponent} = ${standard.toLocaleString('en-US')}.`
    );
  }

  function algebraQuestion() {
    const mode = randomInt(0, 5);
    if (mode === 0) {
      const a = randomInt(2, 9);
      const b = randomInt(2, 9);
      return question(
        `Simplify ${a}m + ${b}m.`,
        `${a + b}m`,
        [`${a + b}m`, `${a * b}m`, `${a + b}m²`, `${Math.abs(a - b)}m`],
        'Combine the coefficients of like terms.',
        `${a}m and ${b}m are like terms, so (${a} + ${b})m = ${a + b}m.`
      );
    }
    if (mode === 1) {
      const a = randomInt(2, 7);
      const x = randomInt(2, 12);
      const b = randomInt(1, 9);
      const total = a * x + b;
      return question(
        `${a}x + ${b} = ${total}. Find x.`,
        x,
        numericChoices(x, 1, 0),
        'Undo addition first, then undo multiplication.',
        `${total} − ${b} = ${a * x}, then ${a * x} ÷ ${a} = ${x}.`
      );
    }
    if (mode === 2) {
      const x = randomInt(2, 12);
      const a = randomInt(2, 8);
      const b = randomInt(1, 9);
      const answer = a * x - b;
      return question(
        `If n = ${x}, find ${a}n − ${b}.`,
        answer,
        numericChoices(answer, a, 0),
        'Substitute the value of n before calculating.',
        `${a}(${x}) − ${b} = ${a * x} − ${b} = ${answer}.`
      );
    }
    if (mode === 3) {
      const a = randomInt(2, 8);
      const b = randomInt(2, 7);
      const c = randomInt(1, 8);
      const answer = a + b * c;
      return question(
        `Evaluate ${a} + ${b} × ${c}.`,
        answer,
        [answer, (a + b) * c, a * b + c, a + b + c],
        'Use order of operations: multiplication before addition.',
        `${b} × ${c} = ${b * c}, then ${a} + ${b * c} = ${answer}.`
      );
    }
    if (mode === 4) {
      const start = randomInt(2, 9);
      const step = randomInt(2, 8);
      const answer = start + 4 * step;
      return question(
        `The pattern is ${start}, ${start + step}, ${start + 2 * step}, ${start + 3 * step}, ... What is the next term?`,
        answer,
        numericChoices(answer, step, 0),
        'Find the amount added each time.',
        `The rule is add ${step}, so ${start + 3 * step} + ${step} = ${answer}.`
      );
    }
    const length = randomInt(4, 15);
    const width = randomInt(3, 12);
    const answer = 2 * (length + width);
    return question(
      `Use P = 2(l + w). Find P when l = ${length} and w = ${width}.`,
      answer,
      numericChoices(answer, 2, 0),
      'Substitute the values into the formula.',
      `P = 2(${length} + ${width}) = 2(${length + width}) = ${answer}.`
    );
  }

  function integerQuestion() {
    const mode = randomInt(0, 5);
    if (mode === 0) {
      const a = -randomInt(1, 15);
      let b = randomInt(-5, 12);
      while (b === a) b = randomInt(-5, 12);
      const answer = Math.max(a, b);
      return question(
        `Which integer is greater: ${a} or ${b}?`,
        answer,
        [a, b],
        'On a number line, the number farther right is greater.',
        `${answer} is farther to the right on the number line.`
      );
    }
    if (mode === 1) {
      const a = randomInt(-15, 15);
      const b = randomInt(-15, 15);
      const answer = a + b;
      return question(`${a} + (${b}) = ?`, answer, numericChoices(answer), 'Add integers by tracking direction on a number line.', `${a} + (${b}) = ${answer}.`);
    }
    if (mode === 2) {
      const a = randomInt(-10, 15);
      const b = randomInt(-12, 12);
      const answer = a - b;
      return question(`${a} − (${b}) = ?`, answer, numericChoices(answer), 'Subtracting an integer is the same as adding its opposite.', `${a} − (${b}) = ${a} + (${b === 0 ? 0 : -b}) = ${answer}.`);
    }
    if (mode === 3) {
      const a = randomInt(2, 12);
      const b = randomInt(2, 12);
      const negative = Math.random() < 0.5;
      const answer = negative ? -a * b : a * b;
      const expression = negative ? `(−${a}) × ${b}` : `(−${a}) × (−${b})`;
      return question(expression + ' = ?', answer, numericChoices(answer, a), 'Different signs give a negative product; matching signs give a positive product.', `${expression} = ${answer}.`);
    }
    if (mode === 4) {
      const divisor = randomInt(2, 10);
      const quotient = randomInt(2, 12);
      const bothNegative = Math.random() < 0.5;
      const dividend = divisor * quotient;
      const answer = bothNegative ? quotient : -quotient;
      const expression = bothNegative ? `(−${dividend}) ÷ (−${divisor})` : `(−${dividend}) ÷ ${divisor}`;
      return question(expression + ' = ?', answer, numericChoices(answer, 1), 'Matching signs give a positive quotient; different signs give a negative quotient.', `${expression} = ${answer}.`);
    }
    const start = randomInt(-8, 5);
    const change = randomInt(3, 10);
    const falls = Math.random() < 0.5;
    const answer = falls ? start - change : start + change;
    return question(
      `The temperature is ${start}°C and then ${falls ? 'falls' : 'rises'} by ${change}°C. What is the new temperature?`,
      `${answer}°C`,
      [`${answer}°C`, `${start + change}°C`, `${start - change}°C`, `${change - start}°C`],
      `${falls ? 'Subtract' : 'Add'} the temperature change.`,
      `${start} ${falls ? '−' : '+'} ${change} = ${answer}, so the new temperature is ${answer}°C.`
    );
  }

  function fractionQuestion() {
    const mode = randomInt(0, 7);
    if (mode === 0) {
      const number = pick([29, 31, 37, 41, 43, 47]);
      return question(`Which statement about ${number} is true?`, 'It is prime.', ['It is prime.', 'It is composite.', 'It is even.', 'It is a multiple of 5.'], 'A prime number has exactly two factors.', `${number} has only 1 and ${number} as factors, so it is prime.`);
    }
    if (mode === 1) {
      const a = pick([12, 18, 24, 30, 36]);
      const b = pick([16, 20, 28, 42, 48]);
      const answer = gcd(a, b);
      return question(`Find the greatest common factor of ${a} and ${b}.`, answer, numericChoices(answer, 1, 1), 'List the factors shared by both numbers.', `The greatest number that divides both ${a} and ${b} exactly is ${answer}.`);
    }
    if (mode === 2) {
      const a = pick([3, 4, 5, 6, 8]);
      const b = pick([4, 6, 8, 9, 10]);
      const answer = lcm(a, b);
      return question(`Find the least common multiple of ${a} and ${b}.`, answer, numericChoices(answer, Math.min(a, b), 1), 'List multiples until you find the first common one.', `The first positive multiple shared by ${a} and ${b} is ${answer}.`);
    }
    if (mode === 3) {
      const d1 = pick([3, 4, 5, 6]);
      const d2 = pick([4, 5, 6, 8]);
      const n1 = randomInt(1, d1 - 1);
      const n2 = randomInt(1, d2 - 1);
      const answer = fraction(n1 * d2 + n2 * d1, d1 * d2);
      return question(`${n1}/${d1} + ${n2}/${d2} = ?`, answer, [answer, fraction(n1 + n2, d1 + d2), fraction(n1 * d2 - n2 * d1, d1 * d2), fraction(n1 * n2, d1 * d2)], 'Use a common denominator, then add.', `${n1}/${d1} + ${n2}/${d2} = ${answer}.`);
    }
    if (mode === 4) {
      const d = pick([4, 5, 6, 8]);
      const n1 = randomInt(2, d - 1);
      const n2 = randomInt(1, n1 - 1);
      const answer = fraction(n1 - n2, d);
      return question(`${n1}/${d} − ${n2}/${d} = ?`, answer, [answer, `${n1 - n2}/${d * 2}`, fraction(n1 + n2, d), fraction(n1 - n2, d * d)], 'With equal denominators, subtract the numerators.', `${n1}/${d} − ${n2}/${d} = ${n1 - n2}/${d} = ${answer}.`);
    }
    if (mode === 5) {
      const d1 = randomInt(3, 8);
      const d2 = randomInt(3, 8);
      const n1 = randomInt(1, d1 - 1);
      const n2 = randomInt(1, d2 - 1);
      const answer = fraction(n1 * n2, d1 * d2);
      return question(`${n1}/${d1} × ${n2}/${d2} = ?`, answer, [answer, fraction(n1 + n2, d1 + d2), fraction(n1 * d2, d1 * n2), fraction(n1 + n2, d1 * d2)], 'Multiply numerators and denominators, then simplify.', `${n1} × ${n2} over ${d1} × ${d2} simplifies to ${answer}.`);
    }
    if (mode === 6) {
      const d1 = randomInt(3, 8);
      const d2 = randomInt(3, 8);
      const n1 = randomInt(1, d1 - 1);
      const n2 = randomInt(1, d2 - 1);
      const answer = fraction(n1 * d2, d1 * n2);
      return question(`${n1}/${d1} ÷ ${n2}/${d2} = ?`, answer, [answer, fraction(n1 * n2, d1 * d2), fraction(n1 * d1, n2 * d2), fraction(n2 * d1, d2 * n1)], 'Multiply by the reciprocal of the divisor.', `${n1}/${d1} × ${d2}/${n2} = ${answer}.`);
    }
    const fractionValue = pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5]]);
    const answer = decimal(fractionValue[0] / fractionValue[1]);
    return question(`Write ${fractionValue[0]}/${fractionValue[1]} as a decimal.`, answer, [answer, decimal(fractionValue[1] / fractionValue[0]), decimal(fractionValue[0] / 10), `${answer}0`], 'Divide the numerator by the denominator.', `${fractionValue[0]} ÷ ${fractionValue[1]} = ${answer}.`);
  }

  function dataQuestion() {
    const mode = randomInt(0, 6);
    if (mode === 0) {
      const centre = randomInt(8, 25);
      const values = [centre - 4, centre - 2, centre, centre + 2, centre + 4];
      return question(`Find the mean of ${values.join(', ')}.`, centre, numericChoices(centre, 2, 0), 'Add the values and divide by how many values there are.', `The sum is ${centre * 5}; ${centre * 5} ÷ 5 = ${centre}.`);
    }
    if (mode === 1) {
      const values = shuffle([randomInt(2, 8), randomInt(9, 14), randomInt(15, 20), randomInt(21, 28), randomInt(29, 36)]);
      const ordered = [...values].sort((a, b) => a - b);
      const answer = ordered[2];
      return question(`Find the median of ${values.join(', ')}.`, answer, numericChoices(answer, 2, 0), 'Order the values and choose the middle one.', `In order: ${ordered.join(', ')}. The middle value is ${answer}.`);
    }
    if (mode === 2) {
      const low = randomInt(2, 15);
      const high = low + randomInt(8, 25);
      return question(`A data set has a minimum of ${low} and a maximum of ${high}. What is its range?`, high - low, numericChoices(high - low, 1, 0), 'Range = maximum − minimum.', `${high} − ${low} = ${high - low}.`);
    }
    if (mode === 3) {
      const total = pick([20, 30, 40, 50]);
      const favourable = randomInt(1, total / 2);
      const answer = fraction(favourable, total);
      return question(`A bag has ${favourable} red counters and ${total - favourable} blue counters. What is P(red)?`, answer, [answer, fraction(total - favourable, total), fraction(favourable, total - favourable), `${favourable}/${total + favourable}`], 'Probability = favourable outcomes ÷ total outcomes.', `There are ${total} counters and ${favourable} are red, so P(red) = ${favourable}/${total} = ${answer}.`);
    }
    if (mode === 4) {
      const first = randomInt(1, 6);
      const second = randomInt(1, 6);
      const answer = fraction(1, 36);
      return question(`Two fair dice are rolled. What is the probability of rolling ${first} on the first die and ${second} on the second die?`, answer, [answer, '1/6', '1/12', '2/36'], 'Multiply the probabilities of independent events.', `P(${first} then ${second}) = 1/6 × 1/6 = 1/36.`);
    }
    if (mode === 5) {
      return question('Which survey question is least biased?', 'Which school lunch do you prefer?', ['Which school lunch do you prefer?', 'Isn’t pizza clearly the best lunch?', 'Why is the new lunch menu so bad?', 'You agree healthy food tastes worse, don’t you?'], 'A fair survey question does not lead people toward an answer.', '“Which school lunch do you prefer?” asks neutrally and allows different responses.');
    }
    const percentage = pick([20, 25, 40, 50, 75]);
    const answer = percentage * 3.6;
    return question(`A category is ${percentage}% of a circle graph. What is its central angle?`, `${answer}°`, [`${answer}°`, `${percentage}°`, `${360 - answer}°`, `${percentage * 1.8}°`], 'A full circle is 360°, so multiply the percentage by 360.', `${percentage}% × 360° = ${answer}°.`);
  }

  function geometryQuestion() {
    const mode = randomInt(0, 7);
    if (mode === 0) {
      const a = randomInt(35, 95);
      const b = randomInt(25, 150 - a);
      const answer = 180 - a - b;
      return question(`A triangle has angles ${a}° and ${b}°. Find the third angle.`, `${answer}°`, [`${answer}°`, `${180 - a}°`, `${180 - b}°`, `${a + b}°`], 'Angles in a triangle total 180°.', `${a}° + ${b}° = ${a + b}°; 180° − ${a + b}° = ${answer}°.`);
    }
    if (mode === 1) {
      const a = randomInt(35, 145);
      const answer = 180 - a;
      return question(`An angle on a straight line is ${a}°. Find the adjacent angle.`, `${answer}°`, [`${answer}°`, `${360 - a}°`, `${90 + a}°`, `${a}°`], 'Angles on a straight line total 180°.', `180° − ${a}° = ${answer}°.`);
    }
    if (mode === 2) return question('Which quadrilateral always has four equal sides and four right angles?', 'square', ['square', 'trapezoid', 'kite', 'parallelogram'], 'Check both the side and angle properties.', 'A square has four equal sides and four 90° angles.');
    if (mode === 3) {
      const sides = randomInt(5, 10);
      const answer = (sides - 2) * 180;
      return question(`What is the sum of the interior angles of a ${sides}-sided polygon?`, `${answer}°`, [`${answer}°`, `${sides * 180}°`, `${(sides - 1) * 180}°`, `${360}°`], 'Use (number of sides − 2) × 180°.', `(${sides} − 2) × 180° = ${answer}°.`);
    }
    if (mode === 4) {
      const radius = randomInt(2, 15);
      return question(`A circle has radius ${radius} cm. What is its diameter?`, `${radius * 2} cm`, [`${radius * 2} cm`, `${radius} cm`, `${radius * radius} cm`, `${radius + 2} cm`], 'Diameter = 2 × radius.', `2 × ${radius} = ${radius * 2} cm.`);
    }
    if (mode === 5) return question('Which transformation turns a shape around a fixed point?', 'rotation', ['rotation', 'reflection', 'translation', 'enlargement'], 'Think about how the shape moves.', 'A rotation turns a shape around a fixed centre.');
    if (mode === 6) return question('How many lines of symmetry does a square have?', 4, ['4', '2', '1', '8'], 'Count vertical, horizontal and diagonal reflection lines.', 'A square has vertical, horizontal and two diagonal lines of symmetry: 4 in total.');
    return question('How many faces does a triangular prism have?', 5, ['5', '4', '6', '8'], 'Count the two triangular and three rectangular faces.', 'A triangular prism has 2 triangular faces and 3 rectangular faces, for 5 faces.');
  }

  function ratioPercentQuestion() {
    const mode = randomInt(0, 7);
    if (mode === 0) {
      const a = randomInt(2, 9);
      const b = randomInt(2, 9);
      const scale = randomInt(2, 8);
      return question(`Simplify the ratio ${a * scale}:${b * scale}.`, `${fraction(a, b).replace('/', ':')}`, [`${fraction(a, b).replace('/', ':')}`, `${a * scale}:${b * scale}`, `${b}:${a}`, `${a + b}:1`], 'Divide both parts by their greatest common factor.', `${a * scale}:${b * scale} simplifies to ${fraction(a, b).replace('/', ':')}.`);
    }
    if (mode === 1) {
      const a = randomInt(2, 8);
      const b = randomInt(2, 8);
      const each = randomInt(3, 12);
      const total = (a + b) * each;
      return question(`${total} items are shared in the ratio ${a}:${b}. How many items are in the first share?`, a * each, numericChoices(a * each, each, 0), 'Find one ratio part, then multiply by the first number of parts.', `${total} ÷ ${a + b} = ${each} per part; ${a} × ${each} = ${a * each}.`);
    }
    if (mode === 2) {
      const unitRate = randomInt(4, 18);
      const quantity = randomInt(3, 9);
      return question(`${quantity} notebooks cost $${unitRate * quantity}. What is the cost per notebook?`, `$${unitRate}`, [`$${unitRate}`, `$${unitRate * quantity}`, `$${quantity}`, `$${unitRate + quantity}`], 'Divide the total cost by the number of notebooks.', `$${unitRate * quantity} ÷ ${quantity} = $${unitRate} per notebook.`);
    }
    if (mode === 3) {
      const a = randomInt(2, 9);
      const b = randomInt(2, 9);
      const scale = randomInt(2, 7);
      return question(`${a}/${b} = x/${b * scale}. Find x.`, a * scale, numericChoices(a * scale, scale, 0), 'Equivalent fractions use the same scale factor.', `${b} was multiplied by ${scale}, so ${a} × ${scale} = ${a * scale}.`);
    }
    if (mode === 4) {
      const percent = pick([10, 20, 25, 30, 40, 50, 75]);
      const whole = randomInt(2, 20) * 20;
      const answer = whole * percent / 100;
      return question(`Find ${percent}% of ${whole}.`, answer, numericChoices(answer, Math.max(1, whole / 20), 0), 'Convert the percentage to a fraction or decimal and multiply.', `${percent}% of ${whole} = ${percent / 100} × ${whole} = ${answer}.`);
    }
    if (mode === 5) {
      const original = randomInt(5, 30) * 10;
      const discount = pick([10, 20, 25, 30, 40]);
      const answer = original * (100 - discount) / 100;
      return question(`An item costs $${original} and is discounted by ${discount}%. What is the sale price?`, money(answer), [money(answer), money(original * discount / 100), money(original), money(original * (100 + discount) / 100)], 'Subtract the discount from the original price.', `${discount}% of $${original} is ${money(original * discount / 100)}, so the sale price is ${money(answer)}.`);
    }
    if (mode === 6) {
      const beforeTax = randomInt(5, 80) * 5;
      const answer = beforeTax * 1.1;
      return question(`A price before 10% GST is $${beforeTax}. What is the total including GST?`, money(answer), [money(answer), money(beforeTax * 0.1), money(beforeTax), money(beforeTax * 0.9)], 'Add 10% of the original price.', `GST is ${money(beforeTax * 0.1)}; ${money(beforeTax)} + ${money(beforeTax * 0.1)} = ${money(answer)}.`);
    }
    const principal = randomInt(2, 20) * 100;
    const rate = pick([2, 3, 4, 5, 6]);
    const years = randomInt(2, 5);
    const interest = principal * rate * years / 100;
    return question(`Find the simple interest on $${principal} at ${rate}% per year for ${years} years.`, money(interest), [money(interest), money(principal * rate / 100), money(principal + interest), money(interest / years)], 'Simple interest = principal × rate × time.', `$${principal} × ${rate / 100} × ${years} = ${money(interest)}.`);
  }

  function measurementQuestion() {
    const mode = randomInt(0, 8);
    if (mode === 0) {
      const metres = randomInt(12, 95) / 10;
      return question(`${metres} m equals how many centimetres?`, `${metres * 100} cm`, [`${metres * 100} cm`, `${metres * 10} cm`, `${metres / 100} cm`, `${metres * 1000} cm`], '1 metre = 100 centimetres.', `${metres} × 100 = ${metres * 100} cm.`);
    }
    if (mode === 1) {
      const hours = randomInt(1, 5);
      const minutes = pick([10, 15, 20, 30, 45]);
      const answer = hours * 60 + minutes;
      return question(`${hours} h ${minutes} min equals how many minutes?`, `${answer} min`, [`${answer} min`, `${hours * 100 + minutes} min`, `${hours * 60} min`, `${answer + 60} min`], 'Convert hours to minutes, then add the extra minutes.', `${hours} × 60 + ${minutes} = ${answer} minutes.`);
    }
    if (mode === 2) {
      const length = randomInt(5, 20);
      const width = randomInt(3, 15);
      const answer = 2 * (length + width);
      return question(`Find the perimeter of a rectangle ${length} cm by ${width} cm.`, `${answer} cm`, [`${answer} cm`, `${length * width} cm`, `${length + width} cm`, `${2 * length + width} cm`], 'Perimeter = 2(length + width).', `2(${length} + ${width}) = ${answer} cm.`);
    }
    if (mode === 3) {
      const base = randomInt(4, 18);
      const height = randomInt(3, 14);
      const answer = base * height / 2;
      return question(`Find the area of a triangle with base ${base} cm and height ${height} cm.`, `${answer} cm²`, [`${answer} cm²`, `${base * height} cm²`, `${base + height} cm²`, `${2 * (base + height)} cm²`], 'Area of a triangle = ½ × base × height.', `½ × ${base} × ${height} = ${answer} cm².`);
    }
    if (mode === 4) {
      const radius = randomInt(2, 12);
      const answer = (2 * 3.14 * radius).toFixed(2);
      return question(`Using π ≈ 3.14, find the circumference of a circle with radius ${radius} cm.`, `${answer} cm`, [`${answer} cm`, `${(3.14 * radius * radius).toFixed(2)} cm`, `${(3.14 * radius).toFixed(2)} cm`, `${radius * 2} cm`], 'Circumference = 2πr.', `2 × 3.14 × ${radius} = ${answer} cm.`);
    }
    if (mode === 5) {
      const radius = randomInt(2, 12);
      const answer = (3.14 * radius * radius).toFixed(2);
      return question(`Using π ≈ 3.14, find the area of a circle with radius ${radius} cm.`, `${answer} cm²`, [`${answer} cm²`, `${(2 * 3.14 * radius).toFixed(2)} cm²`, `${(3.14 * radius).toFixed(2)} cm²`, `${radius * radius} cm²`], 'Area of a circle = πr².', `3.14 × ${radius}² = ${answer} cm².`);
    }
    if (mode === 6) {
      const length = randomInt(3, 12);
      const width = randomInt(2, 10);
      const height = randomInt(2, 8);
      const answer = length * width * height;
      return question(`Find the volume of a rectangular prism ${length} cm × ${width} cm × ${height} cm.`, `${answer} cm³`, [`${answer} cm³`, `${2 * (length * width + length * height + width * height)} cm³`, `${length + width + height} cm³`, `${length * width} cm³`], 'Volume = length × width × height.', `${length} × ${width} × ${height} = ${answer} cm³.`);
    }
    if (mode === 7) {
      const length = randomInt(3, 10);
      const width = randomInt(2, 8);
      const height = randomInt(2, 7);
      const answer = 2 * (length * width + length * height + width * height);
      return question(`Find the surface area of a rectangular prism ${length} cm × ${width} cm × ${height} cm.`, `${answer} cm²`, [`${answer} cm²`, `${length * width * height} cm²`, `${length * width + length * height + width * height} cm²`, `${2 * (length + width + height)} cm²`], 'Add the areas of all six faces.', `2(${length * width} + ${length * height} + ${width * height}) = ${answer} cm².`);
    }
    const litres = randomInt(2, 15);
    return question(`${litres} litres equals how many millilitres?`, `${litres * 1000} mL`, [`${litres * 1000} mL`, `${litres * 100} mL`, `${litres * 10} mL`, `${litres / 1000} mL`], '1 litre = 1000 millilitres.', `${litres} × 1000 = ${litres * 1000} mL.`);
  }

  const generators = {
    number: numberQuestion,
    algebra: algebraQuestion,
    integers: integerQuestion,
    fractions: fractionQuestion,
    data: dataQuestion,
    geometry: geometryQuestion,
    ratiopercent: ratioPercentQuestion,
    measurement: measurementQuestion
  };

  function makeQuestion(topic) {
    let selectedTopic = topic;
    if (selectedTopic === 'mixed' || !generators[selectedTopic]) selectedTopic = pick(Object.keys(generators));
    return generators[selectedTopic]();
  }

  window.TY_YEAR6 = { topics, question: makeQuestion };
})();
