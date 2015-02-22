'use strict';
import {Behavior} from 'reactive';
import {diff, patch, h, create} from 'virtual-dom';
import {fetch, log, append} from './general';

let formatTime = time => new Date(time).toLocaleDateString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false});
let show = [];

let tweetList = list => h('ul', {}, list);
let item = content => h('li', {className: 'cf'}, content);
let content = tweet => [
  h('div', {className: 'profile-image', style: {'background-image': 'url(' + tweet.user.profile_image_url + ')'}}),
  h('div', {className: 'details'}, [
    h('div', {className: 'timeAndUser'}, [
      h('span', {className: 'user'}, `${tweet.user.name}  ·  `),
      h('span', {className: 'time'}, `${formatTime(tweet.created_at)}`)
    ]),
    h('span', {className: 'text'}, tweet.text)
  ])
];

let tree = tweetList([]);
let rootNode = create(tree);
append('.random-tweets', rootNode);

let render = Behavior.of(tree);

render.bufferWithCount(2, 1).subscribe(([old, updated]) => {
  patch(rootNode, diff(old, updated));
});

export default tweets => {
  tweets
    .filter(get('text'))
    .throttle(5000)
    .map(compose(item, content))
    .subscribe(({value}) => {
      if (show.length === 5) show.pop();
      show.unshift(value);
      render.next(tweetList(show));
    });
};
