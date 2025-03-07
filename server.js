require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


app.post("/send-email", async (req, res) => {
    const { name, emailPerson, subject, phone, message } = req.body;
    
    try {
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
        res.status(200).json({ message: "Correo enviado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al enviar el correo" });
    }
});

cron.schedule('*/14 * * * *', async () => {
    const URL = process.env.URL_SERV
    try {
      const response = await fetch(URL);
      console.log(`Ping al servidor exitoso: ${response.status} - ${new Date()}`);
    } catch (error) {
      console.error('Error al pingear el servidor:', error);
    }
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
