'use strict';
import {EventStream, Behavior} from 'reactive';
import {diff, patch, h, create} from 'virtual-dom';
import {fetch, log, select, unshift} from './general';

let tags = {};
let top = [];

let top10 = list => h('ul', {className: 'top10'}, list);
let item = tag => h('li', {}, `${tag.tag} ${tag.amount}`);

let tree = top10([]);
let rootNode = create(tree);
unshift('.top', rootNode);

let render = Behavior.of(tree);

render.bufferWithCount(2, 1).subscribe(([old, updated]) => {
  patch(rootNode, diff(old, updated));
});

let update = compose(render.next.bind(render), top10, map(item));

export default tweets => {
  tweets
    .filter(get('entities'))
    .filter(compose(lt(0), length, get('hashtags'), get('entities')))
    .map(compose(uniq, map(get('text')), get('hashtags'), get('entities')))
    .subscribe(e => {
      var hashtags = e.value;
      for (let i = 0; i < hashtags.length; i++) {
        var tag = hashtags[i];
        var amount = tags[tag];
        var value = amount ? amount + 1 : 1;
        tags[tag] = value;

        if (top.length < 10) {
          var exists = find(propEq('tag', tag))(top);
          if (exists) exists.amount = value;
          else top.push({tag: tag, amount: value});
          top = reverse(sortBy(get('amount'))(top));
          update(top);
        } else if (top[9] && top[9].amount < value) {
          var exists = find(propEq('tag', tag))(top);
          if (exists) exists.amount = value;
          else top[9] = {tag: tag, amount: value};
          top = reverse(sortBy(get('amount'))(top));
          update(top);
        }
      }
    });
};
