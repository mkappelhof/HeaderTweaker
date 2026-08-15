export const SCOPES = {
  ALL: 'all',
  SCOPED: 'scoped',
  NO_SCOPE: 'no-scope',
  CURRENT_URL: 'current-url',
} as const;

export type Scope = (typeof SCOPES)[keyof typeof SCOPES];

export const SCOPE_LABELS: Record<Scope, string> = {
  [SCOPES.ALL]: 'All',
  [SCOPES.SCOPED]: 'URL-specific',
  [SCOPES.NO_SCOPE]: 'Global',
  [SCOPES.CURRENT_URL]: 'Current',
};
