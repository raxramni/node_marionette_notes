'use strict';
const TodoApp = module.exports;
const TodoRouter = require('./router');
const layoutTemplate = require('../templates/todos/layout.pug');
const formTemplate = require('../templates/todos/form.pug');
const indexTemplate = require('../templates/todos/index.pug');
const showTemplate = require('../templates/todos/show.pug');

//TodoApp.Todo = Backbone.Model.extend({});

//TodoApp.Todos = Backbone.Collection.extend({ model: TodoApp.Todo});

TodoApp.Todo = Backbone.Model.extend({
  validation: {
    title:{
      required: true
    },
    description: {
      required: true
    }
  }
});

_.extend(TodoApp.Todo.prototype, Backbone.Validation.mixin);

TodoApp.Todos = Backbone.Collection.extend({
  model: TodoApp.Todo
});

TodoApp.Layout = Backbone.Marionette.View.extend({
  template: layoutTemplate,
  regions: {
      messages: '.app-messages',
      newTodo: '.todo-new',
      main: '.todo-main'
  }
});

TodoApp.Form = Backbone.Marionette.View.extend({
  template: formTemplate,
  //bindings: {
  //  'input.todo-title': 'title',
  //  'textarea.todo-description': 'description'
  //},
  //triggers: {
  //  'submit form': 'form:submitted'
  //},
  //onRender: function(){
  //  this.stickit();//null, this.bindings); 
  //}
  ui:{
    form: 'form'
  },
  events: {
    'submit form': '_onFormSubmitted'
  },
  modelEvents: {
    validated: '_onValidated'
  },
  reset: function(){
    this.ui.form[0].reset();
  },
  onRender: function(){
    Backbone.Validation.bind(this);
  },
  _onValidated: function(isValid, model, invalidAttrs){
    for (let attr of _.keys(model.attributes).concat(_.keys(invalidAttrs))){
      if (invalidAttrs[attr])
        Backbone.Validation.callbacks.invalid(this, attr, invalidAttrs[attr], 'name');
      else 
        Backbone.Validation.callbacks.valid(this, attr, 'name');
    }
  },

  _onFormSubmitted: function(e){
    e.preventDefault();
    e.stopPropagation();
    var data = Backbone.Syphon.serialize(this);
    this.model.set(data);
    if(this.model.isValid(true));
      this.trigger('form:submitted');
    //return false;
  }
});

TodoApp.TodosView = Backbone.Marionette.View.extend({
  template: indexTemplate,
  triggers: {
    'click a.todo-link': 'show:clicked'
  }
});

TodoApp.TodoView = Backbone.Marionette.View.extend({
  template: showTemplate
});


TodoApp.Controller = class extends Backbone.Marionette.Object {
  initialize({$el}){
    this.$el = $el;
    this.layout = new TodoApp.Layout();
    this.router = new TodoRouter({controller: this});
    this.listenTo(this.layout, 'show', this._onShow);
    this.collection = new TodoApp.Todos();
    this.model = new TodoApp.Todo();
  }

  start(){
    if(this.$el instanceof Backbone.Marionette.Region)
     this.$el.show(this.layout);
    else{
      this.$el.html(this.layout.el);
      this.layout.render().trigger('show');
    }
    Backbone.history.start({pushState: true});
  }

  _onShow(){
    this._showForm();
  }

  onDestroy(){
    if (this.layout != null)
      this.layout.destroy();
  }

  _showForm(){
    this.formView = new TodoApp.Form({model: this.model});
    this.layout.showChildView('newTodo', this.formView);
    this.listenTo(this.formView, 'form:submitted', this._onFormSubmit.bind(this));
  }

  _showTodos(){
    this.todosView = new TodoApp.TodosView({collection: this.collection});
    this.listenTo(this.todosView, 'show:clicked', this._onTodoClicked.bind(this));
    this.layout.showChildView('main', this.todosView);
    this.router.navigate('');
  }

  _onFormSubmit(){
    this.model.url = '/api/todos';
    Q(this.model.save()).done(this._onSave.bind(this), this._fetchErrorHandler);
  }

  _onSave(){
    this.model = new TodoApp.Todo()
    this.formView.reset()
    this._fetchTodos();
  }

  _onTodoClicked(context, e){
    const id = e.currentTarget.dataset.id;
    if(id){
      this.todoModel = this.collection.get(id);
      this._showTodo();
    }
  }

  _showTodo(){
    this.todoView = new TodoApp.TodoView({model: this.todoModel});
    this.layout.showChildView('main', this.todoView);
    this.router.navigate('/' + this.todoModel.id);
  }

  _fetchTodos(){
    Q(this.collection.fetch({url: '/api/todos'})).done(this._showTodos.bind(this), this._fetchErrorHandler);
  }

  _fetchTodo(id){
    this.todoModel = new TodoApp.Todo();
    this.todoModel.url = '/api/todos/' + id;
    Q(this.todoModel.fetch({url: '/api/todos/'+id})).done(this._showTodo.bind(this), this._fetchErrorHandler);
  }

  _fetchErrorHandler(message){
    //show a errors view from the message in the layout's messages region. 
    window.alert(message);
  }

//routeActions
  rIndex(){
    this._fetchTodos();
  }
  rShow(id){
    this._fetchTodo(id);
  }
};

TodoApp.start = ($el) => {
  (new TodoApp.Controller({$el}).start());
};
