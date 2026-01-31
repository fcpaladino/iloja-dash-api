const SendEmail = async({...props}) => {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    // service: "Gmail",
    // auth: {
    //   user: 'smtp.disparo@gmail.com',
    //   pass: 'gvjblvfpqcckbdmj',
    // },
    debug: false,
    host: "45.164.94.15",
    port: 587,
    secure: false,
    logger: false,
    auth: {
      user: 'cadastro@zapshow.com.br',
      pass: 'mMl3%8f23',
    },
    tls: {rejectUnauthorized: false},

  });

  try {
    return await transporter.sendMail(props);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default SendEmail;
