<div align="center">

# 🤖 Job Application Bot

### *Automate Your Job Search with AI-Powered Intelligence*

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-19.1.0-blue.svg)](https://react.dev)
[![Next.js](https://img.shields.io/badge/next.js-15.5.4-black)](https://nextjs.org)
[![Python](https://img.shields.io/badge/python-3.7+-blue)](https://python.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**[Features](#features) • [Demo](#testing-results) • [Installation](#installation) • [CLI Usage](#python-cli) • [Documentation](#api-documentation) • [Deploy](#deployment)**

---

### 🎯 Intelligent full-stack web application for automated job applications

Supports **LinkedIn** • **Indeed** • **Glassdoor** • **Upwork**

Built with **React/Next.js** • **Node.js/Express** • **OpenAI GPT-4** • **Puppeteer**

</div>

---

## Features

### 🎯 Multi-Platform Job Search
- **LinkedIn** - Automated Easy Apply detection and submission
- **Indeed** - Indeed Apply integration with smart form filling
- **Glassdoor** - Job discovery and application tracking
- **Upwork** - Freelance opportunity automation

### 🤖 AI-Powered Optimization
- **Resume Tailoring** - Automatically customize resumes for each job using OpenAI GPT-4
- **Cover Letter Generation** - Create personalized cover letters based on job descriptions
- **Keyword Extraction** - Identify and optimize for ATS keywords
- **ATS Optimization** - Ensure maximum compatibility with Applicant Tracking Systems

### 📊 Real-Time Dashboard
- **Live Statistics** - Track total, successful, pending, and failed applications
- **Interactive Charts** - Visualize application trends and success rates
- **Application Logs** - Detailed table of all submissions with status tracking
- **Control Panel** - Easy-to-use interface for managing job search parameters

### 🔔 Smart Notifications
- **Email Alerts** - Get notified for each application submission
- **Daily Summaries** - Receive comprehensive daily reports
- **New Job Alerts** - Instant notifications when matching jobs are found

### 🛡️ Safety & Compliance
- **Rate Limiting** - Configurable daily application limit (default: 50/day)
- **Duplicate Detection** - Automatic tracking to prevent reapplying
- **Human-Like Behavior** - Random delays and varied user agents
- **Error Handling** - Auto-pause on failures with detailed logging

### ⚙️ Advanced Features
- **Cron Scheduling** - Automated job searches every 5 minutes
- **Multi-Language Support** - Translation capabilities for international applications
- **Resume Builder** - Built-in resume creation and editing tools
- **Advanced Filters** - Filter by salary, remote work, visa sponsorship
- **Proxy Support** - Rotate IPs for enhanced privacy

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, responsive styling
- **Recharts** - Beautiful data visualizations
- **Lucide Icons** - Clean, modern iconography
- **NextAuth** - Secure authentication

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Puppeteer** - Headless browser automation
- **OpenAI API** - AI-powered content generation
- **Node-Cron** - Job scheduling
- **Nodemailer** - Email notifications

## Python CLI

### 🐍 Command-Line Interface

Use the bot directly from your terminal with our Python CLI!

```bash
cd cli
pip3 install -r requirements.txt
python3 job_bot.py search
python3 job_bot.py apply
python3 job_bot.py stats
```

**Features:**
- 🎨 Beautiful terminal UI with colors and tables
- 🔍 Search jobs from command line
- 📝 Apply to jobs with one command
- 📊 View statistics and track progress
- ⚙️ Easy configuration management

**[📖 Complete CLI Documentation](cli/README.md)** - Step-by-step guide for beginners!

---

## Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or pnpm
- OpenAI API key (optional, for AI features)
- Gmail account (optional, for email notifications)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/job-application-bot.git
cd job-application-bot
```

2. **Install frontend dependencies**
```bash
cd frontend
pnpm install
```

3. **Install backend dependencies**
```bash
cd ../backend
npm install
```

4. **Configure environment variables**
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
```

5. **Start the backend server**
```bash
npm start
```

6. **Start the frontend development server**
```bash
cd ../frontend
pnpm dev
```

7. **Open your browser**
Navigate to `http://localhost:3000`

## Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
DAILY_LIMIT=50
```

### Application Settings

Configure your job search parameters in the dashboard:
- **Keywords** - Job titles or skills (e.g., "Software Engineer", "Full Stack Developer")
- **Location** - City, state, or "Remote"
- **Resume** - Upload your base resume (PDF format recommended)
- **Daily Limit** - Maximum applications per day (recommended: 50)

## Usage

### Starting the Bot

1. Open the dashboard at `http://localhost:3000`
2. Enter your job search criteria (keywords, location)
3. Upload your resume
4. Click "Start Bot" to begin automated applications
5. Monitor progress in real-time through the dashboard

### Manual Job Search

Use the API endpoints directly:

```bash
# Search for jobs
curl -X POST http://localhost:5000/api/jobs/search \
  -H "Content-Type: application/json" \
  -d '{"keywords": "Software Engineer", "location": "Remote"}'

# Get application statistics
curl http://localhost:5000/api/stats
```

## API Documentation

### Endpoints

#### `POST /api/jobs/search`
Search for jobs across platforms
```json
{
  "keywords": "Software Engineer",
  "location": "Remote",
  "platforms": ["linkedin", "indeed"]
}
```

#### `POST /api/jobs/apply`
Apply to multiple jobs
```json
{
  "jobs": [...],
  "resumePath": "/path/to/resume.pdf",
  "coverLetter": "..."
}
```

#### `GET /api/applications`
Retrieve all application records

#### `GET /api/stats`
Get application statistics

## Testing

The application includes built-in testing capabilities. To test the automation:

1. Start both frontend and backend servers
2. Use the dashboard to initiate a job search
3. The bot will scrape job listings and attempt to apply
4. Check the "Recent Applications" table for results
5. Verify email notifications (if configured)

## Deployment

### Vercel (Frontend)
```bash
cd frontend
vercel deploy
```

### Heroku (Backend)
```bash
cd backend
heroku create your-app-name
git push heroku main
```

### Docker
```bash
docker-compose up -d
```

## Important Notes

### Terms of Service Compliance
- This tool is for educational and personal use only
- Always respect platform Terms of Service
- Use reasonable rate limits (50 applications/day recommended)
- Review applications before submission when possible
- Some platforms may block automated tools

### Ethical Considerations
- Only apply to jobs you're genuinely qualified for
- Customize applications when possible
- Don't spam employers
- Be honest in your applications
- Follow up manually when appropriate

## Troubleshooting

### Common Issues

**Puppeteer fails to launch**
```bash
# Install required dependencies
sudo apt-get install -y chromium-browser
```

**Applications not submitting**
- Check if you're logged into the platforms
- Verify your credentials are correct
- Ensure daily limit hasn't been reached
- Check logs for specific error messages

**Email notifications not working**
- Enable "Less secure app access" in Gmail (or use App Password)
- Verify EMAIL_USER and EMAIL_PASS in .env
- Check spam folder

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Add support for more job platforms (Monster, ZipRecruiter)
- [ ] Implement browser extension for manual assistance
- [ ] Add video interview preparation tools
- [ ] Create mobile app version
- [ ] Integrate with LinkedIn API (when available)
- [ ] Add machine learning for success prediction
- [ ] Implement A/B testing for resumes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This software is provided for educational purposes only. Users are responsible for ensuring their use of this tool complies with all applicable laws and terms of service of the platforms they interact with. The developers assume no liability for misuse or any consequences resulting from the use of this software.

## Acknowledgments

- Inspired by various open-source job application automation projects
- Built with modern web technologies and best practices
- Community contributions and feedback

## Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Email: support@jobapplicationbot.com
- Discord: [Join our community](https://discord.gg/jobbot)

## Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Application Logs
![Logs](docs/screenshots/logs.png)

### Statistics
![Stats](docs/screenshots/stats.png)

---

**Made with ❤️ by developers, for job seekers**

*Star ⭐ this repository if you find it helpful!*
