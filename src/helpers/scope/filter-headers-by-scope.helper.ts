import { SCOPES, type Scope } from '@constants/scopes';
import type { Header } from '@interfaces/index';
import { isScoped } from './is-scoped.helper';
import { matchUrlRestriction } from './match-url-restriction.helper';

export const filterHeadersByScope = (
  headers: ReadonlyArray<Header>,
  scope: Scope,
  currentUrl?: string
) => {
  switch (scope) {
    case SCOPES.NO_SCOPE:
      return headers.filter((header) => !isScoped(header));
    case SCOPES.CURRENT_URL:
      return currentUrl
        ? headers.filter(
            (header) =>
              isScoped(header) &&
              (header.urls ?? []).some((url) => matchUrlRestriction(currentUrl, url))
          )
        : [];
    default:
      return headers;
  }
};
