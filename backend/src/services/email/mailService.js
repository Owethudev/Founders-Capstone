const nodemailer = require('nodemailer');
const { buildWelcomeTemplate, buildPasswordResetTemplate, buildBorrowRequestReceivedTemplate, buildBorrowRequestAcceptedTemplate, buildToolReturnedTemplate, buildWeeklySummaryTemplate } = require('./templates');

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
}

function buildEmailPayload({ to, subject, html, text }) {
  return {
    from: process.env.EMAIL_FROM || 'Founders Capstone <no-reply@founderscapstone.app>',
    to,
    subject,
    html,
    text,
  };
}

async function sendMail({ to, subject, html, text }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP configuration missing; skipping email send');
    return { skipped: true, reason: 'smtp-not-configured' };
  }

  const payload = buildEmailPayload({ to, subject, html, text });
  const mailTransporter = getTransporter();
  return mailTransporter.sendMail(payload);
}

async function sendWelcomeEmail(user) {
  const html = buildWelcomeTemplate(user);
  return sendMail({
    to: user.email,
    subject: 'Welcome to Founders Capstone',
    html,
    text: `Welcome ${user.name}, thanks for joining Founders Capstone.`,
  });
}

async function sendPasswordResetEmail(user, resetUrl) {
  const html = buildPasswordResetTemplate(user, resetUrl);
  return sendMail({
    to: user.email,
    subject: 'Reset your password',
    html,
    text: `Hello ${user.name}, use this link to reset your password: ${resetUrl}`,
  });
}

async function sendBorrowRequestReceivedEmail(user, borrowRequest) {
  const html = buildBorrowRequestReceivedTemplate(user, borrowRequest);
  return sendMail({
    to: user.email,
    subject: 'Your borrow request was received',
    html,
    text: `Hi ${user.name}, your borrow request for ${borrowRequest.toolName || 'a tool'} was received.`,
  });
}

async function sendBorrowRequestAcceptedEmail(user, borrowRequest) {
  const html = buildBorrowRequestAcceptedTemplate(user, borrowRequest);
  return sendMail({
    to: user.email,
    subject: 'Your borrow request was accepted',
    html,
    text: `Hi ${user.name}, your borrow request for ${borrowRequest.toolName || 'a tool'} was accepted.`,
  });
}

async function sendToolReturnedEmail(user, tool) {
  const html = buildToolReturnedTemplate(user, tool);
  return sendMail({
    to: user.email,
    subject: 'Tool returned successfully',
    html,
    text: `Hi ${user.name}, your tool ${tool?.name || 'item'} has been marked as returned.`,
  });
}

async function sendWeeklySummaryEmail(user, summary) {
  const html = buildWeeklySummaryTemplate(user, summary);
  return sendMail({
    to: user.email,
    subject: 'Your weekly summary',
    html,
    text: `Hi ${user.name}, your weekly summary is ready.`,
  });
}

module.exports = {
  sendMail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendBorrowRequestReceivedEmail,
  sendBorrowRequestAcceptedEmail,
  sendToolReturnedEmail,
  sendWeeklySummaryEmail,
};
