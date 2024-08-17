const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'likes.json');

exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        // Read the current likes
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            const likes = JSON.parse(data);

            return {
                statusCode: 200,
                body: JSON.stringify(likes),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to fetch likes' }),
            };
        }
    } else if (event.httpMethod === 'POST') {
        const { item_id } = JSON.parse(event.body);

        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            const likes = JSON.parse(data);
            likes[item_id] = likes[item_id] ? likes[item_id] + 1 : 1;

            fs.writeFileSync(filePath, JSON.stringify(likes));

            return {
                statusCode: 200,
                body: JSON.stringify({ likes: likes[item_id] }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to update likes' }),
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }
};