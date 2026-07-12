const express = require('express');
const Tool = require('../models/Tool');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const tools = await Tool.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tools.length, data: tools });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }

    res.status(200).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const tool = await Tool.create(req.body);
    res.status(201).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }

    res.status(200).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);

    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }

    res.status(200).json({ success: true, message: 'Tool deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
