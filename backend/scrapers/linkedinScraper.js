const puppeteer = require('puppeteer');

class LinkedInScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });
    this.page = await this.browser.newPage();
    
    // Set random user agent
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
    await this.page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async searchJobs(keywords, location) {
    try {
      const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}`;
      await this.page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Random delay to mimic human behavior
      await this.randomDelay(2000, 4000);
      
      // Extract job listings
      const jobs = await this.page.evaluate(() => {
        const jobCards = document.querySelectorAll('.job-search-card, .jobs-search__results-list li');
        const jobList = [];
        
        jobCards.forEach((card, index) => {
          if (index < 10) { // Limit to 10 jobs per search
            const titleElement = card.querySelector('.job-search-card__title, .job-card-list__title');
            const companyElement = card.querySelector('.job-search-card__company-name, .job-card-container__company-name');
            const locationElement = card.querySelector('.job-search-card__location, .job-card-container__metadata-item');
            const linkElement = card.querySelector('a.job-search-card__title-link, a.job-card-list__title');
            
            if (titleElement && companyElement) {
              jobList.push({
                title: titleElement.textContent.trim(),
                company: companyElement.textContent.trim(),
                location: locationElement ? locationElement.textContent.trim() : 'Not specified',
                url: linkElement ? linkElement.href : '',
                platform: 'LinkedIn'
              });
            }
          }
        });
        
        return jobList;
      });
      
      return jobs;
    } catch (error) {
      console.error('LinkedIn scraping error:', error.message);
      return [];
    }
  }

  async applyToJob(jobUrl, resumePath, coverLetter) {
    try {
      await this.page.goto(jobUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(1000, 2000);
      
      // Look for Easy Apply button
      const easyApplyButton = await this.page.$('button[aria-label*="Easy Apply"], button.jobs-apply-button');
      
      if (easyApplyButton) {
        await easyApplyButton.click();
        await this.randomDelay(1500, 2500);
        
        // This is a simplified version - actual implementation would need to handle
        // multi-step forms, file uploads, and various question types
        console.log('Easy Apply button clicked for:', jobUrl);
        
        return {
          success: true,
          message: 'Application initiated via Easy Apply'
        };
      } else {
        return {
          success: false,
          message: 'Easy Apply not available - external application required'
        };
      }
    } catch (error) {
      console.error('Application error:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = LinkedInScraper;
