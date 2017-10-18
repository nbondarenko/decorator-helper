const roomsRoutes = require('./rooms_routes');
module.exports = function(app, db) {
  roomsRoutes(app, db);
};
