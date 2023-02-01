const styleObject = (styleString) => {
  const obj = {};

  styleString
    .split(';')
    .map((rule) => rule.split(':').map((part) => part.trim()))
    .forEach((rule) => {
      obj[rule[0]] = rule[1];
    });

  return obj;
};

describe('TSNE Visualization', () => {
});
