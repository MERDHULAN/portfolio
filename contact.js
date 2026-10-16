// Vercel serverless function: receives the contact form and emails it to you.
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const { name = '', email = '', msg = '', website = '' } = req.body || {};
  if (website) return res.status(200).json({ ok: true }); // spam trap: bots fill this hidden field

  const cleanName = String(name).replace(/[\r\n]/g, ' ').trim();
  const okEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!cleanName || cleanName.length > 100 || !okEmail || !msg || String(msg).length > 3000) {
    return res.status(400).json({ ok: false });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variable');
    return res.status(500).json({ ok: false, reason: 'config' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: `${cleanName} <${email}>`,
      subject: `Portfolio message from ${cleanName}`,
      text: `${msg}\n\nFrom: ${cleanName} (${email})`
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Send failed:', err.code, err.message);
    return res.status(500).json({ ok: false, reason: 'send' });
  }
};