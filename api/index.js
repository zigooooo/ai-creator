// Serverless wrapper for the Express app compiled to dist/
// This file will be deployed as a Vercel Serverless Function and will
// delegate all /api requests to the existing Express app exported from dist/server.js

require('dotenv').config();
const serverless = require('serverless-http');

let app;
try {
  const mod = require('../dist/server.js');
  app = mod && (mod.default || mod);
} catch (err) {
  console.error('Error loading compiled server from dist/server.js. Did you run the build?');
  console.error(err);
  throw err;
}

module.exports = serverless(app);
