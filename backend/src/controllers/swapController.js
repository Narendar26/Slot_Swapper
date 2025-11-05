const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');

// @desc    Get all swappable slots from other users
// @route   GET /api/swaps/swappable-slots
// @access  Private
exports.getSwappableSlots = async (req, res) => {
  try {
    const swappableSlots = await Event.find({
      status: 'SWAPPABLE',
      owner: { $ne: req.user.id },
    })
      .populate('owner', 'name email')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: swappableSlots.length,
      data: swappableSlots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Request a swap
// @route   POST /api/swaps/request
// @access  Private
exports.requestSwap = async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;

    // Validate input
    if (!mySlotId || !theirSlotId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both mySlotId and theirSlotId',
      });
    }

    // Fetch both slots
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    // Validate slots exist
    if (!mySlot || !theirSlot) {
      return res.status(404).json({
        success: false,
        message: 'One or both slots not found',
      });
    }

    // Validate slots belong to correct users
    if (mySlot.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not own the first slot',
      });
    }

    // Validate both slots are swappable
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({
        success: false,
        message: 'Both slots must be SWAPPABLE',
      });
    }

    // Update slot statuses to SWAP_PENDING
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    
    await mySlot.save();
    await theirSlot.save();

    // Create swap request
    const swapRequest = await SwapRequest.create({
      requesterUser: req.user.id,
      requesterSlot: mySlotId,
      recipientUser: theirSlot.owner,
      recipientSlot: theirSlotId,
    });

    res.status(201).json({
      success: true,
      data: swapRequest,
    });
  } catch (error) {
    console.error('Swap request error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get incoming swap requests
// @route   GET /api/swaps/incoming
// @access  Private
exports.getIncomingRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      recipientUser: req.user.id,
    })
      .populate('requesterUser', 'name email')
      .populate('recipientUser', 'name email')
      .populate('requesterSlot', 'title startTime endTime')
      .populate('recipientSlot', 'title startTime endTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get outgoing swap requests
// @route   GET /api/swaps/outgoing
// @access  Private
exports.getOutgoingRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      requesterUser: req.user.id,
    })
      .populate('requesterUser', 'name email')
      .populate('recipientUser', 'name email')
      .populate('requesterSlot', 'title startTime endTime')
      .populate('recipientSlot', 'title startTime endTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Respond to swap request
// @route   POST /api/swaps/respond/:requestId
// @access  Private
exports.respondToSwapRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { accept } = req.body;

    // Validate input
    if (accept === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide accept (true/false)',
      });
    }

    // Fetch swap request
    const swapRequest = await SwapRequest.findById(requestId);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found',
      });
    }

    // Check authorization
    if (swapRequest.recipientUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this request',
      });
    }

    // Check if already responded
    if (swapRequest.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `This swap request has already been ${swapRequest.status.toLowerCase()}`,
      });
    }

    if (!accept) {
      // REJECT: Set slots back to SWAPPABLE
      swapRequest.status = 'REJECTED';
      await swapRequest.save();

      await Event.findByIdAndUpdate(swapRequest.requesterSlot, {
        status: 'SWAPPABLE',
      });

      await Event.findByIdAndUpdate(swapRequest.recipientSlot, {
        status: 'SWAPPABLE',
      });

      return res.status(200).json({
        success: true,
        message: 'Swap request rejected',
        data: swapRequest,
      });
    }

    // ACCEPT: Perform the swap
    const requesterSlot = await Event.findById(swapRequest.requesterSlot);
    const recipientSlot = await Event.findById(swapRequest.recipientSlot);

    if (!requesterSlot || !recipientSlot) {
      return res.status(404).json({
        success: false,
        message: 'One or both slots not found',
      });
    }

    // Swap owners
    const tempOwner = requesterSlot.owner;
    requesterSlot.owner = recipientSlot.owner;
    recipientSlot.owner = tempOwner;

    // Set status back to BUSY
    requesterSlot.status = 'BUSY';
    recipientSlot.status = 'BUSY';

    await requesterSlot.save();
    await recipientSlot.save();

    // Update swap request status
    swapRequest.status = 'ACCEPTED';
    await swapRequest.save();

    res.status(200).json({
      success: true,
      message: 'Swap accepted successfully',
      data: swapRequest,
    });
  } catch (error) {
    console.error('Swap response error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};