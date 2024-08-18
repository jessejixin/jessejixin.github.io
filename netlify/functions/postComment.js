const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });
        
        const response = await client.query(
            q.Create(q.Collection('comments'), {
                data: {
                    item_id: data.item_id,
                    name: data.name,
                    comment: data.comment,
                    timestamp: new Date().toISOString()
                }
            })
        );
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, comment: response })
        };
    } catch (error) {
        console.error('Error submitting comment:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to submit comment' })
        };
    }
};