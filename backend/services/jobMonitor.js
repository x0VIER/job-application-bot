const LinkedInScraper = require('../scrapers/linkedinScraper');
const IndeedScraper = require('../scrapers/indeedScraper');
const notificationService = require('./notificationService');
const fs = require('fs').promises;
const path = require('path');

class JobMonitor {
  constructor() {
    this.isMonitoring = false;
    this.monitorInterval = null;
    this.checkIntervalMs = 2 * 60 * 1000; // Check every 2 minutes
    this.seenJobsFile = path.join(__dirname, '../data/seen-jobs.json');
    this.watchListFile = path.join(__dirname, '../data/watch-list.json');
    this.seenJobs = new Set();
    this.watchList = [];
    this.dailyApplicationCount = 0;
    this.dailyLimit = 50;
  }

  async initialize() {
    // Load seen jobs
    try {
      const data = await fs.readFile(this.seenJobsFile, 'utf8');
      const jobs = JSON.parse(data);
      this.seenJobs = new Set(jobs);
    } catch (error) {
      this.seenJobs = new Set();
    }

    // Load watch list
    try {
      const data = await fs.readFile(this.watchListFile, 'utf8');
      this.watchList = JSON.parse(data);
    } catch (error) {
      this.watchList = [];
    }

    console.log(`Job Monitor initialized with ${this.watchList.length} watch criteria`);
  }

  async saveSeenJobs() {
    try {
      const dir = path.dirname(this.seenJobsFile);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(
        this.seenJobsFile,
        JSON.stringify([...this.seenJobs], null, 2)
      );
    } catch (error) {
      console.error('Error saving seen jobs:', error);
    }
  }

  async saveWatchList() {
    try {
      const dir = path.dirname(this.watchListFile);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(
        this.watchListFile,
        JSON.stringify(this.watchList, null, 2)
      );
    } catch (error) {
      console.error('Error saving watch list:', error);
    }
  }

  addWatchCriteria(criteria) {
    const watchItem = {
      id: Date.now() + Math.random(),
      keywords: criteria.keywords,
      location: criteria.location,
      platforms: criteria.platforms || ['linkedin', 'indeed'],
      autoApply: criteria.autoApply !== false,
      filters: {
        minSalary: criteria.minSalary || null,
        remote: criteria.remote || false,
        experienceLevel: criteria.experienceLevel || null,
        jobType: criteria.jobType || null, // full-time, contract, etc.
      },
      createdAt: new Date().toISOString(),
      enabled: true
    };

    this.watchList.push(watchItem);
    this.saveWatchList();
    
    console.log(`Added watch criteria: ${criteria.keywords} in ${criteria.location}`);
    return watchItem;
  }

  removeWatchCriteria(id) {
    this.watchList = this.watchList.filter(item => item.id !== id);
    this.saveWatchList();
    console.log(`Removed watch criteria: ${id}`);
  }

  updateWatchCriteria(id, updates) {
    const index = this.watchList.findIndex(item => item.id === id);
    if (index !== -1) {
      this.watchList[index] = { ...this.watchList[index], ...updates };
      this.saveWatchList();
      console.log(`Updated watch criteria: ${id}`);
      return this.watchList[index];
    }
    return null;
  }

  getWatchList() {
    return this.watchList;
  }

  async checkForNewJobs() {
    if (this.dailyApplicationCount >= this.dailyLimit) {
      console.log('Daily application limit reached. Pausing auto-apply.');
      return;
    }

    console.log(`[${new Date().toISOString()}] Checking for new jobs...`);

    for (const watchItem of this.watchList) {
      if (!watchItem.enabled) continue;

      try {
        const newJobs = await this.searchForNewJobs(watchItem);
        
        if (newJobs.length > 0) {
          console.log(`Found ${newJobs.length} new jobs for: ${watchItem.keywords}`);
          
          // Filter by criteria
          const filteredJobs = this.applyFilters(newJobs, watchItem.filters);
          
          if (filteredJobs.length > 0) {
            console.log(`${filteredJobs.length} jobs passed filters`);
            
            // Notify user about new jobs
            if (watchItem.userEmail) {
              await notificationService.sendNewJobAlert(
                watchItem.userEmail,
                filteredJobs.slice(0, 5)
              );
            }

            // Auto-apply if enabled
            if (watchItem.autoApply) {
              await this.autoApplyToJobs(filteredJobs, watchItem);
            }
          }
        }
      } catch (error) {
        console.error(`Error checking jobs for ${watchItem.keywords}:`, error.message);
      }

      // Small delay between watch items
      await this.delay(5000);
    }
  }

  async searchForNewJobs(watchItem) {
    const allJobs = [];
    const newJobs = [];

    // Search LinkedIn
    if (watchItem.platforms.includes('linkedin')) {
      try {
        const scraper = new LinkedInScraper();
        await scraper.initialize();
        const jobs = await scraper.searchJobs(watchItem.keywords, watchItem.location);
        allJobs.push(...jobs);
        await scraper.close();
      } catch (error) {
        console.error('LinkedIn search error:', error.message);
      }
    }

    // Search Indeed
    if (watchItem.platforms.includes('indeed')) {
      try {
        const scraper = new IndeedScraper();
        await scraper.initialize();
        const jobs = await scraper.searchJobs(watchItem.keywords, watchItem.location);
        allJobs.push(...jobs);
        await scraper.close();
      } catch (error) {
        console.error('Indeed search error:', error.message);
      }
    }

    // Filter out jobs we've already seen
    for (const job of allJobs) {
      const jobId = this.generateJobId(job);
      if (!this.seenJobs.has(jobId)) {
        this.seenJobs.add(jobId);
        newJobs.push(job);
      }
    }

    await this.saveSeenJobs();
    return newJobs;
  }

  applyFilters(jobs, filters) {
    return jobs.filter(job => {
      // Remote filter
      if (filters.remote && !job.location.toLowerCase().includes('remote')) {
        return false;
      }

      // Add more filters as needed
      // Salary, experience level, etc. would require parsing job descriptions

      return true;
    });
  }

  async autoApplyToJobs(jobs, watchItem) {
    const applicationsFile = path.join(__dirname, '../data/applications.json');
    
    for (const job of jobs) {
      if (this.dailyApplicationCount >= this.dailyLimit) {
        console.log('Daily limit reached during auto-apply');
        break;
      }

      try {
        console.log(`Auto-applying to: ${job.title} at ${job.company}`);

        let scraper;
        if (job.platform === 'LinkedIn') {
          scraper = new LinkedInScraper();
        } else if (job.platform === 'Indeed') {
          scraper = new IndeedScraper();
        }

        if (scraper) {
          await scraper.initialize();
          const result = await scraper.applyToJob(
            job.url,
            watchItem.resumePath || '',
            ''
          );
          await scraper.close();

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
            timestamp: new Date().toISOString(),
            autoApplied: true,
            watchCriteriaId: watchItem.id
          };

          // Save to applications file
          try {
            let applications = [];
            try {
              const data = await fs.readFile(applicationsFile, 'utf8');
              applications = JSON.parse(data);
            } catch (e) {
              // File doesn't exist yet
            }
            applications.push(application);
            const dir = path.dirname(applicationsFile);
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(applicationsFile, JSON.stringify(applications, null, 2));
          } catch (error) {
            console.error('Error saving application:', error);
          }

          this.dailyApplicationCount++;

          // Notify user
          if (watchItem.userEmail) {
            await notificationService.sendApplicationNotification(
              watchItem.userEmail,
              application,
              application.status
            );
          }

          console.log(`Applied: ${application.status} - ${application.message}`);

          // Random delay between applications (3-8 seconds)
          await this.delay(3000 + Math.random() * 5000);
        }
      } catch (error) {
        console.error(`Error auto-applying to ${job.title}:`, error.message);
      }
    }
  }

  generateJobId(job) {
    // Create unique ID from job details
    return `${job.platform}-${job.company}-${job.title}-${job.location}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  start() {
    if (this.isMonitoring) {
      console.log('Job monitor is already running');
      return;
    }

    this.isMonitoring = true;
    console.log(`Starting job monitor (checking every ${this.checkIntervalMs / 1000 / 60} minutes)...`);

    // Check immediately on start
    this.checkForNewJobs();

    // Then check at intervals
    this.monitorInterval = setInterval(() => {
      this.checkForNewJobs();
    }, this.checkIntervalMs);

    // Reset daily count at midnight
    this.resetInterval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        console.log('Resetting daily application count');
        this.dailyApplicationCount = 0;
      }
    }, 60000); // Check every minute
  }

  stop() {
    if (!this.isMonitoring) {
      console.log('Job monitor is not running');
      return;
    }

    this.isMonitoring = false;
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    if (this.resetInterval) {
      clearInterval(this.resetInterval);
      this.resetInterval = null;
    }
    console.log('Job monitor stopped');
  }

  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      watchListCount: this.watchList.length,
      seenJobsCount: this.seenJobs.size,
      dailyApplicationCount: this.dailyApplicationCount,
      dailyLimit: this.dailyLimit,
      checkIntervalMinutes: this.checkIntervalMs / 1000 / 60
    };
  }

  setCheckInterval(minutes) {
    this.checkIntervalMs = minutes * 60 * 1000;
    if (this.isMonitoring) {
      this.stop();
      this.start();
    }
    console.log(`Check interval updated to ${minutes} minutes`);
  }
}

module.exports = new JobMonitor();
