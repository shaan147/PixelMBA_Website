const mongoose = require('mongoose');

const pixelGoalSchema = new mongoose.Schema({
  totalPixels: {
    type: Number,
    default: 12000,
  },
});

module.exports = mongoose.model('PixelGoal', pixelGoalSchema);
