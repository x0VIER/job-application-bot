const cron = require('node-cron');
const LinkedInScraper = require('../scrapers/linkedinScraper');
const IndeedScraper = require('../scrapers/indeedScraper');
const aiService = require('../services/aiService');
const notificationService = require('../services/notificationService');
const fs = require('fs').promises;
const path = require('path');

class JobScheduler {
  constructor() {
    this.configFile = path.join(__dirname, '../data/config.json');
    this.applicationsFile = path.join(__dirname, '../data/applications.json');
    this.isRunning = false;
    this.dailyCount = 0;
    this.dailyLimit = parseInt(process.env.DAILY_LIMIT) || 50;
  }

  async loadConfig() {
    try {
      const data = await fs.readFile(this.configFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {
        keywords: 'Software Engineer',
        location: 'Remote',
        platforms: ['linkedin', 'indeed'],
        enabled: false
      };
    }
  }

  async loadApplications() {
    try {
      const data = await fs.readFile(this.applicationsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveApplication(application) {
    try {
      const applications = await this.loadApplications();
      applications.push(application);
      const dir = path.dirname(this.applicationsFile);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.applicationsFile, JSON.stringify(applications, null, 2));
    } catch (error) {
      console.error('Error saving application:', error);
    }
  }

  async isDuplicate(jobUrl) {
    const applications = await this.loadApplications();
    return applications.some(app => app.url === jobUrl);
  }

  async runJobSearch() {
    if (!this.isRunning) {
      console.log('Scheduler is paused');
      return;
    }

    if (this.dailyCount >= this.dailyLimit) {
      console.log(`Daily limit of ${this.dailyLimit} applications reached`);
      return;
    }

    console.log('Running scheduled job search...');
    
    try {
      const config = await this.loadConfig();
      
      if (!config.enabled) {
        console.log('Automation is disabled in config');
        return;
      }

      const allJobs = [];
      
      // Search LinkedIn
      if (config.platforms.includes('linkedin')) {
        const scraper = new LinkedInScraper();
        await scraper.initialize();
        const jobs = await scraper.searchJobs(config.keywords, config.location);
        allJobs.push(...jobs);
        await scraper.close();
      }
      
      // Search Indeed
      if (config.platforms.includes('indeed')) {
        const scraper = new IndeedScraper();
        await scraper.initialize();
        const jobs = await scraper.searchJobs(config.keywords, config.location);
        allJobs.push(...jobs);
        await scraper.close();
      }
      
      console.log(`Found ${allJobs.length} jobs`);
      
      // Filter out duplicates
      const newJobs = [];
      for (const job of allJobs) {
        if (!(await this.isDuplicate(job.url))) {
          newJobs.push(job);
        }
      }
      
      console.log(`${newJobs.length} new jobs after filtering duplicates`);
      
      if (newJobs.length > 0 && config.userEmail) {
        await notificationService.sendNewJobAlert(config.userEmail, newJobs.slice(0, 5));
      }
      
      // Apply to jobs (respecting daily limit)
      const jobsToApply = newJobs.slice(0, this.dailyLimit - this.dailyCount);
      
      for (const job of jobsToApply) {
        if (this.dailyCount >= this.dailyLimit) break;
        
        try {
          let scraper;
          if (job.platform === 'LinkedIn') {
            scraper = new LinkedInScraper();
          } else if (job.platform === 'Indeed') {
            scraper = new IndeedScraper();
          }
          
          if (scraper) {
            await scraper.initialize();
            const result = await scraper.applyToJob(job.url, config.resumePath, '');
            await scraper.close();
            
            const application = {
              id: Date.now() + Math.random(),
              title: job.title,
              company: job.company,
              location: job.location,
              platform: job.platform,
              url: job.url,
              status: result.success ? 'success' : 'failed',
              message: result.message,
              timestamp: new Date().toISOString()
            };
            
            await this.saveApplication(application);
            this.dailyCount++;
            
            if (config.userEmail) {
              await notificationService.sendApplicationNotification(
                config.userEmail,
                application,
                application.status
              );
            }
            
            console.log(`Applied to: ${job.title} at ${job.company} - ${application.status}`);
            
            // Random delay between applications (3-6 seconds)
            await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 3000));
          }
        } catch (error) {
          console.error(`Error applying to ${job.title}:`, error.message);
        }
      }
      
    } catch (error) {
      console.error('Scheduled job error:', error);
    }
  }

  start() {
    console.log('Starting job scheduler...');
    this.isRunning = true;
    
    // Run every 5 minutes
    this.jobTask = cron.schedule('*/5 * * * *', async () => {
      await this.runJobSearch();
    });
    
    // Reset daily count at midnight
    this.resetTask = cron.schedule('0 0 * * *', () => {
      console.log('Resetting daily application count');
      this.dailyCount = 0;
    });
    
    console.log('Scheduler started - running every 5 minutes');
  }

  stop() {
    console.log('Stopping job scheduler...');
    this.isRunning = false;
    if (this.jobTask) {
      this.jobTask.stop();
    }
    if (this.resetTask) {
      this.resetTask.stop();
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      dailyCount: this.dailyCount,
      dailyLimit: this.dailyLimit
    };
  }
}

module.exports = new JobScheduler();
