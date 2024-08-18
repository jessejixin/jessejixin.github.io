const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const filePath = path.resolve(__dirname, 'likes.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const likes = JSON.parse(data);
    return {
      statusCode: 200,
      body: JSON.stringify(likes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not read likes data' }),
    };
  }
};