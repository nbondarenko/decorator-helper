var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  app.get('/rooms', (request, response) => {
    db.collection('rooms').find({}).toArray((err, result) => {
      if (err) {
        response.send({ 'error': 'An error has occurred' });
      } else {
        response.send(result);
      }
    });
  });

  app.post('/rooms', (request, response) => {
    const room = {
      name: request.body.name,
      height: request.body.height,
      walls: request.body.walls
    };
    db.collection('rooms').insert(room, (err, result) => {
      if (err) {
        response.send({ 'error': 'An error has occurred' });
      } else {
        response.send(result.ops[0]);
      }
    });
  });

  app.get('/rooms/:id', (request, response) => {
    const id = request.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('rooms').findOne(details, (err, item) => {
      if (err) {
        response.send({'error':'An error has occurred'});
      } else {
        response.send(item);
      }
    });
  });

  app.delete('/rooms/:id', (request, response) => {
    const id = request.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('rooms').remove(details, (err, item) => {
      if (err) {
        response.send({'error':'An error has occurred'});
      } else {
        response.send(item);
      }
    });
  });

  app.put('/rooms/:id', (request, response) => {
    const id = request.params.id;
    const details = { '_id': new ObjectID(id) };
    const room = {
      name: request.body.name,
      height: request.body.height,
      walls: request.body.walls
    };
    db.collection('rooms').update(details, room, (err, result) => {
      if (err) {
        response.send({'error':'An error has occurred'});
      } else {
        console.log(result);
        response.send(room);
      }
    });
  });
};
