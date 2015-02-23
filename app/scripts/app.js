'use strict';

import R from 'ramda';
R.installTo(window);

import {fetch} from './general';
// import './keywords';
import top from './top';
import locate from './map';
import randTweets from './tweets';
import counters from './counters';
import photos from './photos';

var tweets = fetch('/api/tweets').map(compose(JSON.parse, get('data')));

locate(tweets);
randTweets(tweets);
top(tweets);
counters(tweets);
photos(tweets);
