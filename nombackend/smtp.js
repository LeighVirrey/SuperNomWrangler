const nodemailer = require("nodemailer");

const getSMTPConfig = (provider) => {
  const configs = {
    gmail: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASSWORD,
      },
    },
    yahoo: {
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.YAHOO_ADDRESS,
        pass: process.env.YAHOO_PASSWORD,
      },
    },
    outlook: {
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_ADDRESS,
        pass: process.env.OUTLOOK_PASSWORD,
      },
    },
    hotmail: {
      host: "smtp.live.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.HOTMAIL_ADDRESS,
        pass: process.env.HOTMAIL_PASSWORD,
      },
    },
  };

  return configs[provider];
};

const sendEmail = async (provider, to, subject, text) => {
  try {
    const smtpConfig = getSMTPConfig(provider);
    if (!smtpConfig) {
      throw new Error(`SMTP configuration for provider '${provider}' is not available.`);
    }

    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
      from: smtpConfig.auth.user,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;
