# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐         ┌──────────────────────┐     │
│  │   Web Dashboard      │         │   Python CLI         │     │
│  │   (Next.js/React)    │         │   (Terminal UI)      │     │
│  │                      │         │                      │     │
│  │  • Job Search UI     │         │  • Search Commands   │     │
│  │  • Control Panel     │         │  • Apply Commands    │     │
│  │  • Statistics        │         │  • Stats Display     │     │
│  │  • Charts & Graphs   │         │  • Configuration     │     │
│  └──────────┬───────────┘         └──────────┬───────────┘     │
│             │                                 │                  │
└─────────────┼─────────────────────────────────┼─────────────────┘
              │                                 │
              │         REST API (HTTP)         │
              │                                 │
┌─────────────┴─────────────────────────────────┴─────────────────┐
│                      BACKEND SERVER                              │
│                    (Node.js/Express)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API ENDPOINTS                          │  │
│  │  • POST /api/jobs/search                                 │  │
│  │  • POST /api/jobs/apply                                  │  │
│  │  • GET  /api/applications                                │  │
│  │  • GET  /api/stats                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 CORE SERVICES                             │  │
│  │                                                           │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────┐ │  │
│  │  │  Job Scrapers  │  │  AI Service    │  │ Scheduler  │ │  │
│  │  │                │  │                │  │            │ │  │
│  │  │ • LinkedIn     │  │ • Resume       │  │ • Cron     │ │  │
│  │  │ • Indeed       │  │   Optimization │  │   Jobs     │ │  │
│  │  │ • Glassdoor    │  │ • Cover Letter │  │ • Auto     │ │  │
│  │  │ • Upwork       │  │ • Keywords     │  │   Search   │ │  │
│  │  │                │  │ • ATS Check    │  │            │ │  │
│  │  └────────┬───────┘  └────────┬───────┘  └─────┬──────┘ │  │
│  │           │                   │                 │        │  │
│  └───────────┼───────────────────┼─────────────────┼────────┘  │
│              │                   │                 │            │
│  ┌───────────┴───────────────────┴─────────────────┴────────┐  │
│  │              APPLICATION CONTROLLER                       │  │
│  │  • Job Management                                        │  │
│  │  • Duplicate Detection                                   │  │
│  │  • Rate Limiting                                         │  │
│  │  • Error Handling                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────┬────────────────────────────────────┬──────────────┘
              │                                    │
              │                                    │
┌─────────────┴─────────────┐      ┌──────────────┴──────────────┐
│   EXTERNAL SERVICES       │      │   DATA STORAGE              │
├───────────────────────────┤      ├─────────────────────────────┤
│                           │      │                             │
│  ┌─────────────────────┐ │      │  ┌───────────────────────┐ │
│  │  Puppeteer/Browser  │ │      │  │  applications.json    │ │
│  │  • Headless Chrome  │ │      │  │  • Applied jobs       │ │
│  │  • Web Scraping     │ │      │  │  • Status tracking    │ │
│  │  • Form Automation  │ │      │  │  • Timestamps         │ │
│  └─────────────────────┘ │      │  └───────────────────────┘ │
│                           │      │                             │
│  ┌─────────────────────┐ │      │  ┌───────────────────────┐ │
│  │  OpenAI API         │ │      │  │  config.json          │ │
│  │  • GPT-4 Mini       │ │      │  │  • User preferences   │ │
│  │  • Resume AI        │ │      │  │  • Search params      │ │
│  │  • Cover Letters    │ │      │  │  • Settings           │ │
│  └─────────────────────┘ │      │  └───────────────────────┘ │
│                           │      │                             │
│  ┌─────────────────────┐ │      └─────────────────────────────┘
│  │  Nodemailer         │ │
│  │  • Email Alerts     │ │
│  │  • Notifications    │ │
│  │  • Daily Summaries  │ │
│  └─────────────────────┘ │
│                           │
└───────────────────────────┘
```

## Data Flow

### 1. Job Search Flow
```
User Input → Frontend/CLI → Backend API → Scrapers → Job Sites
                                                          ↓
User Display ← Frontend/CLI ← Backend API ← Job Data ←───┘
```

### 2. Application Flow
```
User Action → Frontend/CLI → Backend API → AI Service (Resume Optimization)
                                                ↓
                                          Scraper (Navigate & Apply)
                                                ↓
                                          Job Site (Submit Application)
                                                ↓
                                          Save to Database
                                                ↓
                                          Send Email Notification
                                                ↓
                                          Return Status to User
```

### 3. Automated Scheduler Flow
```
Cron Trigger (Every 5 min) → Scheduler → Load Config
                                            ↓
                                        Search Jobs
                                            ↓
                                        Filter Duplicates
                                            ↓
                                        Apply to Jobs (Rate Limited)
                                            ↓
                                        Save Results
                                            ↓
                                        Send Notifications
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Auth**: NextAuth (planned)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Automation**: Puppeteer
- **Scheduling**: node-cron
- **Email**: Nodemailer
- **AI**: OpenAI API

### CLI
- **Language**: Python 3.7+
- **UI**: Rich (terminal UI)
- **HTTP**: Requests

### Infrastructure
- **Hosting**: Render / Vercel / Railway
- **Version Control**: Git / GitHub
- **CI/CD**: GitHub Actions (planned)
- **Monitoring**: Platform built-in

## Security Features

1. **Environment Variables**: All secrets stored securely
2. **Rate Limiting**: Prevents abuse (50 apps/day default)
3. **Duplicate Detection**: Prevents reapplication
4. **Error Handling**: Graceful failures with logging
5. **CORS**: Configured for security
6. **Input Validation**: All user inputs sanitized

## Scalability Considerations

### Current Architecture
- Suitable for personal use (1-100 applications/day)
- Single server deployment
- File-based storage

### Future Enhancements
- Database migration (PostgreSQL/MongoDB)
- Redis for caching and queues
- Microservices architecture
- Load balancing
- Distributed scraping
- Message queues (RabbitMQ/Kafka)

## API Design

### RESTful Endpoints

```
POST   /api/jobs/search      - Search for jobs
POST   /api/jobs/apply       - Apply to jobs
GET    /api/applications     - List all applications
GET    /api/stats            - Get statistics
GET    /api/health           - Health check
```

### Request/Response Format

**Search Request:**
```json
{
  "keywords": "Software Engineer",
  "location": "Remote",
  "platforms": ["linkedin", "indeed"]
}
```

**Search Response:**
```json
{
  "success": true,
  "count": 10,
  "jobs": [
    {
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "Remote",
      "url": "https://...",
      "platform": "LinkedIn"
    }
  ]
}
```

## Error Handling Strategy

1. **Network Errors**: Retry with exponential backoff
2. **Scraping Errors**: Log and continue to next job
3. **API Errors**: Return meaningful error messages
4. **Rate Limits**: Auto-pause and resume
5. **Authentication Errors**: Notify user to re-login

## Performance Optimization

1. **Concurrent Scraping**: Multiple jobs in parallel
2. **Caching**: Store frequently accessed data
3. **Lazy Loading**: Load UI components on demand
4. **Code Splitting**: Reduce initial bundle size
5. **Database Indexing**: Fast queries (when DB added)

## Monitoring & Logging

- **Application Logs**: All actions logged
- **Error Tracking**: Errors captured with context
- **Performance Metrics**: Response times tracked
- **User Analytics**: Usage patterns (privacy-respecting)

## Deployment Architecture

```
GitHub Repository
      ↓
   Git Push
      ↓
Render/Vercel (Auto Deploy)
      ↓
Build & Test
      ↓
Deploy to Production
      ↓
Live Application
```

---

This architecture is designed to be:
- **Modular**: Easy to add new platforms
- **Scalable**: Can handle increased load
- **Maintainable**: Clean separation of concerns
- **Testable**: Each component can be tested independently
- **Extensible**: New features can be added easily
