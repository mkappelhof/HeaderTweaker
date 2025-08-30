import { App } from '@components/app/app';
import { createRoot } from 'react-dom/client';

import './styles/global.scss';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
