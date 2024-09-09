// functions/create-license.js
const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { license_id, expiration_date, email, transactionId } = JSON.parse(event.body);

    // Make request to Faldon Idle Server
    const response = await axios.post('https://faldon-idle-server-fbfdcd5d8349.herokuapp.com/create_license', {
      license_id,
      expiration_date
    });

    if (response.status === 200) {
      // Here you could implement email sending logic
      console.log(`License ${license_id} created for ${email}`);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'License created successfully' })
      };
    } else {
      throw new Error('Failed to create license');
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Failed to create license' })
    };
  }
};