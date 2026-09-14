import { type FC, useState } from 'react';
import { BulkScopeChange } from '@components/bulk-scope-change/bulk-scope-change';
import { Button } from '@components/button/button';
import { IconButton } from '@components/button/icon-button';
import { Drawer } from '@components/drawer/drawer';
import { HeaderFilters } from '@components/header-filters/header-filters';
import { Settings } from '@components/settings/settings';
import { Status } from '@components/status/status';
import { Text } from '@components/text/text';
import { SCOPES } from '@constants/scopes';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { filterHeadersByScope } from '@helpers/scope/filter-headers-by-scope.helper';
import { CursorArrowRippleIcon } from '@heroicons/react/16/solid';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import packageJson from '../../../package.json';

import css from './app.module.scss';

type AppHeaderProps = {
  withoutSettings?: boolean;
};

export const AppHeader: FC<AppHeaderProps> = ({ withoutSettings = false }) => {
  const { t } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);
  const [showBulkScopeChange, setShowBulkScopeChange] = useState(false);
  const { scope, isDisabled, headers } = useHeaderTweakerContext();
  const headersWithoutScope = filterHeadersByScope(headers, SCOPES.NO_SCOPE);

  return (
    <>
      <header className={css.header}>
        <div className={css.main}>
          <div className={css.headerItems}>
            <Text variant="h1">
              <span className={css.headerName}>Header</span>
              <span className={css.tweakerName}>Tweaker</span>
            </Text>
            <Text as="code">v{packageJson.version}</Text>
            <Status
              status={isDisabled ? t('label.status.disabled') : t('label.status.enabled')}
              label={isDisabled ? t('app.disabled') : undefined}
            />
          </div>
          {!withoutSettings && (
            <>
              <IconButton size="large" onClick={() => setShowSettings(true)}>
                <Cog6ToothIcon />
              </IconButton>

              <Drawer
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                title={t('title.settings')}
              >
                <Settings />
              </Drawer>
            </>
          )}
        </div>

        <div className={css.scopes}>
          <div className={css.filters}>
            <HeaderFilters />
          </div>
          {scope === SCOPES.NO_SCOPE ? (
            <Button
              variant="ghost"
              className={css.scopeButton}
              disabled={!headers.length || !headersWithoutScope.length}
              onClick={() => setShowBulkScopeChange(true)}
            >
              <CursorArrowRippleIcon />
              {t('button.scope.wizard')}
            </Button>
          ) : null}
        </div>
      </header>
      <BulkScopeChange showModal={showBulkScopeChange} setShowModal={setShowBulkScopeChange} />
    </>
  );
};
