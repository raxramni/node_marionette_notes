'use strict';
module.exports = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    '': 'rIndex',
    ':id': 'rShow'
  }
});
