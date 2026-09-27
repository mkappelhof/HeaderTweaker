import { Alert, AlertContent } from '@components/alert/alert';
import { ScopeSelector } from '@components/scope-selector/scope-selector';
import { Text } from '@components/text/text';
import { useBulkScopeChangeContext } from '@contexts/bulk-scope-change.context';
import { useTranslation } from 'react-i18next';

export const SelectUrls = () => {
  const { t } = useTranslation();
  const { pendingHeaders, setPendingHeaders, isCompleted, error } = useBulkScopeChangeContext();

  const [urls = []] = Object.values(pendingHeaders);

  return isCompleted ? (
    <Text>{t('feedback.success.scopeChange')}</Text>
  ) : (
    <div>
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
