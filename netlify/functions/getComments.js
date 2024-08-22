const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
    const { itemId } = event.queryStringParameters;

    const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

    try {
        const result = await client.query(
            q.Map(
                q.Paginate(q.Match(q.Index('comments_by_itemId'), itemId)),
                q.Lambda('X', q.Get(q.Var('X')))
            )
        );
        const comments = result.data.map(comment => comment.data);

        return {
            statusCode: 200,
            body: JSON.stringify(comments)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not fetch comments' })
        };
    }
};