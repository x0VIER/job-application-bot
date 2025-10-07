const puppeteer = require('puppeteer');

class IndeedScraper {
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
    
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
    await this.page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async searchJobs(keywords, location) {
    try {
      const searchUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(keywords)}&l=${encodeURIComponent(location)}`;
      await this.page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      await this.randomDelay(2000, 4000);
      
      const jobs = await this.page.evaluate(() => {
        const jobCards = document.querySelectorAll('.job_seen_beacon, .jobsearch-ResultsList > li');
        const jobList = [];
        
        jobCards.forEach((card, index) => {
          if (index < 10) {
            const titleElement = card.querySelector('h2.jobTitle a, .jobTitle span');
            const companyElement = card.querySelector('[data-testid="company-name"], .companyName');
            const locationElement = card.querySelector('[data-testid="text-location"], .companyLocation');
            const linkElement = card.querySelector('h2.jobTitle a');
            
            if (titleElement && companyElement) {
              jobList.push({
                title: titleElement.textContent.trim(),
                company: companyElement.textContent.trim(),
                location: locationElement ? locationElement.textContent.trim() : 'Not specified',
                url: linkElement ? `https://www.indeed.com${linkElement.getAttribute('href')}` : '',
                platform: 'Indeed'
              });
            }
          }
        });
        
        return jobList;
      });
      
      return jobs;
    } catch (error) {
      console.error('Indeed scraping error:', error.message);
      return [];
    }
  }

  async applyToJob(jobUrl, resumePath, coverLetter) {
    try {
      await this.page.goto(jobUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(1500, 2500);
      
      const applyButton = await this.page.$('button[id*="apply"], button.ia-IndeedApplyButton, a.ia-IndeedApplyButton');
      
      if (applyButton) {
        console.log('Apply button found for:', jobUrl);
        return {
          success: true,
          message: 'Application ready - Indeed Apply detected'
        };
      } else {
        return {
          success: false,
          message: 'Direct application not available - redirects to company site'
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

module.exports = IndeedScraper;
