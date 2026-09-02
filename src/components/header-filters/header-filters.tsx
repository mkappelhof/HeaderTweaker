import { type ComponentPropsWithoutRef, type FC, useEffect, useRef, useState } from 'react';
import { Text } from '@components/text/text';
import { SCOPE_LABEL_KEYS, SCOPES, type Scope } from '@constants/scopes';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { getCurrentTabUrl } from '@helpers/get-current-tab.helper';
import { filterHeadersByScope } from '@helpers/scope/filter-headers-by-scope.helper';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import classnames from 'clsx';
import { useTranslation } from 'react-i18next';

import css from './header-filters.module.scss';

const scopes = Object.values(SCOPES);

const getHost = (url?: string) => {
  if (!url) return undefined;

  try {
    return new URL(url).host.replace(/^www\./i, '');
  } catch {
    return undefined;
  }
};

export const HeaderFilters: FC<ComponentPropsWithoutRef<'div'>> = ({ className }) => {
  const { t } = useTranslation();
  const { headers, scope, setscope } = useHeaderTweakerContext();
  const [currentUrl, setCurrentUrl] = useState<string | undefined>(undefined);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const listRef = useRef<HTMLDivElement>(null);

  const currentHost = getHost(currentUrl);
  const isDisabled = !headers.length;

  useEffect(() => {
    getCurrentTabUrl().then(setCurrentUrl);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure when the active tab or its label changes
  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (!active) return;

    setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
  }, [scope, currentHost, headers]);

  return (
    <div
      className={classnames(css.root, className, { [css.disabled]: isDisabled })}
      ref={listRef}
      role="tablist"
    >
      <span
        className={css.indicator}
        style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
      />
      {scopes.map((currentScope: Scope) => {
        const isActive = currentScope === scope;
        const count = filterHeadersByScope(headers, currentScope, currentUrl).length;

        return (
          <button
            key={currentScope}
            type="button"
            role="tab"
            disabled={isDisabled}
            aria-selected={isActive}
            data-active={isActive}
            className={classnames(css.tab, { [css.active]: isActive })}
            onClick={() => setscope(currentScope)}
          >
            <Text as="span">{t(SCOPE_LABEL_KEYS[currentScope])}</Text>
            {currentScope === SCOPES.CURRENT_URL && currentHost && (
              <Text as="span" textStyle="secondary">
                {currentHost}
              </Text>
            )}
            <Text variant="body-small" textStyle="secondary">
              ({count})
            </Text>
            {currentScope === SCOPES.NO_SCOPE && count > 0 && (
              <InformationCircleIcon className={css.icon} />
            )}
          </button>
        );
      })}
    </div>
  );
};
