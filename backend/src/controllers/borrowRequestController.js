const borrowRequestService = require('../services/borrowRequestService');

async function createBorrowRequest(req, res, next) {
  try {
    const borrowRequest = await borrowRequestService.createBorrowRequest(req.user._id, req.body);
    res.status(201).json({ success: true, data: borrowRequest });
  } catch (error) {
    next(error);
  }
}

async function getBorrowRequests(req, res, next) {
  try {
    const borrowRequests = await borrowRequestService.getBorrowRequests(req.user._id, req.query);
    res.status(200).json({ success: true, count: borrowRequests.length, data: borrowRequests });
  } catch (error) {
    next(error);
  }
}

async function getBorrowRequestById(req, res, next) {
  try {
    const borrowRequest = await borrowRequestService.getBorrowRequestById(req.user._id, req.params.id);
    res.status(200).json({ success: true, data: borrowRequest });
  } catch (error) {
    next(error);
  }
}

async function updateBorrowRequestStatus(req, res, next) {
  try {
    const borrowRequest = await borrowRequestService.updateBorrowRequestStatus(req.user._id, req.params.id, req.body);
    res.status(200).json({ success: true, data: borrowRequest });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBorrowRequest,
  getBorrowRequests,
  getBorrowRequestById,
  updateBorrowRequestStatus,
};
