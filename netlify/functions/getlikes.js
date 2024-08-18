const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  try {
    const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });
    const response = await client.query(
      q.Get(q.Ref(q.Collection('likes'), '406568068798480450'))
    );
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch likes data' }),
    };
  }
};