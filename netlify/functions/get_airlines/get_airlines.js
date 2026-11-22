const { getScope } = require("../../lib/couchbase");

const handler = async (event) => {
  // only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
    };
  }

  try {
    const scope = await getScope("inventory");

    const results = await scope.query("SELECT * from airline LIMIT 5");

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
