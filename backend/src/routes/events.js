const express = require('express');
const {
  getMyEvents,
  createEvent,
  updateEventStatus,
  deleteEvent,
  getEvent,
} = require('../controllers/eventController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', getMyEvents);
router.post('/', createEvent);
router.get('/:id', getEvent);
router.patch('/:id', updateEventStatus);
router.delete('/:id', deleteEvent);

module.exports = router;