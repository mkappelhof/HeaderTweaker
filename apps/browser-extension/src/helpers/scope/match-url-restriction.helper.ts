import { createHostnameExpression } from '@helpers/scope/create-host-expression.helper';
import { createPathExpression } from '@helpers/scope/create-path-expression.helper';
import { parseUrlRestriction } from './parse-url-restriction.helper';

type ParsedUrlRestriction = {
  hostname: string;
  pathname?: string;
  isExplicitSubdomain: boolean;
};

const matchHostname = (hostname: string, restriction: ParsedUrlRestriction) => {
  if (restriction.hostname.includes('*')) {
    return new RegExp(`^${createHostnameExpression(restriction.hostname)}$`, 'i').test(hostname);
  }

  return restriction.isExplicitSubdomain
    ? hostname === restriction.hostname
    : hostname === restriction.hostname || hostname.endsWith(`.${restriction.hostname}`);
};

const matchPathname = (pathname: string, restrictionPathname: string | undefined) => {
  if (!restrictionPathname || restrictionPathname === '/') return true;

  if (!restrictionPathname.includes('*')) {
    return pathname === restrictionPathname || pathname.startsWith(`${restrictionPathname}/`);
  }

  return new RegExp(`^${createPathExpression(restrictionPathname)}$`).test(pathname);
};

export const matchUrlRestriction = (url: string, restrictionValue: string) => {
  const restriction = parseUrlRestriction(restrictionValue);
  if (!restriction) return false;

  try {
    const requestUrl = new URL(url);
    return (
      /^https?:$/.test(requestUrl.protocol) &&
      matchHostname(requestUrl.hostname.toLowerCase(), restriction) &&
      matchPathname(requestUrl.pathname, restriction.pathname)
    );
  } catch {
    return false;
  }
};
