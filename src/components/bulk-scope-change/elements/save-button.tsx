import { type FC, useState } from 'react';
import { Button } from '@components/button/button';
import { Text } from '@components/text/text';
import { ToastItem } from '@components/toast/toast-item';
import { useBulkScopeChangeContext } from '@contexts/bulk-scope-change.context';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { useToastContext } from '@contexts/toast.context';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

type SaveButtonProps = {
  closeModal: () => void;
};

export const SaveButton: FC<SaveButtonProps> = ({ closeModal }) => {
  const { t } = useTranslation();
  const { addToast } = useToastContext();
  const { headers, updateHeader } = useHeaderTweakerContext();
  const { pendingHeaders, error, setError, setIsCompleted } = useBulkScopeChangeContext();

  const [loading, setLoading] = useState(false);

  const hasUrl = Object.values(pendingHeaders).some((urls) =>
    urls.some((url) => url.trim().length > 0)
  );

  let hasError = !!error;

  const saveHeaders = async () => {
    setLoading(true);

    if (hasError) setError('');

    try {
      for (const [id, urls] of Object.entries(pendingHeaders)) {
        const header = headers.find((header) => header.id === id);

        if (!header) continue;

        await updateHeader({ header: { ...header, urls }, action: 'update' });
      }
    } catch {
      setError(t('feedback.error.scopeChange'));
      hasError = true;
    } finally {
      setLoading(false);

      if (!hasError) {
        setIsCompleted(true);
        closeModal();
        addToast(
          <ToastItem variant="positive" message={t('feedback.success.header.bulkUpdate')} />
        );
      }
    }
  };

  return (
    <Button disabled={!hasUrl} loading={loading} onClick={saveHeaders}>
      <CheckCircleIcon />
      <Text as="span">{t('button.scope.save')}</Text>
    </Button>
  );
};
