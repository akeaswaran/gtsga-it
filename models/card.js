var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var CardSchema = new Schema({
  title: String,
  description: String,
  assignees: Array,
  assigneeEmails: Array,
  status: String,
  notificationsEnabled:  Boolean,
  priority: Number
});

mongoose.model('Card', CardSchema);
