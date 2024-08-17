const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const filePath = path.resolve(__dirname, '../../data/likes.json');

  try {
    // Read the JSON file
    const data = fs.readFileSync(filePath);
    const likes = JSON.parse(data);

    // Extract item ID from the request
    const { item_id } = JSON.parse(event.body);

    // Increment the like count for the given item
    likes[item_id] = (likes[item_id] || 0) + 1;

    // Save the updated likes back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(likes, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ likes: likes[item_id] }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};