const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
require('dotenv').config({ path: `${global.__basedir}\\config.env` });

// module.exports = class Email {
//   constructor(user, alarm) {
//     this.to = user.email;
//     this.name = user.name;
//     this.from = `Alex Anh Le <${process.env.EMAIL_FROM}>`;
//     this.alarm = alarm;
//   }

//   // set up host
//   newTransport() {
//     if (process.env.NODE_ENV !== 'production') {
//       return nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//           user: process.env.EMAIL_USERNAME,
//           pass: process.env.EMAIL_PASSWORD,
//         },
//       });
//     }
//   }

//   async send(template, subject) {
//     const html = pug.renderFile(
//       `${global.__basedir}\\src\\views\\email\\${template}.pug`,
//       {
//         name: this.alarm.parameter.name.replace('_', ' '),
//         value: this.alarm.parameter.value,
//         type: this.alarm.type,
//         createdAt: this.alarm.parameter.createdAt,
//         subject,
//       }
//     );

//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: htmlToText(html),
//     };

//     await this.newTransport().sendMail(mailOptions);
//   }

//   async sendAlarm() {
//     await this.send('alarm', 'Report the alarm realtime');
//   }
// };

module.exports = class Email {
  constructor(user, alarm) {
    this.to = user.email;
    this.alarm = alarm;
    this._createOAuth2Clients();
  }

  _createOAuth2Clients = () => {
    this.myOAuth2Client = new OAuth2Client(
      process.env.GOOGLE_MAILER_CLIENT_ID,
      process.env.GOOGLE_MAILER_CLIENT_SECRET
    );

    this.myOAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
    });
  };

  async _send(template, subject) {
    try {
      const html = pug.renderFile(
        `${global.__basedir}\\src\\views\\email\\${template}.pug`,
        {
          name: this.alarm.parameter.name.replace('_', ' '),
          value: this.alarm.parameter.value,
          type: this.alarm.type,
          createdAt: this.alarm.parameter.createdAt,
          subject,
        }
      );
      const myAccessTokenObject = await this.myOAuth2Client.getAccessToken();
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
        to: this.to,
        subject,
        html,
        text: htmlToText(html),
      };

      await transport.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }

  async sendAlarm() {
    await this._send('alarm', 'Report the alarm realtime');
  }
};
