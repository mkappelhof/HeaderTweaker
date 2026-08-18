import { Text } from '@components/text/text';
import { UrlSelector } from '@components/url-selector/url-selector';
import { useBulkScopeChangeContext } from '@contexts/bulk-scope-change.context';
import { useTranslation } from 'react-i18next';

export const SelectUrls = () => {
  const { t } = useTranslation();
  const { pendingHeaders, setPendingHeaders, isCompleted } = useBulkScopeChangeContext();

  const [urls = []] = Object.values(pendingHeaders);

  return isCompleted ? (
    <Text>{t('bulkScopeChange.completed')}</Text>
  ) : (
    <div>
      <Text>{t('bulkScopeChange.setUrlsDescription')}</Text>
      <UrlSelector
        urls={urls}
        onChange={(updatedUrls) =>
          setPendingHeaders((currentHeaders) =>
            Object.fromEntries(Object.keys(currentHeaders).map((id) => [id, updatedUrls]))
          )
        }
      />
    </div>
  );
};
