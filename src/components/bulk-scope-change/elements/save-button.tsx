import { Button } from '@components/button/button';
import { useBulkScopeChangeContext } from '@contexts/bulk-scope-change.context';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { useTranslation } from 'react-i18next';

export const SaveButton = () => {
  const { t } = useTranslation();
  const { headers, updateHeader } = useHeaderTweakerContext();
  const { pendingHeaders, setError, setIsCompleted } = useBulkScopeChangeContext();
  const hasUrl = Object.values(pendingHeaders).some((urls) =>
    urls.some((url) => url.trim().length > 0)
  );

  const saveHeaders = async () => {
    for (const [id, urls] of Object.entries(pendingHeaders)) {
      const header = headers.find((header) => header.id === id);

      if (!header) continue;

      try {
        await updateHeader({ header: { ...header, urls }, action: 'update' });
      } catch {
        setError(t('feedback.error.scopeChange'));
      } finally {
        setIsCompleted(true);
      }
    }
  };

  return (
    <Button disabled={!hasUrl} onClick={saveHeaders}>
      {t('button.scope.save')}
    </Button>
  );
};
