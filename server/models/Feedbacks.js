const mongoose = require('mongoose');

const FeedbacksSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  feedback: {
    type: String,
    default: ''
  },
  mobile: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  formId: {
    type: String,
    default: ''
  },
  adminId: {
    type: String,
    default: ''
  }/*,
  isDeleted: {
    type: Boolean,
    default: false
  }*/
});

module.exports = mongoose.model('Feedbacks', FeedbacksSchema);
