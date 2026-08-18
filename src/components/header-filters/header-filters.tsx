import { type ComponentPropsWithoutRef, type FC, useEffect, useRef, useState } from 'react';
import { Text } from '@components/text/text';
import { SCOPE_LABEL_KEYS, SCOPES, type Scope } from '@constants/scopes';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { getCurrentTabUrl } from '@helpers/header.helper';
import { filterHeadersByScope } from '@helpers/scope.helper';
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
  const { headers, showHeadersFilter, setShowHeadersFilter } = useHeaderTweakerContext();
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
  }, [showHeadersFilter, currentHost, headers]);

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
      {scopes.map((scope: Scope) => {
        const isActive = showHeadersFilter === scope;
        const count = filterHeadersByScope(headers, scope, currentUrl).length;

        return (
          <button
            key={scope}
            type="button"
            role="tab"
            disabled={isDisabled}
            aria-selected={isActive}
            data-active={isActive}
            className={classnames(css.tab, { [css.active]: isActive })}
            onClick={() => setShowHeadersFilter(scope)}
          >
            <Text as="span">{t(SCOPE_LABEL_KEYS[scope])}</Text>
            {scope === SCOPES.CURRENT_URL && currentHost && (
              <Text as="span" textStyle="secondary">
                {currentHost}
              </Text>
            )}
            <Text variant="body-small" textStyle="secondary">
              ({count})
            </Text>
          </button>
        );
      })}
    </div>
  );
};
