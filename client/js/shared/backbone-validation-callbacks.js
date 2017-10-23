module.exports = function(){
  _.extend(Backbone.Validation.callbacks, {
    valid(view, attr, selector) {
      const control = view.$(`[${selector}=${attr}]`);
      const group = control.parents('.form-group');
      group.removeClass('has-error');

      if (control.data('error-style') === 'tooltip') {
        if (control.data('tooltip')) { return control.tooltip('hide'); }
      } else if (control.data('error-style') === 'inline') {
        return group.find('.help-inline.error-message').remove();
      } else {
        return group.find('.help-block.error-message').remove();
      }
    },

    invalid(view, attr, error, selector) {
      let target;
      const control = view.$(`[${selector}=${attr}]`);
      const group = control.parents('.form-group');
      group.addClass('has-error');

      if (control.data('error-style') === 'tooltip') {
        const position = control.data('tooltip-position') || 'right';
        control.tooltip({
          placement: position,
          trigger: 'manual',
          title: error
        });
        return control.tooltip('show');
      } else if (control.data('error-style') === 'inline') {
        if (group.find('.help-inline').length === 0) {
          group.find('.form-control').after("<span class='help-inline error-message'></span>");
        }
        target = group.find('.help-inline');
        return target.text(error);
      } else {
        if (group.find('.help-block').length === 0) {
          group.find('.form-control').after("<p class='help-block error-message'></p>");
        }
        target = group.find('.help-block');
        return target.text(error);
      }
    }
  });
}();
