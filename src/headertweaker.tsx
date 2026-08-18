import './styles/fonts.scss';
import './styles/global.scss';
import '@i18n/config';

import { App } from '@components/app/app';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
