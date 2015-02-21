'use strict';
import {EventStream} from 'reactive';
import {h, create} from 'virtual-dom';
import {unshift, select, log} from './general';

const MAP_WIDTH = 855.546875;
const MAP_HEIGHT = 432.828125;

let x = longitude => Math.round((longitude + 180) * (MAP_WIDTH / 360));
let y = latitude => Math.round(((-1 * latitude) + 90) * (MAP_HEIGHT / 180));

let dot = tweet => create(h('div', {
  className: 'dot closed',
  style: {
    left: x(tweet.coordinates.coordinates[0])-2+'px',
    top: y(tweet.coordinates.coordinates[1])-2+'px',
  }
}, content(tweet)));

let content = tweet => [
  h('div', {className: 'mark'}),
  h('div', {className: 'content cf'}, [
    h('div', {className: 'profile-image', style: {'background-image': 'url(' + tweet.user.profile_image_url + ')'}}),
    h('span', {className: 'text'}, tweet.text)
  ])
];

var mapClicks = EventStream.fromEvent('click', select('.map-container'));

mapClicks
  .filter(e => e.target.classList.contains('dot') || e.target.parentNode.classList.contains('dot'))
  .subscribe(e => {
    var elem = e.value.target.classList.contains('dot') ? e.value.target : e.value.target.parentNode;
    if (elem.classList.contains('closed')) elem.classList.remove('closed');
    else elem.classList.add('closed');
  });

mapClicks
  .filter(e => e.target.classList.contains('content') || e.target.parentNode.classList.contains('content'))
  .subscribe(e => {
    var elem = e.value.target;
    if (elem.classList.contains('content')) elem.parentNode.classList.add('closed');
    else elem.parentNode.parentNode.classList.add('closed');
  });

export default tweets => {
  tweets
    .filter(compose(is(Object), get('coordinates')))
    .subscribe(map(compose(unshift('.map-container'), dot)));
};
