module.exports = function(app) {
    var cards = require('./controllers/cards');
    app.get('/cards', cards.findAll);
    app.get('/cards/:id', cards.findById);
    app.post('/cards', cards.add);
    app.put('/cards/:id', cards.update);
    app.delete('/cards/:id', cards.delete);
}
