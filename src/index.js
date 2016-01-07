import Cartogram from './cartogram';
import * as components from './components';

// Merge in top level components into Cartogram library
Object.assign(Cartogram, components);

export default Cartogram;
