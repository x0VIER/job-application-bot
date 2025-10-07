const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendApplicationNotification(userEmail, jobDetails, status) {
    try {
      const subject = status === 'success' 
        ? `✅ Successfully Applied: ${jobDetails.title} at ${jobDetails.company}`
        : `⚠️ Application Issue: ${jobDetails.title} at ${jobDetails.company}`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${status === 'success' ? '#10b981' : '#ef4444'};">
            Application ${status === 'success' ? 'Successful' : 'Failed'}
          </h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Position:</strong> ${jobDetails.title}</p>
            <p><strong>Company:</strong> ${jobDetails.company}</p>
            <p><strong>Location:</strong> ${jobDetails.location}</p>
            <p><strong>Platform:</strong> ${jobDetails.platform}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          ${status === 'success' 
            ? '<p style="color: #10b981;">Your application has been submitted successfully!</p>'
            : '<p style="color: #ef4444;">There was an issue with your application. Please review manually.</p>'
          }
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This is an automated notification from Job Application Bot
          </p>
        </div>
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: subject,
        html: html
      });

      console.log(`Notification sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Email notification error:', error.message);
      return false;
    }
  }

  async sendDailySummary(userEmail, stats) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">Daily Application Summary</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Today's Statistics</h3>
            <p><strong>Total Applications:</strong> ${stats.total}</p>
            <p style="color: #10b981;"><strong>Successful:</strong> ${stats.successful}</p>
            <p style="color: #f59e0b;"><strong>Pending:</strong> ${stats.pending}</p>
            <p style="color: #ef4444;"><strong>Failed:</strong> ${stats.failed}</p>
          </div>
          <p>Keep up the great work! Your job search is making progress.</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This is an automated daily summary from Job Application Bot
          </p>
        </div>
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: '📊 Daily Job Application Summary',
        html: html
      });

      console.log(`Daily summary sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Daily summary email error:', error.message);
      return false;
    }
  }

  async sendNewJobAlert(userEmail, jobs) {
    try {
      const jobList = jobs.map(job => `
        <div style="background: #f9fafb; padding: 15px; margin: 10px 0; border-left: 4px solid #8b5cf6; border-radius: 4px;">
          <h4 style="margin: 0 0 10px 0;">${job.title}</h4>
          <p style="margin: 5px 0;"><strong>Company:</strong> ${job.company}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${job.location}</p>
          <p style="margin: 5px 0;"><strong>Platform:</strong> ${job.platform}</p>
        </div>
      `).join('');

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">🎯 New Job Opportunities Found!</h2>
          <p>We found ${jobs.length} new job(s) matching your criteria:</p>
          ${jobList}
          <p style="margin-top: 20px;">The bot will automatically apply to these positions based on your settings.</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This is an automated notification from Job Application Bot
          </p>
        </div>
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `🎯 ${jobs.length} New Job Opportunities Found`,
        html: html
      });

      console.log(`New job alert sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('New job alert error:', error.message);
      return false;
    }
  }
}

module.exports = new NotificationService();
