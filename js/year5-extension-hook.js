(function () {
  if (!window.TY_YEAR5_TESTS) return;
  if (typeof topicList !== 'function' || typeof makeQuestion !== 'function') return;

  const originalTopicList = topicList;
  const originalMakeQuestion = makeQuestion;

  topicList = function () {
    if (String(grade) === '5') {
      const existing = (window.TY_YEARS345 && window.TY_YEARS345.topics && window.TY_YEARS345.topics['5']) || [];
      const extra = window.TY_YEAR5_TESTS.topics || [];
      const seen = new Set();
      return existing.concat(extra).filter(function (item) {
        if (seen.has(item[0])) return false;
        seen.add(item[0]);
        return true;
      });
    }
    return originalTopicList();
  };

  makeQuestion = function () {
    if (String(grade) === '5') {
      const ids = new Set(window.TY_YEAR5_TESTS.topics.map(function (item) { return item[0]; }));
      if (ids.has(topic)) return window.TY_YEAR5_TESTS.question(topic);
    }
    return originalMakeQuestion();
  };

  if (typeof yearDescription === 'function') {
    const originalYearDescription = yearDescription;
    yearDescription = function () {
      if (String(grade) === '5') return 'Large numbers, fractions, decimals, factors, probability, coordinates, geometry, measurement, averages, equations, rates, graphs and multi-step problem solving.';
      return originalYearDescription();
    };
  }

  if (typeof setSize === 'function') {
    const originalSetSize = setSize;
    setSize = function () {
      if (String(grade) === '5') return 20;
      return originalSetSize();
    };
  }

  if (String(grade) === '5' && typeof buildTopics === 'function' && typeof buildSet === 'function') {
    buildTopics();
    buildSet();
  }
})();