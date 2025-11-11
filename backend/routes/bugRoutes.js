import express from 'express';
import {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getBugStats
} from '../controllers/bugController.js';

const router = express.Router();

// Stats route must come before /:id to avoid treating 'stats' as an ID
router.get('/stats', getBugStats);

// CRUD routes
router.route('/')
  .get(getAllBugs)
  .post(createBug);

router.route('/:id')
  .get(getBugById)
  .put(updateBug)
  .delete(deleteBug);

export default router;