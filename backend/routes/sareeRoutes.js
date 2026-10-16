import express from 'express';
import { DataStore } from '../data/store.js';

const router = express.Router();

// GET all sarees with optional filtering
router.get('/', async (req, res) => {
  try {
    const sarees = await DataStore.getSarees(req.query);
    res.json({
      success: true,
      count: sarees.length,
      data: sarees
    });
  } catch (error) {
    console.error('Error fetching sarees:', error);
    res.status(500).json({ success: false, message: 'Server error fetching sarees' });
  }
});

// GET single saree by ID
router.get('/:id', async (req, res) => {
  try {
    const saree = await DataStore.getSareeById(req.params.id);
    if (!saree) {
      return res.status(404).json({ success: false, message: 'Saree not found' });
    }
    res.json({ success: true, data: saree });
  } catch (error) {
    console.error('Error fetching saree:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST create new saree (e.g. personal collection upload)
router.post('/', async (req, res) => {
  try {
    const { name, price, images } = req.body;
    if (!name || !price || !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name, price and at least one image are required'
      });
    }

    const created = await DataStore.createSaree(req.body);
    res.status(201).json({
      success: true,
      message: 'Personal saree added to Paithani Vastram collection successfully!',
      data: created
    });
  } catch (error) {
    console.error('Error creating saree:', error);
    res.status(500).json({ success: false, message: 'Failed to create saree' });
  }
});

// PUT update a saree
router.put('/:id', async (req, res) => {
  try {
    const updated = await DataStore.updateSaree(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Saree not found' });
    }
    res.json({ success: true, message: 'Saree updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating saree:', error);
    res.status(500).json({ success: false, message: 'Failed to update saree' });
  }
});

// DELETE a saree
router.delete('/:id', async (req, res) => {
  try {
    await DataStore.deleteSaree(req.params.id);
    res.json({ success: true, message: 'Saree removed from collection' });
  } catch (error) {
    console.error('Error deleting saree:', error);
    res.status(500).json({ success: false, message: 'Failed to delete saree' });
  }
});

export default router;
