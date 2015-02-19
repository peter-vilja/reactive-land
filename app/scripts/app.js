'use strict';
import pf from 'pointfree-fantasy';
import R from 'ramda';
R.installTo(window);

import Future from 'data.future';
import Maybe from 'data.maybe';
import {EventStream, Behavior} from 'reactive';
import {diff, patch, h, create} from 'virtual-dom';
import {fetch, log, select, unshift} from './general';
import './keywords';

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
  .subscribe(R.compose(render.next.bind(render), counter));

var mapWidth = 855.546875;
var mapHeight = 432.828125;
var x = longitude => Math.round((longitude + 180) * (mapWidth / 360));
var y = latitude => Math.round(((-1 * latitude) + 90) * (mapHeight / 180));

var dot = (lon, lat) => create(h('span', {
  className: 'dot',
  style: {
    left: x(lon)-2+'px',
    top: y(lat)-2+'px',
  }
}));

var withCoordinates = tweets.filter(compose(is(Object), get('geo')))
                            .map(compose(get('coordinates'), get('coordinates')));

withCoordinates
  .subscribe(map(compose(unshift('.map-container'), apply(dot))));

// var WithTag = tweets
//   .filter(get('entities'))
//   .map(compose(map(compose(toLower, get('text'))), get('hashtags'), get('entities')))
//   .filter(compose(lt(-1), indexOf('love')));
