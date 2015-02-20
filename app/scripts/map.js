'use strict';

import {h, create} from 'virtual-dom';
import {unshift} from './general';

const MAP_WIDTH = 855.546875;
const MAP_HEIGHT = 432.828125;

let x = longitude => Math.round((longitude + 180) * (MAP_WIDTH / 360));
let y = latitude => Math.round(((-1 * latitude) + 90) * (MAP_HEIGHT / 180));

let dot = (lon, lat) => create(h('span', {
  className: 'dot',
  style: {
    left: x(lon)-2+'px',
    top: y(lat)-2+'px',
  }
}));

export default tweets => {
  let withCoordinates = tweets.filter(compose(is(Object), get('geo')))
                              .map(compose(get('coordinates'), get('coordinates')))

  withCoordinates
    .subscribe(map(compose(unshift('.map-container'), apply(dot))));
};
