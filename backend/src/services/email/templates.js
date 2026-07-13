function baseLayout(title, body) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; max-width: 640px; margin: 0 auto;">
      <div style="background: #111827; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Founders Capstone</h1>
      </div>
      <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 8px 8px; background: #ffffff;">
        <h2 style="margin-top: 0;">${title}</h2>
        <div>${body}</div>
        <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">This is an automated message from Founders Capstone.</p>
      </div>
    </div>
  `;
}

function buildWelcomeTemplate(user) {
  return baseLayout(
    'Welcome aboard!',
    `<p>Hi ${user.name || 'there'},</p><p>Thanks for joining Founders Capstone. You can now discover tools, send borrow requests, and connect with other members.</p>`
  );
}

function buildPasswordResetTemplate(user, resetUrl) {
  return baseLayout(
    'Reset your password',
    `<p>Hi ${user.name || 'there'},</p><p>We received a request to reset your password. Use the link below to continue.</p><p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">Reset Password</a></p><p>If you did not request this, you can safely ignore this email.</p>`
  );
}

function buildBorrowRequestReceivedTemplate(user, borrowRequest) {
  return baseLayout(
    'Borrow request received',
    `<p>Hi ${user.name || 'there'},</p><p>Your borrow request for <strong>${borrowRequest.toolName || 'a tool'}</strong> has been received and is pending review.</p>`
  );
}

function buildBorrowRequestAcceptedTemplate(user, borrowRequest) {
  return baseLayout(
    'Borrow request accepted',
    `<p>Hi ${user.name || 'there'},</p><p>Your request for <strong>${borrowRequest.toolName || 'a tool'}</strong> was accepted. Please coordinate pickup and return timing with the owner.</p>`
  );
}

function buildToolReturnedTemplate(user, tool) {
  return baseLayout(
    'Tool returned',
    `<p>Hi ${user.name || 'there'},</p><p>The tool <strong>${tool?.name || 'item'}</strong> has been marked as returned. Thanks for using Founders Capstone.</p>`
  );
}

function buildWeeklySummaryTemplate(user, summary) {
  return baseLayout(
    'Your weekly summary',
    `<p>Hi ${user.name || 'there'},</p><p>Here’s your weekly summary:</p><ul>${(summary?.items || []).map((item) => `<li>${item}</li>`).join('')}</ul>`
  );
}

module.exports = {
  buildWelcomeTemplate,
  buildPasswordResetTemplate,
  buildBorrowRequestReceivedTemplate,
  buildBorrowRequestAcceptedTemplate,
  buildToolReturnedTemplate,
  buildWeeklySummaryTemplate,
};
