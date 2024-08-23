const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async function (event, context) {
    const client = new faunadb.Client({
        secret: process.env.FAUNA_SECRET, // 使用你的 FaunaDB secret
    });

    const { itemId } = event.queryStringParameters; // 从请求参数中获取 itemId

    try {
        // 获取指定 item 的评论数量
        const response = await client.query(
            q.Count(
                q.Match(q.Index("comments_by_itemId"), itemId)
            )
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ count: response }),
        };
    } catch (error) {
        console.error('Error fetching comment count:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not fetch comment count' }),
        };
    }
};