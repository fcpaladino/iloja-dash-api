const sendEmail = async({...props}) => {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: 'smtp.disparo@gmail.com',
      pass: 'gvjblvfpqcckbdmj',
    },
    debug: true,
    // host: "45.164.94.15",
    // port: 587,
    // secure: false,
    logger: false,
    // auth: {
    //   user: 'cadastro@zapshow.com.br',
    //   pass: 'mMl3%8f23',
    // },
    // tls: {rejectUnauthorized: false},

  });

  try {
    return await transporter.sendMail(props);
  } catch (error) {
    //logdev(error);
    return null;
  }
};

export default sendEmail;
