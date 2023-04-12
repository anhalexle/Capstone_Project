const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const catchAsync = require('../utils/catchAsync.util');
const AppError = require('../utils/appError.util');

dotenv.config({ path: `${global.__basedir}\\config.env` });

const createOAuth2Clients = () => {
  const myOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_MAILER_CLIENT_ID,
    process.env.GOOGLE_MAILER_CLIENT_SECRET
  );

  myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
  });
  return myOAuth2Client;
};

exports.sendRealEmail = catchAsync(async (req, res, next) => {
  const { email, subject, content } = req.body;
  if (!email || !subject || !content) {
    return next(new AppError('Please provide email, subject and content', 400));
  }
  const myOAuth2Client = createOAuth2Clients();
  const myAccessTokenObject = await myOAuth2Client.getAccessToken();
  const myAccessToken = myAccessTokenObject?.token;
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.ADMIN_EMAIL_ADDRESS,
      clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
      clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
      accessToken: myAccessToken,
    },
  });
  const mailOptions = {
    to: email,
    subject,
    html: `<h3>${content}</h3>`,
  };
  await transport.sendMail(mailOptions);
  res
    .status(200)
    .json({ status: 'success', message: 'Send email successfully' });
});
