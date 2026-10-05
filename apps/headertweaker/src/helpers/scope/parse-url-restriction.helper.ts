import { parse } from 'tldts';

type ParsedUrlRestriction = {
  hostname: string;
  pathname?: string;
  isExplicitSubdomain: boolean;
};

export const parseUrlRestriction = (value: string): ParsedUrlRestriction | null => {
  const withoutProtocol = value.trim().replace(/^[a-z][a-z\d+.-]*:\/\//i, '');
  const withoutQueryOrFragment = withoutProtocol.split(/[?#]/)[0] ?? '';
  const slashIndex = withoutQueryOrFragment.indexOf('/');
  const hostname = (
    slashIndex === -1 ? withoutQueryOrFragment : withoutQueryOrFragment.slice(0, slashIndex)
  )
    .replace(/:\d+$/, '')
    .toLowerCase();

  if (!hostname) return null;

  const pathname = slashIndex === -1 ? undefined : withoutQueryOrFragment.slice(slashIndex) || '/';
  const domain = parse(hostname).domain;

  return {
    hostname,
    pathname,
    isExplicitSubdomain: Boolean(domain && hostname !== domain),
  };
};
