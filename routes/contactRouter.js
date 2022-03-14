const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config;

const router = express.Router();

router.get("/", (req, res) =>
  res.send({
    msg: "Please use a POST request to send an email",
    email_template: {
      name: "Lilitha Ngele",
      email: "ngelelilitha18@gmail.com",
      contact: "0123456789",
      message:
        "I love you Jesus",
    },
  })
);

router.post("/", (req, res) => {
  let { name, email, contact, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.USER,
    subject: "New message from Lilitha's blog",
    html: `
<h1>${name} is interested in your stories.</h1>
<p>Contact them on:</p>
<ul>
    <li><a href='tel:${contact}'>${contact}</a></li>
    <li><a href='mailto:${email}'>${email}</a></li>
</ul> 
<p>${message}</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(400).send({
        msg: `Email not sent
      
      ${error}  `,
      });
    } else {
      console.log("Email sent: " + info.response);
      res.send({ msg: "Email has been sent successfully" });
    }
  });
});

module.exports = router;
