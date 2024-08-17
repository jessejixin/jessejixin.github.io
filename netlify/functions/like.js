const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'likes.json');

exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        // Read the current likes
        const data = fs.readFileSync(filePath);
        const likes = JSON.parse(data);

        return {
            statusCode: 200,
            body: JSON.stringify(likes),
        };
    } else if (event.httpMethod === 'POST') {
        const { item_id } = JSON.parse(event.body);

        // Read and update the like count
        const data = fs.readFileSync(filePath);
        const likes = JSON.parse(data);
        likes[item_id] = likes[item_id] ? likes[item_id] + 1 : 1;

        // Write updated likes back to file
        fs.writeFileSync(filePath, JSON.stringify(likes));

        return {
            statusCode: 200,
            body: JSON.stringify({ likes: likes[item_id] }),
        };
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }
};