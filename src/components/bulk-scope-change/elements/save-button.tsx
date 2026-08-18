import { Button } from '@components/button/button';
import { useBulkScopeChangeContext } from '@contexts/bulk-scope-change.context';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';

export const SaveButton = () => {
  const { headers, updateHeader } = useHeaderTweakerContext();
  const { pendingHeaders, setError, setIsCompleted } = useBulkScopeChangeContext();

  const saveHeaders = async () => {
    for (const [id, urls] of Object.entries(pendingHeaders)) {
      const header = headers.find((header) => header.id === id);

      if (!header) continue;

      try {
        await updateHeader({ header: { ...header, urls }, action: 'update' });
      } catch {
        setError('Unable to update headers');
      } finally {
        setIsCompleted(true);
      }
    }
  };

  return <Button onClick={saveHeaders}>Save headers</Button>;
};
