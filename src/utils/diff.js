const { diffLines } = require('diff');

/**
 * Returns an array of { value, added?, removed? } objects
 */
function computeDiff(oldText, newText) {
    return diffLines(oldText, newText);
}

module.exports = { computeDiff };