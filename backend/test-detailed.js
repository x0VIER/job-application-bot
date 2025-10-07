const LinkedInScraper = require('./scrapers/linkedinScraper');
const IndeedScraper = require('./scrapers/indeedScraper');
const fs = require('fs').promises;

async function testDetailedScraping() {
  console.log('Starting detailed job scraping test...\n');

  const keywords = 'Software Engineer';
  const location = 'Remote';
  const allJobs = [];

  // Test Indeed Scraper (more reliable without login)
  console.log('Scraping Indeed...');
  try {
    const indeedScraper = new IndeedScraper();
    await indeedScraper.initialize();
    const indeedJobs = await indeedScraper.searchJobs(keywords, location);
    allJobs.push(...indeedJobs);
    await indeedScraper.close();
    console.log(`✓ Found ${indeedJobs.length} jobs on Indeed\n`);
  } catch (error) {
    console.log(`✗ Indeed Error: ${error.message}\n`);
  }

  // Test LinkedIn Scraper
  console.log('Scraping LinkedIn...');
  try {
    const linkedinScraper = new LinkedInScraper();
    await linkedinScraper.initialize();
    const linkedinJobs = await linkedinScraper.searchJobs(keywords, location);
    allJobs.push(...linkedinJobs);
    await linkedinScraper.close();
    console.log(`✓ Found ${linkedinJobs.length} jobs on LinkedIn\n`);
  } catch (error) {
    console.log(`✗ LinkedIn Error: ${error.message}\n`);
  }

  // Save results
  await fs.writeFile(
    'scraped-jobs.json',
    JSON.stringify(allJobs, null, 2)
  );

  // Display results
  console.log('='.repeat(70));
  console.log(`TOTAL JOBS FOUND: ${allJobs.length}`);
  console.log('='.repeat(70));
  console.log('');

  allJobs.forEach((job, index) => {
    console.log(`${index + 1}. ${job.title}`);
    console.log(`   Company: ${job.company}`);
    console.log(`   Location: ${job.location}`);
    console.log(`   Platform: ${job.platform}`);
    console.log(`   URL: ${job.url}`);
    console.log('');
  });

  console.log('Results saved to scraped-jobs.json');
  console.log('');
  console.log('APPLICATION TEST:');
  console.log('The bot can now attempt to apply to these jobs.');
  console.log('Note: Actual submission requires platform authentication.');
}

testDetailedScraping().catch(console.error);
