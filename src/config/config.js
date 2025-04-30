// Loads environment variables and exports app configuration
require('dotenv').config();

const DEFAULT_PORT = 5000
const {
    PORT: portEnv,
    MONGO_URI: mongoURI,
    FRONTEND_URL,
} = process.env;

if (!mongoURI) {
    console.error('Missing MONGO_URI in environment');
    process.exit(1);
}

module.exports = {
    port: Number(portEnv) || DEFAULT_PORT,
    mongoURI,
    frontendURL: FRONTEND_URL,
};