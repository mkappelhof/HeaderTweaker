import { useState } from 'react';
import { IconButton } from '@components/button/icon-button';
import { Drawer } from '@components/drawer/drawer';
import { Settings } from '@components/settings/settings';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import packageJson from '../../../package.json';

import css from './app.module.scss';

interface AppHeaderProps {
  withoutSettings?: boolean;
}

export const AppHeader = ({ withoutSettings = false }: AppHeaderProps) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className={css.header}>
      <div>
        <h1>
          <span className={css.headerName}>Header</span>
          <span className={css.tweakerName}>Tweaker</span>
        </h1>
        <code>v{packageJson.version}</code>
      </div>
      {!withoutSettings && (
        <>
          <IconButton size="large" onClick={() => setShowSettings(true)}>
            <Cog6ToothIcon />
          </IconButton>

          <Drawer isOpen={showSettings} onClose={() => setShowSettings(false)} title="Settings">
            <Settings />
          </Drawer>
        </>
      )}
    </header>
  );
};
