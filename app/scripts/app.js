'use strict';
import pf from 'pointfree-fantasy';
// pf.expose(window);

import R from 'ramda';
R.installTo(window);

import Future from 'data.future';
import Maybe from 'data.maybe';
import {EventStream, Behavior} from 'reactive';
import {diff, patch, h, create} from 'virtual-dom';

var log = x => { console.log(x); return x; };
var select = x => document.querySelector(x);

let counter = amount => h('div', {className: 'tweet-count'}, String(amount));

let initial = counter(0);
let rootNode = create(initial);
select('.metrics').insertBefore(rootNode, select('.metrics').firstChild);

let render = Behavior.of(initial);

render.bufferWithCount(2).subscribe(([old, updated]) => {
  patch(rootNode, diff(old, updated));
});

var fetch = path => EventStream.fromEventSource(new EventSource(path));
var tweets = fetch('/api/tweets').map(compose(JSON.parse, get('data')));

tweets
  .scan((a, b) => a + 1, 0)
  .subscribe((amount) => {
    render.next(counter(amount))
  });

var withCoordinates = tweets.filter(compose(is(Object), get('coordinates')));
var WithTag = tweets
  .filter(get('entities'))
  .map(compose(map(compose(toLower, get('text'))), get('hashtags'), get('entities')))
  .filter(compose(lt(-1), indexOf('love')));
