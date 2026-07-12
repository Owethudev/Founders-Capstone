const toolService = require('../services/toolService');

async function getTools(req, res, next) {
  try {
    const tools = await toolService.getTools(req.query);
    res.status(200).json({ success: true, count: tools.length, data: tools });
  } catch (error) {
    next(error);
  }
}

async function getToolById(req, res, next) {
  try {
    const tool = await toolService.getToolById(req.params.id);
    res.status(200).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
}

async function createTool(req, res, next) {
  try {
    const tool = await toolService.createTool(req.user._id, req.body);
    res.status(201).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
}

async function updateTool(req, res, next) {
  try {
    const tool = await toolService.updateTool(req.user._id, req.params.id, req.body);
    res.status(200).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
}

async function deleteTool(req, res, next) {
  try {
    const result = await toolService.deleteTool(req.user._id, req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
};
