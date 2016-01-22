import Cartogram from './cartogram';
import * as components from './components';
import * as utils from './utils';

// Merge in top level components into Cartogram library
Object.assign(Cartogram, components, utils);

export default Cartogram;
