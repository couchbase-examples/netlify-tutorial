// Shared Couchbase access for every Netlify Function in this repo.
//
// Keeping the connection here (outside netlify/functions/, so Netlify does not
// deploy it as its own function) means each function asks for the collection it
// needs instead of repeating connection-string, credential, and timeout setup.
// Netlify bundles this file into each function that requires it.
const couchbase = require("couchbase");
require("dotenv").config();

const ENDPOINT = process.env.COUCHBASE_ENDPOINT;
const USERNAME = process.env.COUCHBASE_USERNAME;
const PASSWORD = process.env.COUCHBASE_PASSWORD;
const BUCKET = process.env.COUCHBASE_BUCKET;

// Connect once per function instance and reuse the connection across warm invocations.
const clusterPromise = couchbase.connect("couchbases://" + ENDPOINT, {
  username: USERNAME,
  password: PASSWORD,
  timeouts: {
    kvTimeout: 10000, // milliseconds
  },
});

// Returns the scope in the configured bucket (COUCHBASE_BUCKET, e.g. travel-sample).
async function getScope(scopeName) {
  const cluster = await clusterPromise;
  return cluster.bucket(BUCKET).scope(scopeName);
}

module.exports = { getScope };
