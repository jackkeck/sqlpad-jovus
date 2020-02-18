const nodemailer = require('nodemailer');
const config = require('./config');

/**
 * Get full sqlpad url
 * @param {string} path - path (leading slash)
 */
function fullUrl(path) {
  const port = config.get('port');
  const urlPort = port === 80 ? '' : ':' + port;
  const urlPublicUrl = config.get('publicUrl');
  const urlBaseUrl = config.get('baseUrl');
  return `${urlPublicUrl}${urlPort}${urlBaseUrl}${path}`;
}

function sendForgotPassword(to, passwordResetPath) {
  const url = fullUrl(passwordResetPath);
  const text = `Hello! \n\nYou recently requested a password reset for your SQLPad account. \n\nTo reset your password, visit ${url}.`;
  const html = `
    <p>Hello!</p>
    <p>You recently requested a password reset for your SQLPad account.</p>
    <p>To reset your password, visit <a href="${url}">${url}</a>.</p>
  `;
  return send(to, 'SQLPad Password Reset', text, html);
}

function sendInvite(to) {
  const url = fullUrl('/signup');
  const text = `Hello! \n\nA colleague has invited you to SQLPad. \n\nTo sign up, visit ${url}.`;
  const html = `
    <p>Hello!</p> 
    <p>A colleague has invited you to SQLPad.</p> 
    <p>To sign up, visit <a href="${url}">'${url}</a>.</p>
  `;
  return send(to, "You've been invited to SQLPad", text, html);
}

async function send(to, subject, text, html) {
  if (!config.smtpConfigured()) {
    console.error('email.send() called without being configured');
    return;
  }

  const smtpConfig = {
    host: config.get('smtpHost'),
    port: config.get('smtpPort'),
    secure: config.get('smtpSecure'),
    auth: {
      user: config.get('smtpUser'),
      pass: config.get('smtpPassword')
    },
    tls: {
      ciphers: 'SSLv3'
    }
  };

  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(smtpConfig);
    const mailOptions = {
      from: config.get('smtpFrom'),
      to,
      subject,
      text,
      html
    };
    transporter.sendMail(mailOptions, function(err, info) {
      if (config.get('debug')) {
        console.log('sent email: ' + info);
      }
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve(info);
    });
  });
}

module.exports = {
  fullUrl,
  send,
  sendForgotPassword,
  sendInvite
};
