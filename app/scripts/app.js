'use strict';
import pf from 'pointfree-fantasy';
pf.expose(window);

import Future from 'data.future';
import Maybe from 'data.maybe';
import _ from 'ramda';
import {EventStream, Behavior} from 'reactive';

var fetch = (path) => EventStream.fromEventSource(new EventSource(path));
var tweets = fetch('/api/tweets');

tweets
  .scan((a, b) => a + 1, 0)
  .subscribe((amount) => {
    console.log('amount', amount);
  });
