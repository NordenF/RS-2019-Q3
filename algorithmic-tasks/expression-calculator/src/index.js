function eval() {
    // Do not use eval!!!
    return;
}


class ExpressionError extends Error {
  constructor(message) {
    super(message);
    this.name = "ExpressionError";
  }
}


function removeSpaces(str) {
  let result = '';
  for (let i = 0; i < str.length; i++)
    if (str[i] !== ' ')
      result += str[i];
  return result;
}


const LEXEME_CHARS = {
  MULTI_OPERATORS: '*/',
  TERM_OPERATORS: '+-',
  NUMBER: '0123456789.',
}


function getLexeme(expr, position, chars) {
  if (position >= expr.length)
    return null;

  let resultStr = '';
  while (chars.indexOf(expr[position]) !== -1) {
    resultStr += expr[position];
    position++;
  }

  return resultStr.length ? {
    value: resultStr,
    nextPosition: position
  } : null;
}


function evaluateSubExpr(expr, position) {
  if (position >= expr.length || expr[position] !== '(')
    throw new ExpressionError(`Logic error: open bracket expected. Expr: ${expr}, position: ${position}.`);

  let currentPosition;
  let depth;
  for (currentPosition = position + 1, depth = 1; depth > 0; currentPosition++) {
    if (currentPosition >= expr.length)
      throw new ExpressionError('ExpressionError: Brackets must be paired');
    if (expr[currentPosition] === '(')
      depth++;
    else if (expr[currentPosition] === ')')
      depth--;
  }

  let subExpr = expr.substring(position + 1, currentPosition - 1);
  if (subExpr.length === 0)
    return null;

  let subExprResult = evaluate(subExpr, 0);
  if (subExprResult === null)
    return null;

  if (subExprResult.nextPosition !== subExpr.length)
    throw new ExpressionError('Wrong expression.');

  return {
    value: subExprResult.value,
    nextPosition: currentPosition,
  };
}


function getMultiplier(expr, position) {
  if (expr[position] == '(')
    return evaluateSubExpr(expr, position);

  let multiplier = getLexeme(expr, position, LEXEME_CHARS.NUMBER);

  return multiplier ? {
    value: Number(multiplier.value),
    nextPosition: multiplier.nextPosition,
  } : null;
}


function getTerm(expr, position) {
  let multiplier = getMultiplier(expr, position);
  if (multiplier === null)
    return null;

  let result = multiplier.value;
  position = multiplier.nextPosition;

  let operator;
  while (operator = getLexeme(expr, position, LEXEME_CHARS.MULTI_OPERATORS)) {
    position = operator.nextPosition;
    multiplier = getMultiplier(expr, position);
    if (multiplier === null)
      throw new ExpressionError('Wrong expression.');
    position = multiplier.nextPosition;
    if (operator.value === '*')
      result *= multiplier.value;
    else if (multiplier.value !== 0)
      result /= multiplier.value;
    else
      throw new TypeError('TypeError: Devision by zero.');
  }

  return {
    value: result,
    nextPosition: position
  };
}


function evaluate(expr, position) {
  if (expr.length === 0)
    return null;

  let term = getTerm(expr, position);

  if (term === null)
    return null;

  let result = term.value;
  position = term.nextPosition;

  let operator;
  while (operator = getLexeme(expr, position, LEXEME_CHARS.TERM_OPERATORS)) {
    position = operator.nextPosition;
    term = getTerm(expr, position);
    if (term === null)
      throw new ExpressionError('Wrong expression.');
    position = term.nextPosition;
    result = operator.value === '+' ? result + term.value : result - term.value;
  }

  return {
    value: result,
    nextPosition: position
  };
}


function expressionCalculator(expr) {
  expr = removeSpaces(expr);
  if (expr.length === 0)
    return null;

  let result = evaluate(expr, 0);
  if (result === null)
    return null;

  if (result.nextPosition === expr.length)
    return result.value;

  if (result.nextPosition < expr.length && expr[result.nextPosition] === ')')
    throw new ExpressionError('ExpressionError: Brackets must be paired');
  else
    throw new ExpressionError('Wrong expression.');
}


module.exports = {
  expressionCalculator
}
