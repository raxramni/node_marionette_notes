/* globals Backbone: false, describe: false, it: false */

'use strict';

import { expect } from 'chai';
import Router from './../../client/js/router';

describe('App', function() {
    it('Render', function() {

        new Router();
        Backbone.history.start();

        const App = $('#app');
        expect(App[0].innerHTML).to.contain('My title');
    });
});