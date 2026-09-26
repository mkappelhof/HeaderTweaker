import { Button } from '@components/button/button';
import { Checkbox, INTERMEDIATE_INDICATOR } from '@components/input/checkbox';
import { Text } from '@components/text/text';
import { SCOPES } from '@constants/scopes';
import { type PendingHeader, useBulkScopeChangeContext } from '@contexts/bulk-scope-change.context';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { filterHeadersByScope } from '@helpers/scope/filter-headers-by-scope.helper';
import classnames from 'clsx';
import { useTranslation } from 'react-i18next';

import css from '../bulk-scope-change.module.scss';

export const SelectHeaders = () => {
  const { t } = useTranslation();
  const { headers } = useHeaderTweakerContext();
  const { pendingHeaders, setPendingHeaders } = useBulkScopeChangeContext();

  const headersWithoutScope = filterHeadersByScope(headers, SCOPES.NO_SCOPE);

  const pendingHeadersCount = Object.keys(pendingHeaders).length;
  const headersWithoutScopeIds = headersWithoutScope.map(({ id }) => id);
  const allHeadersSelected =
    headersWithoutScopeIds.length > 0 && pendingHeadersCount === headersWithoutScopeIds.length;

  const toggleSelectAll = () =>
    setPendingHeaders(
      allHeadersSelected
        ? {}
        : headersWithoutScope.reduce<PendingHeader>((acc, { id }) => {
            acc[id] = [];
            return acc;
          }, {})
    );

  return (
    <div className={css.step}>
      <Text textStyle="secondary">{t('description.scope.headerSelect')}</Text>
      <div className={css.headerTable}>
        <div className={css.headerTableHead}>
          <Checkbox
            aria-label={t(
              allHeadersSelected
                ? 'a11y.ariaLabel.header.deselectAll'
                : 'a11y.ariaLabel.header.selectAll'
            )}
            onChange={toggleSelectAll}
            checked={
              allHeadersSelected ? true : pendingHeadersCount ? INTERMEDIATE_INDICATOR : false
            }
          />
          <Button variant="link" onClick={toggleSelectAll}>
            {t(
              allHeadersSelected
                ? 'a11y.ariaLabel.header.deselectAll'
                : 'a11y.ariaLabel.header.selectAll'
            )}
          </Button>
        </div>
        {headersWithoutScope.map(({ id, name, value }) => {
          const checkboxId = `bulk-scope-header-${id}`;
          const isSelected = !!pendingHeaders[id];

          return (
            <div
              key={`header-without-scope-${id}`}
              className={classnames(css.headerRow, { [css.selected]: isSelected })}
            >
              <Checkbox
                id={checkboxId}
                aria-label={t('a11y.ariaLabel.header.select', { name })}
                checked={isSelected}
                onChange={() =>
                  setPendingHeaders((currentHeaders) => {
                    if (currentHeaders[id]) {
                      const { [id]: _, ...rest } = currentHeaders;
                      return rest;
                    }

                    return { ...currentHeaders, [id]: [] };
                  })
                }
              />
              <label htmlFor={checkboxId} className={css.headerRowLabel}>
                <Text as="span" className={css.cell}>
                  {name}
                </Text>
                <Text as="span" textStyle="secondary" className={css.cell}>
                  {value}
                </Text>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
