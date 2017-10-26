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
        response.send(room);
      }
    });
  });

  app.get('/rooms/:id/count_rolls', (request, response) => {
    const id = request.params.id;
    const { rollWidth, rollLength } = request.query;

    if(rollWidth == null || rollLength == null || id == null) {
      return response.status(422).send({'error':'Invalid params'});
    }

    if(Number(rollWidth, 10) <= 0 || Number(rollLength, 10) <= 0) {
      return response.status(422).send({'error':'Roll params must be positive'});
    }

    const details = { '_id': new ObjectID(id) };
    db.collection('rooms').findOne(details, (err, item) => {
      if (err) {
        response.status(422).send({'error':'Invalid room id'});
      } else {
        response.status(200).send(countRolls(item, rollWidth, rollLength));
      }
    });
  });

  countRolls = (room, rollWidth, rollLength) => {
    let roomPerimeter = room.walls.reduce((a, b) => a + Number(b, 10), 0);
    let totalLength = Math.ceil(roomPerimeter / rollWidth) * Number(room.height, 10);
    let rollsCount = Math.ceil(totalLength / rollLength);

    return {
      'rollsCount': rollsCount,
      'spareMeters': rollsCount * rollLength - totalLength,
    };
  }
};
