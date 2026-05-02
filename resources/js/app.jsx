import { createRoot } from 'react-dom/client';
import App from './router';
import '../css/app.css';

createRoot(document.getElementById('app')).render(<App />);
