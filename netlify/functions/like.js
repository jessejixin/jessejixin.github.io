// like.js
const likes = {}; // This is an in-memory store. For production, use a database.

exports.handler = async function(event, context) {
    const { item_id } = event.queryStringParameters || JSON.parse(event.body);

    if (event.httpMethod === 'GET') {
        // Retrieve like count from your database or storage
        const likes = await getLikeCount(item_id);
        return {
            statusCode: 200,
            body: JSON.stringify({ likes }),
        };
    } else if (event.httpMethod === 'POST') {
        // Increment the like count and save it
        const newLikes = await incrementLikeCount(item_id);
        return {
            statusCode: 200,
            body: JSON.stringify({ likes: newLikes }),
        };
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }
};