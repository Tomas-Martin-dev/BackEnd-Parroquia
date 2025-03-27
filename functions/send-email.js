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
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    const { name, emailPerson, subject, phone, message } = JSON.parse(event.body);

    await transporter.sendMail({
      from: `<${process.env.EMAIL_USER}>`,
      to: `${process.env.EMAIL_DESTINO}`,
      subject,
      html: ` <b>---Informacion de ${name}---</b>
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
      body: JSON.stringify({ message: "Error al enviar el correo" })
    };
  }
};