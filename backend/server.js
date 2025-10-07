const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const applicationController = require('./controllers/applicationController');
const jobMonitor = require('./services/jobMonitor');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Job application routes
app.post('/api/jobs/search', (req, res) => applicationController.searchJobs(req, res));
app.post('/api/jobs/apply', (req, res) => applicationController.applyToJobs(req, res));
app.get('/api/applications', (req, res) => applicationController.getApplications(req, res));
app.get('/api/stats', (req, res) => applicationController.getStats(req, res));

// Job Monitor routes
app.post('/api/monitor/watch', async (req, res) => {
  try {
    const watchItem = jobMonitor.addWatchCriteria(req.body);
    res.json({ success: true, watchItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/monitor/watch', (req, res) => {
  try {
    const watchList = jobMonitor.getWatchList();
    res.json({ success: true, watchList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/monitor/watch/:id', (req, res) => {
  try {
    jobMonitor.removeWatchCriteria(parseFloat(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/monitor/watch/:id', (req, res) => {
  try {
    const updated = jobMonitor.updateWatchCriteria(parseFloat(req.params.id), req.body);
    res.json({ success: true, watchItem: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/monitor/start', async (req, res) => {
  try {
    await jobMonitor.initialize();
    jobMonitor.start();
    res.json({ success: true, message: 'Job monitor started' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/monitor/stop', (req, res) => {
  try {
    jobMonitor.stop();
    res.json({ success: true, message: 'Job monitor stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/monitor/status', (req, res) => {
  try {
    const status = jobMonitor.getStatus();
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/monitor/interval', (req, res) => {
  try {
    const { minutes } = req.body;
    jobMonitor.setCheckInterval(minutes);
    res.json({ success: true, message: `Check interval set to ${minutes} minutes` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize job monitor on startup
jobMonitor.initialize().then(() => {
  console.log('Job monitor initialized');
}).catch(err => {
  console.error('Failed to initialize job monitor:', err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Job monitor ready - use /api/monitor/start to begin monitoring');
});

module.exports = app;
