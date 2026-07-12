const express = require('express');
const { getTools, getToolById, createTool, updateTool, deleteTool } = require('../controllers/toolController');
const { getToolsValidation, getToolByIdValidation, createToolValidation, updateToolValidation } = require('../validators/toolValidator');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getToolsValidation, getTools);
router.get('/:id', getToolByIdValidation, getToolById);
router.post('/', protect, createToolValidation, createTool);
router.patch('/:id', protect, updateToolValidation, updateTool);
router.delete('/:id', protect, getToolByIdValidation, deleteTool);

module.exports = router;
