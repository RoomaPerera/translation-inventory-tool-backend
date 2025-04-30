const jwt = require('jsonwebtoken');

function createToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });;
};

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
};

function createShortToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

module.exports = {
    createToken,
    verifyToken,
    createShortToken
};