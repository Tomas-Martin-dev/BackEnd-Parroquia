const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  // Configuración de CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Manejo de preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: 'Preflight OK'
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  try {
    const { name, emailPerson, subject, phone, message } = JSON.parse(event.body);

    await transporter.sendMail({
      from: `<${process.env.EMAIL_USER}>`,
      to: `${process.env.EMAIL_DESTINO}`,
      subject: `MENSAJE DESDE WEB`,
      html: ` <p>ASUNTO: ${subject}</p>
      <br>
      <b>--- Informacion de Remitente ---</b>
      <p>Nombre: ${name}</p>
      <p>Correo: ${emailPerson}</p>
      <p>Telefono: ${phone}</p>
      <br>
      <b>----MENSAJE----</b>
      <p>${message}</p>
      `
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Correo enviado con éxito" })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error al enviar el correo", error: error.message })
    };
  }
};