const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
require('dotenv').config({ path: './config.env' });

module.exports = class Email {
  constructor(user, alarm) {
    this.to = user.email;
    this.name = user.name;
    this.from = `Alex Anh Le <${process.env.EMAIL_FROM}>`;
    this.alarm = alarm;
  }

  // set up host
  newTransport() {
    if (process.env.NODE_ENV !== 'production') {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${global.__basedir}/views/email/${template}.pug`,
      {
        alarm: this.alarm.parameter,
        subject,
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendAlarm() {
    await this.sendAlarm('alarm', 'Report the alarm realtime');
  }
};
