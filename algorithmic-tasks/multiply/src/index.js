function strToDigits(str) {
  let digits = [];
  for (let i = 0; i < str.length; i++)
    digits.push(Number(str[i]));
  return digits;
}


module.exports = function multiply(first, second) {
  first = strToDigits(first);
  second = strToDigits(second);
  let terms = []
  let termLength = first.length + second.length;
  for (let i = 0; i < second.length; i++) {
    terms.push([]);
    for (let j = 0; j < i; j++)
      terms[i].unshift(0);
    let transfer = 0;
    for (let j = 0; j < first.length; j++) {
      let current = transfer + first[first.length - j - 1] * second[second.length - i - 1];
      let units = current % 10;
      transfer = (current - units) / 10;
      terms[i].unshift(units);
    }
    if (transfer)
      terms[i].unshift(transfer);
    let fillBeginZerosCount = termLength - terms[i].length;
    for (let j = 0; j < fillBeginZerosCount; j++)
      terms[i].unshift(0);
  }

  let result = [];
  let transfer = 0;
  for (let i = 0; i < termLength; i++) {
    let current = transfer;
    for (let j = 0; j < terms.length; j++)
      current += terms[j][termLength - i - 1];
    let units = current % 10;
    transfer = (current - units) / 10;
    result.unshift(units);
  }
  if (transfer)
    result.unshift(transfer);

  while (result.length && result[0] === 0)
    result.shift();

  return result.join('')
}
