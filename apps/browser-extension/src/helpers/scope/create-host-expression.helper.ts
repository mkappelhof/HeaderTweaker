import { createPathExpression } from './create-path-expression.helper';

export const createHostnameExpression = (hostname: string) =>
  createPathExpression(hostname).replace(/\[\^\/\]/g, '[^.]');
