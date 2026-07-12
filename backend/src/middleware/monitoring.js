const os = require('os');

function attachMonitoring(app) {
  app.get('/healthz', (req, res) => {
    res.status(200).json({
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
      cpuCount: os.cpus().length,
      timestamp: new Date().toISOString(),
    });
  });
}

module.exports = { attachMonitoring };
