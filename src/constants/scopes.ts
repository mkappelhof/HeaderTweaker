import type { TranslationKey } from '@i18n/config';

export const SCOPES = {
  ALL: 'all',
  SCOPED: 'scoped',
  NO_SCOPE: 'no-scope',
  CURRENT_URL: 'current-url',
} as const;

export type Scope = (typeof SCOPES)[keyof typeof SCOPES];

export const SCOPE_LABEL_KEYS: Record<Scope, TranslationKey> = {
  [SCOPES.ALL]: 'label.scope.all',
  [SCOPES.SCOPED]: 'label.scope.scoped',
  [SCOPES.NO_SCOPE]: 'label.scope.noScope',
  [SCOPES.CURRENT_URL]: 'label.scope.currentUrl',
};
