const DB = require('../../../config/db');
const Todos = DB.get('todos');

exports.index = (req, res) => { res.json(Todos.value())}; //Reads are synchronous in lowdb

exports.show = (req, res) => { 
  let todoId = parseInt(req.params.id);
  let todo = Todos.find({id: todoId});
  res.json(todo.value());
  //handle not found cases later and throw 400/404s -- to be done
};

exports.create = (req, res) => {
  let todoData = req.body;
  todoData.id = Date.now();
  todoData.createdAt = Date.now();
  todoData.updatedAt = todoData.createdAt;
  //holding off on validations for now -- to be done. 
  //Todos.push(todoData).write().then(((todo) => res.json(todo)), (err) => res.send(err));
  let todo = Todos.push(todoData).write()
  res.json(todo)
};

exports.destroy = (req, res) => {
  let todoId =parseInt(req.params.id);
  Todos.remove({ id: todoId }).write().then((() => res.json({message: 'Task deleted'})), (err) => res.send(err));
};
