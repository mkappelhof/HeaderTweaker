import { Checkbox, INTERMEDIATE_INDICATOR } from '@components/input/checkbox';
import { Text } from '@components/text/text';
import { SCOPES } from '@constants/scopes';
import { type PendingHeader, useBulkScopeChangeContext } from '@contexts/bulk-scope-change.context';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { filterHeadersByScope } from '@helpers/scope.helper';

export const SelectHeaders = () => {
  const { headers } = useHeaderTweakerContext();
  const { pendingHeaders, setPendingHeaders } = useBulkScopeChangeContext();

  const headersWithoutScope = filterHeadersByScope(headers, SCOPES.NO_SCOPE);

  const pendingHeadersCount = Object.keys(pendingHeaders).length;
  const headersWithoutScopeIds = headersWithoutScope.map(({ id }) => id);
  const allHeadersSelected =
    headersWithoutScopeIds.length > 0 && pendingHeadersCount === headersWithoutScopeIds.length;

  return (
    <div>
      <Text>Select headers to assign a URL to</Text>
      <Checkbox
        aria-label="Select all headers"
        label="Select all"
        onChange={() => {
          setPendingHeaders(
            allHeadersSelected
              ? {}
              : headersWithoutScope.reduce<PendingHeader>((acc, { id }) => {
                  acc[id] = [];
                  return acc;
                }, {})
          );
        }}
        checked={allHeadersSelected ? true : pendingHeadersCount ? INTERMEDIATE_INDICATOR : false}
      />
      {headersWithoutScope.map(({ id, name }) => (
        <div key={`header-without-scope-${id}`}>
          <Checkbox
            aria-label={`Select ${name}`}
            label={name}
            checked={!!pendingHeaders[id]}
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
        </div>
      ))}
    </div>
  );
};
