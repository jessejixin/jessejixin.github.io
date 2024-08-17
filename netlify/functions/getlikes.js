const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
    const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });
    const data = JSON.parse(event.body);
    const { item_id } = data;

    try {
        const result = await client.query(
            q.Get(q.Match(q.Index('likes_by_item_id'), item_id))
        );
        return {
            statusCode: 200,
            body: JSON.stringify({ likes: result.data.likes })
        };
    } catch (error) {
        if (error.name === 'NotFound') {
            return {
                statusCode: 200,
                body: JSON.stringify({ likes: 0 })
            };
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};