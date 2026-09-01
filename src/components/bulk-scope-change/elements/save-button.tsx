import { type Dispatch, type FC, type SetStateAction, useState } from 'react';
import { Button } from '@components/button/button';
import { ToastItem } from '@components/toast/toast-item';
import { useBulkScopeChangeContext } from '@contexts/bulk-scope-change.context';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { useToastContext } from '@contexts/toast.context';
import { useTranslation } from 'react-i18next';

type SaveButtonProps = {
  closeModal: Dispatch<SetStateAction<boolean>>;
};

export const SaveButton: FC<SaveButtonProps> = ({ closeModal }) => {
  const { t } = useTranslation();
  const { addToast } = useToastContext();
  const { headers, updateHeader } = useHeaderTweakerContext();
  const { pendingHeaders, setError, setIsCompleted } = useBulkScopeChangeContext();

  const [loading, setLoading] = useState(false);

  const hasUrl = Object.values(pendingHeaders).some((urls) =>
    urls.some((url) => url.trim().length > 0)
  );

  const saveHeaders = async () => {
    try {
      for (const [id, urls] of Object.entries(pendingHeaders)) {
        const header = headers.find((header) => header.id === id);

        if (!header) continue;

        setLoading(true);
        await updateHeader({ header: { ...header, urls }, action: 'update' });
      }
    } catch {
      setError(t('feedback.error.scopeChange'));
    } finally {
      setIsCompleted(true);
      setLoading(false);
      closeModal(true);
      addToast(
        <ToastItem
          isCloseable
          variant="positive"
          message={t('feedback.success.header.bulkUpdate', {
            urls: [...new Set(Object.values(pendingHeaders).flat())].join(',·'),
          })}
        />
      );
    }
  };

  return (
    <Button disabled={!hasUrl} loading={loading} onClick={saveHeaders}>
      {t('button.scope.save')}
    </Button>
  );
};
