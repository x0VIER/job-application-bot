const LinkedInScraper = require('../scrapers/linkedinScraper');
const IndeedScraper = require('../scrapers/indeedScraper');
const fs = require('fs').promises;
const path = require('path');

class ApplicationController {
  constructor() {
    this.applicationsFile = path.join(__dirname, '../data/applications.json');
    this.isRunning = false;
    this.applications = [];
  }

  async loadApplications() {
    try {
      const data = await fs.readFile(this.applicationsFile, 'utf8');
      this.applications = JSON.parse(data);
    } catch (error) {
      this.applications = [];
    }
  }

  async saveApplications() {
    try {
      const dir = path.dirname(this.applicationsFile);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.applicationsFile, JSON.stringify(this.applications, null, 2));
    } catch (error) {
      console.error('Error saving applications:', error);
    }
  }

  async searchJobs(req, res) {
    try {
      const { keywords, location, platforms } = req.body;
      
      if (!keywords || !location) {
        return res.status(400).json({ error: 'Keywords and location are required' });
      }

      const allJobs = [];
      
      // Search LinkedIn
      if (!platforms || platforms.includes('linkedin')) {
        const linkedinScraper = new LinkedInScraper();
        await linkedinScraper.initialize();
        const linkedinJobs = await linkedinScraper.searchJobs(keywords, location);
        allJobs.push(...linkedinJobs);
        await linkedinScraper.close();
      }
      
      // Search Indeed
      if (!platforms || platforms.includes('indeed')) {
        const indeedScraper = new IndeedScraper();
        await indeedScraper.initialize();
        const indeedJobs = await indeedScraper.searchJobs(keywords, location);
        allJobs.push(...indeedJobs);
        await indeedScraper.close();
      }
      
      res.json({
        success: true,
        count: allJobs.length,
        jobs: allJobs
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async applyToJobs(req, res) {
    try {
      const { jobs, resumePath, coverLetter } = req.body;
      
      if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
        return res.status(400).json({ error: 'Jobs array is required' });
      }

      const results = [];
      
      for (const job of jobs) {
        // Check if already applied
        const alreadyApplied = this.applications.find(
          app => app.url === job.url
        );
        
        if (alreadyApplied) {
          results.push({
            job: job.title,
            company: job.company,
            status: 'skipped',
            message: 'Already applied to this position'
          });
          continue;
        }
        
        // Apply based on platform
        let result;
        if (job.platform === 'LinkedIn') {
          const scraper = new LinkedInScraper();
          await scraper.initialize();
          result = await scraper.applyToJob(job.url, resumePath, coverLetter);
          await scraper.close();
        } else if (job.platform === 'Indeed') {
          const scraper = new IndeedScraper();
          await scraper.initialize();
          result = await scraper.applyToJob(job.url, resumePath, coverLetter);
          await scraper.close();
        }
        
        // Save application record
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
        
        this.applications.push(application);
        await this.saveApplications();
        
        results.push({
          job: job.title,
          company: job.company,
          status: application.status,
          message: result.message
        });
        
        // Random delay between applications
        await this.randomDelay(3000, 6000);
      }
      
      res.json({
        success: true,
        results: results
      });
    } catch (error) {
      console.error('Application error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getApplications(req, res) {
    try {
      await this.loadApplications();
      res.json({
        success: true,
        applications: this.applications
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStats(req, res) {
    try {
      await this.loadApplications();
      
      const stats = {
        total: this.applications.length,
        successful: this.applications.filter(app => app.status === 'success').length,
        failed: this.applications.filter(app => app.status === 'failed').length,
        pending: this.applications.filter(app => app.status === 'pending').length
      };
      
      res.json({
        success: true,
        stats: stats
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

module.exports = new ApplicationController();
