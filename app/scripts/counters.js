'use strict';

import pf from 'pointfree-fantasy';
import {Behavior} from 'reactive';
import {diff, patch, h, create} from 'virtual-dom';
import {prepend, append, log} from './general';

var dom = counters => h('div.counters.column-2-3.row', [
  h('div.column-1-3.counter.new', [
    h('div.tweet-count', String(counters.newCount)),
    h('div.label', 'New tweets')
  ]),
  h('div.column-1-3.counter.deleted', [
    h('div.tweet-count', String(counters.deletedCount)),
    h('div.label', 'Deleted tweets')
  ]),
  h('div.column-1-3.counter.retweeted', [
    h('div.tweet-count', String(counters.retweetedCount)),
    h('div.label', 'Retweeted tweets')
  ])
]);

let initial = dom({newCount: 0, deletedCount: 0, retweetedCount: 0});
let rootNode = create(initial);
append('.counters-wrapper', rootNode);

var render = Behavior.of(initial)
render.bufferWithCount(2, 1).subscribe(([old, updated]) => {
  patch(rootNode, diff(old, updated));
});

export default tweets => {
  let newCount = tweets.filter(and(not(has('delete')), not(has('retweeted_status'))))
                       .scan((a, b) => evolve({newCount: add(1)}, a), {newCount: 0});

  let deletedCount = tweets.filter(has('delete'))
                           .scan((a, b) => evolve({deletedCount: add(1)}, a), {deletedCount: 0});

  let retweetedCount = tweets.filter(has('retweeted_status'))
                             .scan((a, b) => evolve({retweetedCount: add(1)}, a), {retweetedCount: 0})

  let counters = pf.liftA3(a => b => c => mergeAll([a, b, c]), newCount, deletedCount, retweetedCount);
  counters.subscribe(compose(render.next.bind(render), dom));
};
