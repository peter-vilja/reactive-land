'use strict';
require('pointfree-fantasy').expose(window);
// var Maybe = require('pointfree-fantasy/instances/maybe');
var Future = require('data.future');
var Maybe = require('data.maybe');
var R = require('ramda');

var stream = new EventSource('/api/tweets');
stream.addEventListener('open', () => console.log('open'));
stream.addEventListener('message', (m) => console.log(JSON.parse(m.data)));
