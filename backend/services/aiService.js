const OpenAI = require('openai');

class AIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key'
    });
  }

  async tailorResume(jobDescription, baseResume) {
    try {
      const prompt = `You are a professional resume writer. Given the following job description and base resume, 
      optimize the resume to better match the job requirements. Focus on highlighting relevant skills and experience.
      
      Job Description:
      ${jobDescription}
      
      Base Resume:
      ${baseResume}
      
      Provide an optimized version that emphasizes relevant qualifications while maintaining truthfulness.`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'You are an expert resume optimization assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI Resume Tailoring Error:', error.message);
      return baseResume; // Return original if AI fails
    }
  }

  async generateCoverLetter(jobTitle, company, jobDescription, userBackground) {
    try {
      const prompt = `Write a professional cover letter for the following position:
      
      Position: ${jobTitle}
      Company: ${company}
      Job Description: ${jobDescription}
      
      Candidate Background:
      ${userBackground}
      
      The cover letter should be concise (3-4 paragraphs), professional, and highlight how the candidate's 
      experience aligns with the job requirements.`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'You are an expert at writing compelling cover letters.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 800
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI Cover Letter Generation Error:', error.message);
      return `Dear Hiring Manager,\n\nI am writing to express my interest in the ${jobTitle} position at ${company}.\n\nBest regards`;
    }
  }

  async extractKeywords(jobDescription) {
    try {
      const prompt = `Extract the most important keywords and skills from this job description. 
      Return them as a comma-separated list.
      
      Job Description:
      ${jobDescription}`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'You extract key skills and requirements from job descriptions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 200
      });

      return response.choices[0].message.content.split(',').map(k => k.trim());
    } catch (error) {
      console.error('AI Keyword Extraction Error:', error.message);
      return [];
    }
  }

  async optimizeForATS(resumeText) {
    try {
      const prompt = `Optimize this resume for Applicant Tracking Systems (ATS). 
      Ensure proper formatting, keyword density, and clear section headers.
      
      Resume:
      ${resumeText}
      
      Return the ATS-optimized version.`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'You are an ATS optimization expert.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 1500
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI ATS Optimization Error:', error.message);
      return resumeText;
    }
  }
}

module.exports = new AIService();
