import { normalizeUrlRestriction } from '@helpers/scope/normalize-url-restriction.helper';
import type { Header } from '@interfaces/index';

export const isDuplicateUrl = (header: Header | null, index: number) => {
  const url = normalizeUrlRestriction(header?.urls?.[index] ?? '');

  return Boolean(
    url &&
      header?.urls?.some((value, valueIndex) => {
        return valueIndex !== index && normalizeUrlRestriction(value) === url;
      })
  );
};
