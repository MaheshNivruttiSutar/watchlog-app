import App from '../App';
import { setLocalStorage } from '../data/localStorage';
import '../i18n';
import '../styles/App.css';

// The host does not load main.tsx, so remote-owned startup work lives here.
setLocalStorage();

export default App;
