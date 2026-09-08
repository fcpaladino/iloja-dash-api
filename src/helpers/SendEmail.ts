const SendEmail = async({...props}) => {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    debug: false,
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    logger: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false'},

  });

  try {
    return await transporter.sendMail(props);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default SendEmail;
