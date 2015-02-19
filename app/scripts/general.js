'use strict';
import {EventStream, Behavior} from 'reactive';

export const fetch = path => EventStream.fromEventSource(new EventSource(path));
export const log = x => { console.log(x); return x; };
export const select = x => document.querySelector(x);
export const unshift = curry((selector, dom) => select(selector).insertBefore(dom, select(selector).firstChild));
