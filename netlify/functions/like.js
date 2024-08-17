const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
    const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });
    const data = JSON.parse(event.body);
    const { item_id } = data;

    try {
        const exists = await client.query(
            q.Exists(q.Match(q.Index('likes_by_item_id'), item_id))
        );

        if (exists) {
            const result = await client.query(
                q.Update(q.Select('ref', q.Get(q.Match(q.Index('likes_by_item_id'), item_id))), {
                    data: { likes: q.Add(q.Select(['data', 'likes'], q.Get(q.Match(q.Index('likes_by_item_id'), item_id))), 1) }
                })
            );
            return {
                statusCode: 200,
                body: JSON.stringify({ likes: result.data.likes })
            };
        } else {
            const result = await client.query(
                q.Create(q.Collection('likes'), { data: { item_id, likes: 1 } })
            );
            return {
                statusCode: 200,
                body: JSON.stringify({ likes: result.data.likes })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};