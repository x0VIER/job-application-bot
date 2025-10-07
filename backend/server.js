const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const applicationController = require('./controllers/applicationController');
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
