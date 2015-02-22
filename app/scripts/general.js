'use strict';
import {EventStream, Behavior} from 'reactive';

export const fetch = path => EventStream.fromEventSource(new EventSource(path));
export const log = x => { console.log(x); return x; };
export const select = x => document.querySelector(x);
export const prepend = curry((selector, dom) => select(selector).insertBefore(dom, select(selector).firstChild));
export const rand = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);
