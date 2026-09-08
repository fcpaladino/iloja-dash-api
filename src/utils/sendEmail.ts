const sendEmail = async({...props}) => {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    logger: false,
  });

  try {
    return await transporter.sendMail(props);
  } catch (error) {
    console.error('Falha no envio de e-mail:', error);
    return null;
  }
};

export default sendEmail;
