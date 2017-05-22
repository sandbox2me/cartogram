import _ from 'lodash';
import Cartogram from './cartogram';
import * as components from './components';
import * as utils from './utils';

// Merge in top level components into Cartogram library
Object.assign(Cartogram, components, utils);


// Make sure lodash doesn't escape onto the global
_.noConflict();

export default Cartogram;
