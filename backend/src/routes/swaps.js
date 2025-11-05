const express = require('express');
const {
  getSwappableSlots,
  requestSwap,
  getIncomingRequests,
  getOutgoingRequests,
  respondToSwapRequest,
} = require('../controllers/swapController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/swappable-slots', getSwappableSlots);
router.post('/request', requestSwap);
router.get('/incoming', getIncomingRequests);
router.get('/outgoing', getOutgoingRequests);
router.post('/respond/:requestId', respondToSwapRequest);

module.exports = router;