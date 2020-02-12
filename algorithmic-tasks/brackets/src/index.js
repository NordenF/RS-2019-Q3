let makeBracketsInfoByOpenBracket = function(bracketsConfig, openBracket) {
    for (let i = 0; i < bracketsConfig.length; i++) {
        if (bracketsConfig[i][0] === openBracket) {
            return {
                "open": openBracket,
                "close": bracketsConfig[i][1],
                "depth": 1,
            }
        }
    }
    return null;
};

module.exports = function check(str, bracketsConfig) {
    let stack = []
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (stack.length) {
            last = stack[stack.length - 1];
            if (char === last["close"]) {
                last["depth"] = last["depth"] - 1;
                if (last["depth"] === 0) {
                    stack.pop();
                }
                continue;
            }
            if (char === last["open"]) {
                last["depth"] = last["depth"] + 1;
                continue;
            }
        }

        let bracketsInfo = makeBracketsInfoByOpenBracket(bracketsConfig, char);

        if (bracketsInfo) {
            stack.push(bracketsInfo);
        } else {
            return false;
        }
    }

    return stack.length === 0;
}
