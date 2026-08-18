import type { TranslationKey } from '@i18n/config';

export const SCOPES = {
  ALL: 'all',
  SCOPED: 'scoped',
  NO_SCOPE: 'no-scope',
  CURRENT_URL: 'current-url',
} as const;

export type Scope = (typeof SCOPES)[keyof typeof SCOPES];

export const SCOPE_LABEL_KEYS: Record<Scope, TranslationKey> = {
  [SCOPES.ALL]: 'scopes.all',
  [SCOPES.SCOPED]: 'scopes.scoped',
  [SCOPES.NO_SCOPE]: 'scopes.noScope',
  [SCOPES.CURRENT_URL]: 'scopes.currentUrl',
};
