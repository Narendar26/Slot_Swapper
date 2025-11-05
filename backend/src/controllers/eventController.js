const Event = require('../models/Event');

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user.id }).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, startTime, and endTime',
      });
    }

    const event = await Event.create({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      owner: req.user.id,
      originalOwner: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['BUSY', 'SWAPPABLE'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be BUSY or SWAPPABLE',
      });
    }

    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    event.status = status;
    await event.save();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('owner', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};