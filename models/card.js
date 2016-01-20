var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var CardSchema = new Schema({
  title: String,
  description: String,
  assignees: Array,
  assigneeEmails: Array
});

mongoose.model('Card', CardSchema);
