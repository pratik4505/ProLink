const mongoose = require('mongoose');

const jobOpeningSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true
  },
  location: String,
  industry: String,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company', // Reference to the Company model
    required: true
  },
  companyName: String,
  skillsRequired: [String], // Array of skills required
  description: String,
  imageUrl: String,
  appliedBy:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the Company model
    required: true
  }]
});

const JobOpening = mongoose.model('JobOpening', jobOpeningSchema);

module.exports = JobOpening;
