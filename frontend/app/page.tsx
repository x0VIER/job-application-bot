'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Upload, Settings, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    pending: 0
  });

  const mockApplications = [
    { id: 1, company: 'Tech Corp', position: 'Software Engineer', platform: 'LinkedIn', status: 'success', timestamp: new Date().toISOString() },
    { id: 2, company: 'StartUp Inc', position: 'Full Stack Developer', platform: 'Indeed', status: 'pending', timestamp: new Date().toISOString() },
    { id: 3, company: 'Big Company', position: 'Frontend Developer', platform: 'Glassdoor', status: 'failed', timestamp: new Date().toISOString() },
  ];

  const chartData = [
    { name: 'Mon', applications: 4 },
    { name: 'Tue', applications: 7 },
    { name: 'Wed', applications: 12 },
    { name: 'Thu', applications: 8 },
    { name: 'Fri', applications: 15 },
    { name: 'Sat', applications: 6 },
    { name: 'Sun', applications: 3 },
  ];

  const pieData = [
    { name: 'Successful', value: 45, color: '#10b981' },
    { name: 'Pending', value: 30, color: '#f59e0b' },
    { name: 'Failed', value: 25, color: '#ef4444' },
  ];

  const toggleBot = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Job Application Bot</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Applications</p>
                <p className="text-3xl font-bold text-white mt-2">127</p>
              </div>
              <Activity className="w-12 h-12 text-purple-400 opacity-50" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Successful</p>
                <p className="text-3xl font-bold text-green-400 mt-2">57</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400 opacity-50" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">38</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-400 opacity-50" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-red-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Failed</p>
                <p className="text-3xl font-bold text-red-400 mt-2">32</p>
              </div>
              <XCircle className="w-12 h-12 text-red-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Control Panel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Job Keywords</label>
              <input 
                type="text" 
                placeholder="e.g., Software Engineer, Full Stack Developer"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Location</label>
              <input 
                type="text" 
                placeholder="e.g., Remote, New York, San Francisco"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Resume Upload</label>
              <button className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Resume
              </button>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Daily Limit</label>
              <input 
                type="number" 
                placeholder="50"
                defaultValue="50"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <button 
              onClick={toggleBot}
              className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop Bot
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Bot
                </>
              )}
            </button>
          </div>
          
          {isRunning && (
            <div className="mt-4 p-4 rounded-lg bg-green-500/20 border border-green-500/50">
              <p className="text-green-400 text-center font-medium">Bot is running... Scanning job boards</p>
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Application Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1e1e', 
                    border: '1px solid #ffffff20',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#a855f7" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Success Rate</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Applications Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Applications</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Position</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Platform</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {mockApplications.map((app) => (
                  <tr key={app.id} className="border-b border-white/10 hover:bg-white/5 transition-all">
                    <td className="py-3 px-4 text-white">{app.company}</td>
                    <td className="py-3 px-4 text-white">{app.position}</td>
                    <td className="py-3 px-4 text-gray-300">{app.platform}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'success' ? 'bg-green-500/20 text-green-400' :
                        app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">Just now</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
