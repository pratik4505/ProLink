const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const companySchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
      },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  jobOpenings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobOpening' }],
  name: String,
  website: String,
  industry: String,
  about: String,
  employeeNo: Number,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  location: String,
  companyLogo: String, 
  products: {
    type: Map,
    of: {
      title: String,
      description: String,
      price: Number,
      productImage: String,
    },
  },

  services: {
    type: Map,
    of: {
      title: String,
      description: String,
      price: Number,
      serviceImage: String,
    },
  },
  
});

companySchema.index({ name: "text" });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
