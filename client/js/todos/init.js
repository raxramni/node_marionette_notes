'use strict';

const TodoApp = require('./main');

const TodoAppInit = () => {
  const $el = $('.todo-app');
  console.log($el);
  $(() => TodoApp.start($el));
};
module.exports = TodoAppInit;
