var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var CardSchema = new Schema({
  title: String,
  description: String
});

mongoose.model('Card', CardSchema);
