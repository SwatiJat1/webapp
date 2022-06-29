const nodemailer=require('nodemailer');

const sendEmail=async options=>{
    const  transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "32a66016c622f8",
          pass:"e6c4f2c1cf8b7a"
        }
      });
      const message={
         from:`${process.env.SMTP_FROM_NAME}<${process.env.SMTP_FROM_EMAIL}`,
          to:options.email,
          subject:options.subject,
          text:options.message
      }
      await transporter.sendMail(message)
}
module.exports=sendEmail;