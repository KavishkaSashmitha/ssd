const nodemailer = require('nodemailer');
require('dotenv').config();
const sanitizeHtml = require('sanitize-html');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.sendMail = async (req, res) => {
  const { to, subject, text, html, attachments } = req.body;

  //Sanitize HTML content
  const sanitizedHtml = sanitizeHtml(html, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p'],
    allowedAttributes: {}
  });

  try {
    // Create mail options
    const to = 'kavindi@gmail.com';

    const mailOptions = {
      from: {
        name: 'Herbal Heaven',
        address: process.env.EMAIL,
      },
      to: to,
      subject: sanitizeHtml(subject, { allowedTags: [] }),
      text: sanitizeHtml(text, { allowedTags: [] }),
      html: sanitizedHtml,
      attachments

    };

    // Send mail
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error });
  }
};
