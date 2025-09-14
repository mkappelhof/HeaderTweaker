import { Button } from '@components/button/button';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';

import css from './settings.module.scss';

export const Settings = () => {
  return (
    <div className={css.root}>
      <Button>
        <ArrowUpTrayIcon /> Import new headers
      </Button>
      <Button>
        <ArrowDownTrayIcon />
        Export existing headers
      </Button>
    </div>
  );
};
