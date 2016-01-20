var mongoose = require('mongoose'),
Card = mongoose.model('Card');

exports.findAll = function(req, res){
  Card.find({},function(err, results) {
    return res.send(results);
  });
};

exports.findById = function(req, res) {
  var id = req.params.id;
  Card.findOne({'_id' : id}, function(error, result) {
    if (error) return console.log(error);
    return res.send(result);
  })
};

exports.add = function(req, res) {
  Card.create(req.body, function (err, card) {
    if (err) return console.log(err);
    return res.send(card);
  });
}

exports.update = function(req, res) {
  var id = req.params.id;
  var updates = req.body;
  Card.update({'_id' : id}, updates,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d cards', numberAffected);
      return res.send(202);
  });
}

exports.delete = function(req, res) {
  var id = req.params.id;
  Card.remove({'_id':id},function(result) {
    return res.send(result);
  });
};
