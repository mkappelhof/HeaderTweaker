import { useCallback } from 'react';
import { Button } from '@components/button/button';
import { Switch } from '@components/switch/switch';
import { IMPORT_PARAM } from '@constants/index';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { exportHeaders } from '@helpers/header.helper';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';

import css from './settings.module.scss';

export const Settings = () => {
  const { isDisabled, headers, setStatus } = useHeaderTweakerContext();

  const headerCount = headers.length;

  const openImportWindow = useCallback(() => {
    const width = 800;
    const height = 500;
    const left = window.screen.availWidth - width - 100;
    const top = 100;
    window.open(
      `${window.location.pathname}?${IMPORT_PARAM}=true`,
      'headertweaker',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes`
    );
  }, []);

  return (
    <div className={css.root}>
      <Switch
        isOn={isDisabled}
        label={`HeaderTweaker is ${isDisabled ? 'Disabled' : 'Enabled'}`}
        onChange={(newState) => setStatus(newState ? 'disabled' : 'enabled')}
      />
      <Button onClick={openImportWindow}>
        <ArrowUpTrayIcon /> Import new headers
      </Button>
      <Button onClick={exportHeaders} disabled={headerCount < 1}>
        <ArrowDownTrayIcon />
        Export {headerCount >= 1 ? headerCount : ''} header{headerCount !== 1 ? 's' : ''}
      </Button>
    </div>
  );
};
