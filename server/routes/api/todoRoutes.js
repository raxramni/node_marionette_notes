'use strict';
module.exports = (app) => {
  var todoController = require('../../controllers/api/todoController');

  // todoList Routes
  app.route('/api/todos')
    .get(todoController.index)
    .post(todoController.create);

  app.route('/api/todos/:id([0-9]+)')
    .get(todoController.show)
    .delete(todoController.destroy);
};
