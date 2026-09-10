import { matchUrlRestriction } from '@helpers/scope/match-url-restriction.helper';
import type { Header } from '@interfaces/index';

export const countAppliedHeaders = (
  headers: ReadonlyArray<Pick<Header, 'enabled' | 'urls'>>,
  currentUrl?: string
): number =>
  headers.filter(({ enabled, urls }) => {
    if (!enabled) return false;
    if (!urls?.length) return true;
    if (!currentUrl) return false;
    return urls.some((url) => matchUrlRestriction(currentUrl, url));
  }).length;
