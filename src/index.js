import createStore from 'stockroom';
import storeWorker from 'worker-loader!./store/worker';

const store = createStore(new storeWorker());
store.subscribe(console.log);

import './style/index.scss';
import App from './components/app';

export default App;
