import { escapeRegularExpression } from './escape-regex.helper';

export const createPathExpression = (pathname: string) => {
  if (pathname.endsWith('/**/*')) {
    return `${escapeRegularExpression(pathname.slice(0, -5))}(?:/.*)?`;
  }

  if (pathname.endsWith('/**')) {
    return `${escapeRegularExpression(pathname.slice(0, -3))}(?:/.*)?`;
  }

  return pathname
    .split(/(\*\*|\*)/)
    .map((part) => {
      if (part === '**') return '.*';
      if (part === '*') return '[^/]*';
      return escapeRegularExpression(part);
    })
    .join('');
};
