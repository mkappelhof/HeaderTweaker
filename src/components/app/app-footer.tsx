import { useState } from 'react';
import { Button } from '@components/button/button';
import { IconButton } from '@components/button/icon-button';
import { Drawer } from '@components/drawer/drawer';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';

import css from './app.module.scss';

export const AppFooter = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <footer className={css.footer}>
      <img src="icon.png" alt="HeaderTweaker" width="56" />
      <h1>
        <span className={css.headerName}>Header</span>
        <span className={css.tweakerName}>Tweaker</span>
      </h1>
      <IconButton onClick={() => setShowSettings(true)}>
        <Cog6ToothIcon />
      </IconButton>

      <Drawer isOpen={showSettings} onClose={() => setShowSettings(false)} title="Settings">
        <Button>Import new headers</Button>
        <Button>Export existing headers</Button>
      </Drawer>
    </footer>
  );
};
