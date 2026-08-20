import type { FC } from 'react';
import { Button } from '@components/button/button';
import { Switch } from '@components/switch/switch';
import { Text } from '@components/text/text';
import { IMPORT_PARAM } from '@constants/index';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { exportHeaders } from '@helpers/header.helper';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

import css from './settings.module.scss';

type SettingsProps = Record<never, never>;

export const Settings: FC<SettingsProps> = () => {
  const { t } = useTranslation();
  const { isDisabled, headers, setStatus, useLabels, setUseLabels } = useHeaderTweakerContext();

  const handleStatusChange = (newState: boolean) => {
    setStatus(newState ? 'enabled' : 'disabled').catch(console.error);
  };

  const headerCount = headers.length;

  const openImportWindow = () => {
    const width = 800;
    const height = 500;
    const left = window.screen.availWidth - width - 100;
    const top = 100;
    window.open(
      `${window.location.pathname}?${IMPORT_PARAM}=true`,
      'headertweaker',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes`
    );
  };

  return (
    <div className={css.root}>
      <Switch
        isOn={!isDisabled}
        label={t('app.status', {
          status: t(isDisabled ? 'label.status.disabled' : 'label.status.enabled'),
        })}
        onChange={handleStatusChange}
      />
      <Switch isOn={useLabels} label={t('label.settings.useLabels')} onChange={setUseLabels} />
      <Button onClick={openImportWindow}>
        <ArrowUpTrayIcon /> {t('label.settings.import')}
      </Button>
      <Button onClick={exportHeaders} disabled={headerCount < 1}>
        <ArrowDownTrayIcon />
        <Text as="span">{t('label.settings.export', { count: headerCount })}</Text>
      </Button>
    </div>
  );
};
