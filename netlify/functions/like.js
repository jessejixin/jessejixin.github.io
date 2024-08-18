const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  try {
    const { item_id } = JSON.parse(event.body);
    const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

    const response = await client.query(
      q.Update(
        q.Ref(q.Collection('likes'), '406568068798480450'),
        {
          data: {
            [item_id]: q.Add(q.Select(["data", item_id], q.Get(q.Ref(q.Collection('likes'), '406568068798480450')), 0), 1)
          }
        }
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update likes data' }),
    };
  }
};