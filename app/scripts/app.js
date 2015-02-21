'use strict';
import pf from 'pointfree-fantasy';
import R from 'ramda';
R.installTo(window);

import Future from 'data.future';
import Maybe from 'data.maybe';
import {EventStream, Behavior} from 'reactive';
import {diff, patch, h, create} from 'virtual-dom';
import {fetch, log, unshift} from './general';
// import './keywords';
import top from './top';
import locate from './map';
import randTweets from './tweets';

let counter = amount => h('div', {className: 'tweet-count'}, String(amount));

let initial = counter(0);
let rootNode = create(initial);
unshift('.metrics', rootNode);

let render = Behavior.of(initial);

render.bufferWithCount(2).subscribe(([old, updated]) => {
  patch(rootNode, diff(old, updated));
});

var tweets = fetch('/api/tweets').map(compose(JSON.parse, get('data')));

tweets
  .scan((a, b) => a + 1, 0)
  .subscribe(compose(render.next.bind(render), counter));

locate(tweets);
randTweets(tweets);
top(tweets);
