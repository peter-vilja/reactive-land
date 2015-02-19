'use strict';
import {EventStream, Behavior} from 'reactive';
import {diff, patch, h, create} from 'virtual-dom';
import {fetch, log, select, unshift, rand} from './general';

let words = ['happy', 'joyful', 'excited', 'relaxed', 'awesome', 'sad', 'depressed', 'bored', 'angry', 'hurt'];

let createFeeling = (text, animate) => h('li', {className: animate ? text + ' animate' : text}, text);
let createList = list => h('ul', {className: 'hashtags'}, list);

let update = updated => {
  var newTree = createList(updated);
  var patches = diff(tree, newTree);
  patch(tags, patches);
  tree = newTree;
};

let render = feeling => words.map(word => createFeeling(word, word === feeling));

let tree = createList(render());
let tags = create(tree);
unshift('.feeling', tags);

let renderFeeling = compose(update, render);

let filterByKeyword = curry((stream, keyword) => stream
  .filter(get('text'))
  .filter(compose(lt(-1), strIndexOf(keyword), toLower, get('text'))));

let keywords = fetch('/api/keywords').map(compose(JSON.parse, get('data')));
let filter = filterByKeyword(keywords);
let track = feelings => feelings.forEach(feeling => filter(feeling).subscribe(x => renderFeeling(feeling)));

track(words);
