import { Text } from '@components/text/text';
import { UrlSelector } from '@components/url-selector/url-selector';
import { useBulkScopeChangeContext } from '@contexts/bulk-scope-change.context';

export const SelectUrls = () => {
  const { pendingHeaders, setPendingHeaders, isCompleted } = useBulkScopeChangeContext();

  const [urls = []] = Object.values(pendingHeaders);

  return isCompleted ? (
    <Text>The selected headers are now restricted to the chosen URLs</Text>
  ) : (
    <div>
      <Text>Set the URL restrictions for the selected headers</Text>
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
