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
var unshift = R.curry((selector, dom) => select(selector).insertBefore(dom, select(selector).firstChild));

let counter = amount => h('div', {className: 'tweet-count'}, String(amount));

let initial = counter(0);
let rootNode = create(initial);
unshift('.metrics', rootNode);

let render = Behavior.of(initial);

render.bufferWithCount(2).subscribe(([old, updated]) => {
  patch(rootNode, diff(old, updated));
});

var fetch = path => EventStream.fromEventSource(new EventSource(path));
var tweets = fetch('/api/tweets').map(compose(JSON.parse, get('data')));

tweets
  .scan((a, b) => a + 1, 0)
  .subscribe(R.compose(render.next.bind(render), counter));

var withCoordinates = tweets.filter(compose(is(Object), get('coordinates')));
var WithTag = tweets
  .filter(get('entities'))
  .map(compose(map(compose(toLower, get('text'))), get('hashtags'), get('entities')))
  .filter(compose(lt(-1), indexOf('love')));


//-- Keywords --------------------

let keywords = fetch('/api/keywords').map(compose(JSON.parse, get('data')));

let feeling = () => {
  let colors = ['#8f9c7f', '#f07429', '#f1d78d', '#cd9fc3', '#cccbad', '#e15524', '#699eb8'];
  let rand = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);
  let li = text => h('li', {
    style: {
      top: rand(0, 100) + '%',
      left: rand(0, 100) + '%',
      fontSize: rand(10, 30) + 'px',
      color: colors[rand(0, 7)]
    }
  }, text);
  let lis = [];

  let ul = li => h('ul', {className: 'hashtags'}, li);
  let tree = ul(lis);
  let tags = create(tree);
  unshift('.feeling', tags);

  let add = item => {
    var list = take(29, lis);
    list.unshift(item);
    lis = list;
    return list;
  };

  let update = updated => {
    var newTree = ul(updated);
    var patches = diff(tree, newTree);
    patch(tags, patches);
    tree = newTree;
  };

  let renderFeeling = R.compose(update, add, li);

  let filterByKeyword = R.curry((stream, keyword) => stream.filter(R.compose(lt(-1), strIndexOf(keyword), toLower, get('text'))));
  let filter = filterByKeyword(keywords);
  let track = feelings => feelings.forEach(feeling => filter(feeling).subscribe(x => renderFeeling(feeling)));

  track(['happy', 'joyful', 'excited',
    'relaxed', 'awesome', 'sad', 'depressed', 'bored', 'angry', 'hurt']);
};

feeling();
