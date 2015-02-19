'use strict';
import {EventStream, Behavior} from 'reactive';
import {diff, patch, h, create} from 'virtual-dom';
import {fetch, log, select, unshift} from './general';

let keywords = fetch('/api/keywords').map(compose(JSON.parse, get('data')));
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

let renderFeeling = compose(update, add, li);

let filterByKeyword = curry((stream, keyword) => stream.filter(get('text')).filter(compose(lt(-1), strIndexOf(keyword), toLower, get('text'))));
let filter = filterByKeyword(keywords);
let track = feelings => feelings.forEach(feeling => filter(feeling).subscribe(x => renderFeeling(feeling)));

track(['happy', 'joyful', 'excited',
  'relaxed', 'awesome', 'sad', 'depressed', 'bored', 'angry', 'hurt']);
