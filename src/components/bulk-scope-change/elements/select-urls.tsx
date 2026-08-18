import { Text } from '@components/text/text';
import { UrlSelector } from '@components/url-selector/url-selector';
import { useBulkScopeChangeContext } from '@contexts/bulk-scope-change.context';

export const SelectUrls = () => {
  const { pendingHeaders, setPendingHeaders, isCompleted } = useBulkScopeChangeContext();

  const [urls = []] = Object.values(pendingHeaders);

  return isCompleted ? (
    <div>DONE YO</div>
  ) : (
    <div>
      <Text>Set the URLs to apply to the selected headers</Text>
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
