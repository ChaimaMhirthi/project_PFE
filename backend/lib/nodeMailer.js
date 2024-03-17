const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "mhirthichaima80@gmail.com",
    pass: "euyn pufx flks qhql",
  },
});
const message = {
    from: '"chaima mhirthi👻" mhirthichaima80@gmail.com', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: subject, // plain text body
    html: html, // html body
  }
 const nodemailer=async(to,subject,html)=>{
  const info = await transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    }else {
        console.log("Message sent: %s", info.response);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    
  });   }

module.exports = nodemailer;
