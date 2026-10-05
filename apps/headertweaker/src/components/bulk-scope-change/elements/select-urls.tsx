import { Alert, AlertContent } from '@components/alert/alert';
import { Pill } from '@components/pill/pill';
import { ScopeSelector } from '@components/scope-selector/scope-selector';
import { Text } from '@components/text/text';
import { useBulkScopeChangeContext } from '@contexts/bulk-scope-change.context';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { useTranslation } from 'react-i18next';

import css from '../bulk-scope-change.module.scss';

export const SelectUrls = () => {
  const { t } = useTranslation();
  const { headers } = useHeaderTweakerContext();
  const { pendingHeaders, setPendingHeaders, isCompleted, error } = useBulkScopeChangeContext();

  const [urls = []] = Object.values(pendingHeaders);
  const selectedHeaders = headers.filter(({ id }) => pendingHeaders[id]);

  return isCompleted ? (
    <Text>{t('feedback.success.scopeChange')}</Text>
  ) : (
    <div className={css.step}>
      <div className={css.selectedHeaders}>
        <Text as="span" variant="body-small">
          {t('label.scope.selectedHeaders', { count: selectedHeaders.length })}
        </Text>
        <div className={css.pills}>
          {selectedHeaders.map(({ id, name }) => (
            <Pill key={`selected-header-${id}`}>{name}</Pill>
          ))}
        </div>
      </div>
      <ScopeSelector
        urls={urls}
        onChange={(updatedUrls) =>
          setPendingHeaders((currentHeaders) =>
            Object.fromEntries(Object.keys(currentHeaders).map((id) => [id, updatedUrls]))
          )
        }
      />
      {error && (
        <Alert variant="negative">
          <AlertContent>{error}</AlertContent>
        </Alert>
      )}
    </div>
  );
};
