const { getScope } = require("../../lib/couchbase");

const handler = async (event) => {
  // only allow PUT requests
  if (event.httpMethod !== "PUT") {
    return {
      statusCode: 405,
    };
  }

  try {
    const scope = await getScope("inventory");
    const collection = scope.collection("airline");

    const modifiedAirline = {
      callsign: "MILE-AIR",
      country: JSON.parse(event.body).country,
      iata: "Q5",
      icao: "MLA",
      id: 10,
      name: "40-Mile-Air",
      type: "airline",
    };

    const idToUpsert = modifiedAirline.type + "_" + modifiedAirline.id;

    const result = await collection.upsert(idToUpsert, modifiedAirline);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };