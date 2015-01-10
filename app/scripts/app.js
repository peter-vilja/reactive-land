'use strict';
require('pointfree-fantasy').expose(window);
// var Maybe = require('pointfree-fantasy/instances/maybe');
var Future = require('data.future');
var Maybe = require('data.maybe');
var R = require('ramda');

// -- Behavior ---------------------

var behavior = Behavior(R.add(1));
console.log(behavior.ap(Behavior(2)));

var id = Behavior((value) => value);
console.log(id.ap(Behavior(5)));

var b3 = Behavior(3);
var b4 = Behavior(4);
var log = R.curry((a, b) => console.log(a, b));

liftA2(log, b3, b4)
console.log(liftA2(R.add, b3, b4));


// -- Random ---------------------

var add = x => x + 1;
var addAll = map(add);
var fetchNumbers = (x) => new Future((reject, resolve) => resolve(x));

var lift = map(map(map(add)));

// pointfree compose needs a parameter even though fetchNumbers doesn't receive any
var numbers = compose(lift, fetchNumbers);

numbers(Maybe.Just([1,2,3])).fork(
  err => console.log('err', err),
  data => console.log('data', data)
);
