const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const URL = process.env.URL_SERV;
    const response = await fetch(URL);
    console.log(`Ping al servidor exitoso: ${response.status} - ${new Date()}`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Ping exitoso' })
    };
  } catch (error) {
    console.error('Error al pingear el servidor:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error en ping' })
    };
  }
};