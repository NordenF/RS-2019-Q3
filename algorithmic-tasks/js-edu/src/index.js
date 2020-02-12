JS_TIME = 800;
BASIC_PROGRAMMING_TIME = 500;

/**
 * @param preferences - target student focus
 * @param knowsProgramming - if student can do programming and know basics
 * @param config - private student ability to perform for different focus modes
 * @returns number of weeks needed for finish education
 */
module.exports = function getTimeForEducation(
    focus = 'family', 
    knowsProgramming = true,
    config = {family: 4}
    ) {

    let fullHours = JS_TIME + (knowsProgramming ? 0 : BASIC_PROGRAMMING_TIME);
    let weeks = Math.ceil(fullHours / config[focus]);

    return weeks;
};
