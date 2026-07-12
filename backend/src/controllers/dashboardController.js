const dashboardService = require('../services/dashboardService');

async function getDashboard(req, res, next) {
  try {
    const dashboardData = await dashboardService.getDashboardData(req.user._id);
    res.status(200).json({ success: true, data: dashboardData });
  } catch (error) {
    next(error);
  }
}

async function getMyTools(req, res, next) {
  try {
    const tools = await dashboardService.getMyTools(req.user._id);
    res.status(200).json({ success: true, count: tools.length, data: tools });
  } catch (error) {
    next(error);
  }
}

async function getBorrowRequests(req, res, next) {
  try {
    const requests = await dashboardService.getBorrowRequests(req.user._id);
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
}

async function getCurrentLoans(req, res, next) {
  try {
    const loans = await dashboardService.getCurrentLoans(req.user._id);
    res.status(200).json({ success: true, count: loans.length, data: loans });
  } catch (error) {
    next(error);
  }
}

async function getReturnedTools(req, res, next) {
  try {
    const returnedTools = await dashboardService.getReturnedTools(req.user._id);
    res.status(200).json({ success: true, count: returnedTools.length, data: returnedTools });
  } catch (error) {
    next(error);
  }
}

async function getNotifications(req, res, next) {
  try {
    const notifications = await dashboardService.getNotifications(req.user._id);
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
}

async function getStatistics(req, res, next) {
  try {
    const statistics = await dashboardService.getStatistics(req.user._id);
    res.status(200).json({ success: true, data: statistics });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
  getMyTools,
  getBorrowRequests,
  getCurrentLoans,
  getReturnedTools,
  getNotifications,
  getStatistics,
};
