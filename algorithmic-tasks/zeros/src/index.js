let countOfMultipliers = function(number, multiplier) {
  // Calculates count of <multiplier> inter multipliers of number.
  let count = 0;
  while (number > 0 && number % multiplier == 0) {
    count++;
    number = number / multiplier;
  }
  return count;
}


let countOf2and5MultipliersInFactorialItems = function(number, factorialType) {
  // factorialType: one of {'', '!', '!!'}.
  if (factorialType === '') {
    return {
        "2" : countOfMultipliers(number, 2),
        "5" : countOfMultipliers(number, 5),
    }
  }

  let count2 = 0;
  let count5 = 0;
  let start = (factorialType === '!' || (number % 2 === 1)) ? 1 : 2;
  let step = (factorialType === '!' ? 1 : 2);
  for (let item = start; item <= number; item += step) {
    count2 += countOfMultipliers(item, 2);
    count5 += countOfMultipliers(item, 5);
  }
  return {
    "2" : count2,
    "5" : count5,
  }
}


let countOf2and5MultipliersInFactorialExpression = function(expression) {
  // Expression cat be one of this kinds: '<nuber>', '<number>!', '<number>!!'.
  if (expression[expression.length - 1] === '!') {
    if (expression[expression.length - 2] === '!') {
      let number = parseInt(expression.substring(0, expression.length - 2));
      return countOf2and5MultipliersInFactorialItems(number, '!!');
    }
    let number = parseInt(expression.substring(0, expression.length - 1));
    return countOf2and5MultipliersInFactorialItems(number, '!');
  }
  let number = parseInt(expression);
  return countOf2and5MultipliersInFactorialItems(number, '');
}


module.exports = function zeros(expression) {
  let parts = expression.split('*');
  let count2 = 0;
  let count5 = 0;
  parts.forEach(function (item, index) {
    let count2and5 = countOf2and5MultipliersInFactorialExpression(item);
    count2 += count2and5["2"];
    count5 += count2and5["5"];
  });
  return Math.min(count2, count5);
}
