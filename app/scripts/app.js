'use strict';
import pf from 'pointfree-fantasy';
// pf.expose(window);

import R from 'ramda';
R.installTo(window);

import Future from 'data.future';
import Maybe from 'data.maybe';
import {EventStream, Behavior} from 'reactive';

var log = x => { console.log(x); return x; };
var fetch = path => EventStream.fromEventSource(new EventSource(path));
var tweets = fetch('/api/tweets').map(compose(JSON.parse, get('data')));

tweets
  .scan((a, b) => a + 1, 0)
  .subscribe((amount) => {
    console.log('amount', amount);
  });

tweets
  .filter(compose(is(Object), get('geo')))
  .subscribe(log);
