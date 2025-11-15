import { useState } from 'react';
import { IconButton } from '@components/button/icon-button';
import { Drawer } from '@components/drawer/drawer';
import { Settings } from '@components/settings/settings';
import { Status } from '@components/status/status';
import { Text } from '@components/text/text';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import packageJson from '../../../package.json';

import css from './app.module.scss';

interface AppHeaderProps {
  withoutSettings?: boolean;
}

export const AppHeader = ({ withoutSettings = false }: AppHeaderProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const { isDisabled } = useHeaderTweakerContext();

  return (
    <header className={css.header}>
      <div className={css.headerItems}>
        <Text variant="h1">
          <span className={css.headerName}>Header</span>
          <span className={css.tweakerName}>Tweaker</span>
        </Text>
        <Text as="code">v{packageJson.version}</Text>
        <Status
          status={isDisabled ? 'disabled' : 'enabled'}
          label={isDisabled ? 'HeaderTweaker is disabled' : undefined}
        />
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
