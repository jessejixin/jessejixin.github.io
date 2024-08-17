// like.js
const likes = {}; // This is an in-memory store. For production, use a database.

exports.handler = async function (event, context) {
    const { item_id } = JSON.parse(event.body);

    if (!item_id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Item ID is required" }),
        };
    }

    // Increment the like count
    if (!likes[item_id]) {
        likes[item_id] = 0;
    }
    likes[item_id] += 1;

    return {
        statusCode: 200,
        body: JSON.stringify({ likes: likes[item_id] }),
    };
};