'use strict';
import pf from 'pointfree-fantasy';
pf.expose(window);

import Future from 'data.future';
import Maybe from 'data.maybe';
import _ from 'ramda';
import {EventStream, Behavior} from 'reactive';

var tweets = new EventSource('/api/tweets');
var fetch = EventStream.fromEventSource(tweets);
var progress = EventStream.fromEvent('click', document.querySelector('#start'))
  .scan((a, b) => !a, true);


var be = fetch.scan(function (a, b) { return b; }, 1);
// be.subscribe(value => console.log(value));
// progress.subscribe((value) => console.log(value));
var logab = _.curry((a, b) => {console.log(a); return b});
var combine = liftA2(logab, progress, be);
// combine.subscribe((value) => console.log('value: ', value));
// var combine = Behavior.of(logab).ap(progress).ap(be);
combine.subscribe((value) => console.log('value', value));

// var cancel = fetch.subscribe(value => console.log(value));
// progress.subscribe(value => console.log(value));

// stream.addEventListener('open', () => console.log('open'));
// stream.addEventListener('message', (m) => console.log(JSON.parse(m.data)));
