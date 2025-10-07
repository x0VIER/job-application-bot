# Real-Time Job Monitoring Feature 🔥

## Overview

The **Real-Time Job Monitor** is a powerful background service that continuously watches for newly posted jobs and automatically applies on your behalf **as soon as they're posted**. This gives you a competitive advantage by being one of the first applicants!

## 🎯 Key Features

### 1. **Instant Job Detection**
- Checks for new jobs every 2 minutes (configurable)
- Detects jobs posted within the last few minutes
- Filters out jobs you've already seen

### 2. **Smart Auto-Apply**
- Automatically applies to matching jobs immediately
- Uses your saved resume and preferences
- Respects daily application limits
- Includes random delays to appear human-like

### 3. **Multiple Watch Criteria**
- Monitor multiple job searches simultaneously
- Different keywords, locations, and platforms
- Each watch can have its own filters

### 4. **Advanced Filtering**
- Remote work preference
- Salary requirements
- Experience level
- Job type (full-time, contract, etc.)

### 5. **Real-Time Notifications**
- Email alerts when new jobs are found
- Notification for each application submitted
- Daily summary reports

## 🚀 How It Works

```
┌─────────────────────────────────────────────────────────┐
│  1. You set up watch criteria (what jobs you want)      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  2. Monitor runs in background every 2 minutes          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  3. Scrapes job boards for new postings                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  4. Compares with previously seen jobs                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  5. Applies filters (remote, salary, etc.)              │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  6. Auto-applies to matching jobs                       │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  7. Sends you email notification                        │
└─────────────────────────────────────────────────────────┘
```

## 📋 Setup Guide - Step by Step

### Step 1: Add a Watch Criteria

Tell the bot what jobs you're looking for:

```bash
curl -X POST http://localhost:5000/api/monitor/watch \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": "Python Developer",
    "location": "Remote",
    "platforms": ["linkedin", "indeed"],
    "autoApply": true,
    "userEmail": "your.email@gmail.com",
    "resumePath": "/path/to/your/resume.pdf",
    "minSalary": 80000,
    "remote": true
  }'
```

**Response:**
```json
{
  "success": true,
  "watchItem": {
    "id": 1696789012345.678,
    "keywords": "Python Developer",
    "location": "Remote",
    "platforms": ["linkedin", "indeed"],
    "autoApply": true,
    "enabled": true,
    "createdAt": "2025-10-07T12:30:12.345Z"
  }
}
```

### Step 2: Start the Monitor

Activate background monitoring:

```bash
curl -X POST http://localhost:5000/api/monitor/start
```

**Response:**
```json
{
  "success": true,
  "message": "Job monitor started"
}
```

### Step 3: Check Status

See what the monitor is doing:

```bash
curl http://localhost:5000/api/monitor/status
```

**Response:**
```json
{
  "success": true,
  "status": {
    "isMonitoring": true,
    "watchListCount": 3,
    "seenJobsCount": 127,
    "dailyApplicationCount": 12,
    "dailyLimit": 50,
    "checkIntervalMinutes": 2
  }
}
```

## 🎮 Using the Web Dashboard

### Add Watch Criteria

1. Go to the dashboard
2. Click "Add Watch" button
3. Fill in the form:
   - **Keywords**: "Software Engineer", "DevOps", etc.
   - **Location**: "Remote", "New York", "San Francisco"
   - **Platforms**: Select LinkedIn, Indeed, etc.
   - **Auto-Apply**: Toggle ON for automatic applications
   - **Filters**: Set salary, remote preference, etc.
4. Click "Save"

### View Active Watches

The dashboard shows all your active watch criteria:

```
┌─────────────────────────────────────────────────────────┐
│  Active Job Watches                                     │
├─────────────────────────────────────────────────────────┤
│  🔍 Python Developer - Remote                           │
│     Platforms: LinkedIn, Indeed                         │
│     Auto-Apply: ✅  Status: 🟢 Active                   │
│     Found: 23 jobs | Applied: 18                        │
│                                              [Edit] [❌] │
├─────────────────────────────────────────────────────────┤
│  🔍 DevOps Engineer - San Francisco                     │
│     Platforms: LinkedIn, Glassdoor                      │
│     Auto-Apply: ✅  Status: 🟢 Active                   │
│     Found: 15 jobs | Applied: 12                        │
│                                              [Edit] [❌] │
└─────────────────────────────────────────────────────────┘
```

### Monitor Status Panel

```
┌─────────────────────────────────────────────────────────┐
│  Real-Time Monitor Status                               │
├─────────────────────────────────────────────────────────┤
│  Status: 🟢 Running                                     │
│  Check Interval: Every 2 minutes                        │
│  Next Check: In 1m 23s                                  │
│  Jobs Tracked: 127                                      │
│  Today's Applications: 12 / 50                          │
│                                                          │
│  [⏸️ Pause Monitor]  [⚙️ Settings]                      │
└─────────────────────────────────────────────────────────┘
```

## 🐍 Using the Python CLI

### Add Watch Criteria

```bash
python3 job_bot.py monitor add \
  --keywords "Full Stack Developer" \
  --location "Remote" \
  --auto-apply \
  --email your@email.com
```

### Start Monitoring

```bash
python3 job_bot.py monitor start
```

### Check Status

```bash
python3 job_bot.py monitor status
```

### List All Watches

```bash
python3 job_bot.py monitor list
```

### Remove a Watch

```bash
python3 job_bot.py monitor remove <watch-id>
```

## ⚙️ Configuration Options

### Watch Criteria Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `keywords` | string | ✅ | Job title or skills to search for |
| `location` | string | ✅ | City, state, or "Remote" |
| `platforms` | array | ❌ | ["linkedin", "indeed", "glassdoor"] |
| `autoApply` | boolean | ❌ | Auto-apply to matching jobs (default: true) |
| `userEmail` | string | ❌ | Email for notifications |
| `resumePath` | string | ❌ | Path to your resume file |
| `minSalary` | number | ❌ | Minimum salary requirement |
| `remote` | boolean | ❌ | Only remote jobs |
| `experienceLevel` | string | ❌ | "entry", "mid", "senior" |
| `jobType` | string | ❌ | "full-time", "contract", "part-time" |

### Monitor Settings

```bash
# Change check interval (default: 2 minutes)
curl -X POST http://localhost:5000/api/monitor/interval \
  -H "Content-Type: application/json" \
  -d '{"minutes": 5}'

# Adjust daily limit
# Edit backend/.env:
DAILY_LIMIT=75
```

## 📊 Example Use Cases

### Use Case 1: Recent Graduate

```json
{
  "keywords": "Entry Level Software Engineer",
  "location": "Remote",
  "platforms": ["indeed", "linkedin"],
  "autoApply": true,
  "experienceLevel": "entry",
  "remote": true
}
```

### Use Case 2: Senior Developer

```json
{
  "keywords": "Senior Python Developer",
  "location": "San Francisco",
  "platforms": ["linkedin", "glassdoor"],
  "autoApply": true,
  "minSalary": 150000,
  "experienceLevel": "senior"
}
```

### Use Case 3: Multiple Searches

```javascript
// Watch 1: Primary focus
{
  "keywords": "DevOps Engineer",
  "location": "Remote",
  "autoApply": true
}

// Watch 2: Secondary option
{
  "keywords": "Cloud Engineer",
  "location": "Remote",
  "autoApply": true
}

// Watch 3: Local backup
{
  "keywords": "Software Engineer",
  "location": "New York",
  "autoApply": false  // Just notify, don't auto-apply
}
```

## 🔔 Notification Examples

### New Jobs Found Email

```
Subject: 🎯 5 New Job Opportunities Found

Hi there!

We found 5 new job(s) matching your criteria:

1. Senior Python Developer
   Company: Tech Corp
   Location: Remote
   Platform: LinkedIn
   Posted: 3 minutes ago

2. Python Backend Engineer
   Company: StartUp Inc
   Location: Remote
   Platform: Indeed
   Posted: 7 minutes ago

[View All Jobs]

The bot will automatically apply to these positions based on your settings.
```

### Application Submitted Email

```
Subject: ✅ Successfully Applied: Python Developer at Tech Corp

Your application has been submitted successfully!

Position: Python Developer
Company: Tech Corp
Location: Remote
Platform: LinkedIn
Time: 2025-10-07 12:35 PM

Status: Application submitted via Easy Apply

Good luck! 🍀
```

## 🛡️ Safety Features

### 1. **Rate Limiting**
- Maximum 50 applications per day (configurable)
- Prevents account flagging
- Resets at midnight

### 2. **Duplicate Prevention**
- Tracks all seen jobs
- Never applies to the same job twice
- Persists across restarts

### 3. **Human-Like Behavior**
- Random delays between applications (3-8 seconds)
- Varied user agents
- Natural browsing patterns

### 4. **Error Handling**
- Auto-pause on repeated failures
- Detailed error logging
- Email notifications for issues

## 📈 Performance Tips

### 1. **Optimal Check Interval**
- **2 minutes**: Best for competitive markets
- **5 minutes**: Good balance
- **10 minutes**: Less aggressive, still effective

### 2. **Multiple Watches**
- Use 3-5 watch criteria maximum
- More watches = longer check time
- Prioritize most important searches

### 3. **Platform Selection**
- **LinkedIn**: Best for professional roles
- **Indeed**: Highest volume
- **Glassdoor**: Company reviews included

### 4. **Keywords Strategy**
- Use specific titles: "Python Developer" vs "Developer"
- Include variations: "DevOps Engineer", "Site Reliability Engineer"
- Avoid overly broad terms

## 🐛 Troubleshooting

### Monitor Not Starting

**Problem**: Monitor fails to start

**Solutions**:
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check logs
cd backend && npm start

# Verify watch criteria exist
curl http://localhost:5000/api/monitor/watch
```

### No New Jobs Found

**Problem**: Monitor runs but finds no jobs

**Possible Causes**:
- Keywords too specific
- Location too narrow
- All recent jobs already seen

**Solutions**:
- Broaden keywords
- Add more platforms
- Try "Remote" location
- Clear seen jobs cache

### Applications Not Submitting

**Problem**: Jobs found but not applying

**Check**:
- `autoApply` is set to `true`
- Resume path is correct
- Daily limit not reached
- Platform authentication valid

## 📝 API Reference

### POST /api/monitor/watch
Add new watch criteria

### GET /api/monitor/watch
List all watch criteria

### PUT /api/monitor/watch/:id
Update watch criteria

### DELETE /api/monitor/watch/:id
Remove watch criteria

### POST /api/monitor/start
Start monitoring

### POST /api/monitor/stop
Stop monitoring

### GET /api/monitor/status
Get current status

### POST /api/monitor/interval
Set check interval

## 🎯 Best Practices

1. **Start with one watch** - Test and refine before adding more
2. **Enable notifications** - Stay informed of activity
3. **Review applications** - Check what's being submitted
4. **Adjust filters** - Fine-tune based on results
5. **Monitor daily limit** - Ensure you're not hitting it too early
6. **Check logs regularly** - Catch any issues quickly

## 🚀 Advanced Features (Coming Soon)

- [ ] Machine learning to predict job fit
- [ ] A/B testing different application strategies
- [ ] Integration with calendar for interview scheduling
- [ ] Salary negotiation assistance
- [ ] Application follow-up automation
- [ ] Interview preparation resources

## 💡 Pro Tips

### Tip 1: Time Your Monitoring
Jobs are often posted:
- Monday mornings (8-10 AM)
- Wednesday afternoons (2-4 PM)
- Thursday mornings (9-11 AM)

Consider adjusting your check interval during these times.

### Tip 2: Weekend Advantage
Fewer applicants on weekends. Keep monitor running 24/7 for best results.

### Tip 3: Multiple Locations
Watch both "Remote" and your city for maximum opportunities.

### Tip 4: Keyword Variations
Add watches for synonyms:
- "Software Engineer" + "Software Developer"
- "DevOps" + "SRE" + "Platform Engineer"

---

## 🎉 Success Stories

> "I got 3 interviews in the first week by being one of the first applicants!"

> "The real-time monitoring feature is a game-changer. I landed my dream job because I applied within 5 minutes of it being posted."

> "Set it up before bed, woke up to 8 new applications. One already responded!"

---

**Ready to get started? Set up your first watch criteria and let the bot work for you 24/7!** 🚀
