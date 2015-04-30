'use strict';
import {Behavior} from 'reactive';
import {diff, patch, h, create} from 'virtual-dom';
import {fetch, log, append} from './general';

let show = [];

let photoList = list => h('ul', {}, list);
let item = content => h('li', {}, content);
let content = tweet => [
  h('div', {className: 'photo', style: {'background-image': 'url(' + tweet.extended_entities.media[0].media_url + ')'}})
];

let tree = photoList([]);
let rootNode = create(tree);
append('.random-photos', rootNode);

let render = Behavior.of(tree);

render.bufferWithCount(2, 1).subscribe(([old, updated]) => {
  patch(rootNode, diff(old, updated));
});

export default tweets => {
  tweets
    .filter(get('extended_entities'))
    .filter(compose(lt(0), length, get('media'), get('extended_entities')))
    .filter(compose(eq('photo'), get('type'), head, get('media'), get('extended_entities')))
    .filter(compose(is(Object), get('coordinates')))
    .throttle(5000)
    .map(compose(item, content))
    .subscribe(({value}) => {
      if (show.length === 5) show.pop();
      show.unshift(value);
      render.next(photoList(show));
    });
};
