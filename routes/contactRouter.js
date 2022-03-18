const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ msg: "getting contacts" });
});

router.post("/", (req, res) => {
  const { email, name, subject, message } = req.body;
  console.log(process.env.EMAIL, process.env.PASS);
  console.log(email, name, subject, message);
  console.log(req.body);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: "ngelelilitha18@gmail.com",
    subject: `${subject}`,
    text: `${name} has contacted you
  
  ${message} `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      
      res.status(400).send({ msg: "Email has not been sent" });
    console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.send({ msg: "Email has been sent successfully" });
    }
  });
});

module.exports = router;
