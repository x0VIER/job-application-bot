# Job Application Bot - Python CLI

A beautiful command-line interface for the Job Application Bot. Search and apply to jobs directly from your terminal!

## 🎯 Features

- 🔍 **Search Jobs** - Find jobs across LinkedIn, Indeed, and more
- 📝 **Apply Automatically** - Submit applications with one command
- 📊 **View Statistics** - Track your application success rate
- ⚙️ **Easy Configuration** - Set your preferences once
- 🎨 **Beautiful Interface** - Rich terminal UI with colors and tables

## 📋 Prerequisites

Before you begin, make sure you have:
- Python 3.7 or higher installed
- The backend server running (see main README)

## 🚀 Installation - Baby Steps

### Step 1: Check Python Installation

Open your terminal and type:
```bash
python3 --version
```

You should see something like `Python 3.x.x`. If not, install Python first.

### Step 2: Navigate to the CLI Directory

```bash
cd path/to/job-application-bot/cli
```

Replace `path/to/` with the actual path where you cloned the repository.

### Step 3: Install Required Packages

```bash
pip3 install -r requirements.txt
```

This installs two packages:
- `requests` - for communicating with the backend
- `rich` - for beautiful terminal output

### Step 4: Make Sure Backend is Running

In a **separate terminal window**, start the backend:

```bash
cd ../backend
npm start
```

Keep this terminal open! The CLI needs the backend to work.

## 🎮 Usage Guide

### First Time Setup

Configure your job search preferences:

```bash
python3 job_bot.py config
```

You'll be asked:
- **Job keywords**: e.g., "Software Engineer", "Python Developer"
- **Location**: e.g., "Remote", "New York", "San Francisco"
- **Resume path**: Full path to your resume file
- **Daily limit**: Maximum applications per day (default: 50)

### Basic Commands

#### 1. Search for Jobs

```bash
python3 job_bot.py search
```

This will:
- Search LinkedIn and Indeed for jobs matching your keywords
- Display results in a beautiful table
- Save jobs to a file for later

**Example output:**
```
╔═══════════════════════════════════════════════════════════╗
║        🤖  JOB APPLICATION BOT - CLI VERSION  🤖         ║
╚═══════════════════════════════════════════════════════════╝

Searching for jobs...
Keywords: Software Engineer
Location: Remote

✓ Found 10 jobs!

┏━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┓
┃ #  ┃ Title                  ┃ Company        ┃ Location ┃ Platform┃
┡━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━┩
│ 1  │ Senior Software Eng... │ Vertex Solut...│ Remote   │ Indeed  │
│ 2  │ Full Stack Developer   │ Tech Corp      │ Remote   │ LinkedIn│
└────┴────────────────────────┴────────────────┴──────────┴─────────┘
```

#### 2. Search with Custom Keywords

```bash
python3 job_bot.py search -k "Python Developer" -l "New York"
```

This overrides your saved configuration for this search only.

#### 3. Apply to All Jobs

```bash
python3 job_bot.py apply
```

This will apply to ALL jobs from your last search.

#### 4. Apply to Specific Jobs

```bash
python3 job_bot.py apply -i 1 3 5
```

This applies only to jobs #1, #3, and #5 from your search results.

#### 5. View Statistics

```bash
python3 job_bot.py stats
```

Shows your application statistics:
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃           📊 Application Statistics           ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│                                               │
│ Total Applications: 25                        │
│ Successful: 18                                │
│ Pending: 5                                    │
│ Failed: 2                                     │
│                                               │
└───────────────────────────────────────────────┘
```

#### 6. Show Current Configuration

```bash
python3 job_bot.py show-config
```

Displays your current settings without changing them.

## 📖 Complete Command Reference

```bash
# Search commands
python3 job_bot.py search                          # Use saved settings
python3 job_bot.py search -k "DevOps Engineer"     # Custom keywords
python3 job_bot.py search -l "San Francisco"       # Custom location
python3 job_bot.py search -k "Data Scientist" -l "Remote"  # Both

# Apply commands
python3 job_bot.py apply                           # Apply to all
python3 job_bot.py apply -i 1                      # Apply to job #1
python3 job_bot.py apply -i 1 2 3 4 5              # Apply to multiple

# Info commands
python3 job_bot.py stats                           # View statistics
python3 job_bot.py config                          # Change settings
python3 job_bot.py show-config                     # View settings

# Help
python3 job_bot.py -h                              # Show help
```

## 🔧 Troubleshooting

### "Cannot connect to backend server"

**Problem**: The CLI can't reach the backend.

**Solution**:
1. Make sure the backend is running:
   ```bash
   cd ../backend
   npm start
   ```
2. Check that it's running on port 5000
3. Look for "Server running on port 5000" message

### "No jobs found"

**Problem**: Search returned no results.

**Solutions**:
- Try broader keywords (e.g., "Engineer" instead of "Senior React Engineer")
- Try "Remote" as location for more results
- Check if job sites are accessible from your network

### "ModuleNotFoundError: No module named 'rich'"

**Problem**: Required packages not installed.

**Solution**:
```bash
pip3 install -r requirements.txt
```

### Permission Denied

**Problem**: Can't execute the script.

**Solution**:
```bash
chmod +x job_bot.py
```

## 💡 Pro Tips

### Tip 1: Create an Alias

Add this to your `~/.bashrc` or `~/.zshrc`:

```bash
alias jobbot='python3 /full/path/to/cli/job_bot.py'
```

Then you can just type:
```bash
jobbot search
jobbot apply
```

### Tip 2: Daily Job Search Routine

Create a script `daily_search.sh`:
```bash
#!/bin/bash
cd /path/to/job-application-bot/cli
python3 job_bot.py search
python3 job_bot.py stats
```

Run it every morning!

### Tip 3: Batch Applications

Search once, review the jobs, then apply to selected ones:
```bash
python3 job_bot.py search
# Review the results
python3 job_bot.py apply -i 2 5 7 9  # Apply to the good ones
```

## 🎨 Customization

### Change API URL

If your backend runs on a different port:

Edit `job_bot.py` line 29:
```python
def __init__(self, api_url="http://localhost:YOUR_PORT"):
```

### Change Config File Location

The config is saved to `~/.job-bot-config.json`. To change this, edit line 28:
```python
self.config_file = Path.home() / ".job-bot-config.json"
```

## 📝 Configuration File

Your settings are saved in `~/.job-bot-config.json`:

```json
{
  "keywords": "Software Engineer",
  "location": "Remote",
  "platforms": ["linkedin", "indeed"],
  "resume_path": "/path/to/resume.pdf",
  "daily_limit": 50
}
```

You can edit this file directly if you prefer!

## 🚀 Quick Start Checklist

- [ ] Python 3.7+ installed
- [ ] Cloned the repository
- [ ] Installed requirements: `pip3 install -r requirements.txt`
- [ ] Backend server running: `cd ../backend && npm start`
- [ ] Configured settings: `python3 job_bot.py config`
- [ ] First search: `python3 job_bot.py search`
- [ ] Applied to jobs: `python3 job_bot.py apply`

## 🎯 Example Workflow

Here's a complete example of using the CLI:

```bash
# Day 1: Setup
cd job-application-bot/cli
pip3 install -r requirements.txt
python3 job_bot.py config
# Enter: "Python Developer", "Remote", "/Users/me/resume.pdf", "50"

# Day 2: First search
python3 job_bot.py search
# Reviews 10 jobs found

# Apply to the best ones
python3 job_bot.py apply -i 1 3 5 7

# Check progress
python3 job_bot.py stats

# Day 3: New search with different keywords
python3 job_bot.py search -k "DevOps Engineer"
python3 job_bot.py apply -i 2 4 6

# Week later: Check overall stats
python3 job_bot.py stats
```

## 🤝 Need Help?

- Check the main README in the parent directory
- Open an issue on GitHub
- Make sure backend is running first!

## 📄 License

Same as the main project - MIT License

---

**Happy job hunting! 🎉**
