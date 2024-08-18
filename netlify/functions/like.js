const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const filePath = path.resolve(__dirname, 'likes.json');
  const { item_id } = JSON.parse(event.body);

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const likes = JSON.parse(data);

    likes[item_id] = (likes[item_id] || 0) + 1;

    fs.writeFileSync(filePath, JSON.stringify(likes, null, 2), 'utf8');

    return {
      statusCode: 200,
      body: JSON.stringify({ likes: likes[item_id] }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update likes data' }),
    };
  }
};