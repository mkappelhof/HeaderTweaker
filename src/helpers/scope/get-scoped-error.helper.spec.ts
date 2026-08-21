import { SCOPES } from '@constants/scopes';
import { describe, expect, it } from 'vitest';
import { getScopeErrorMessageKey } from './get-scoped-error.helper';

describe('getScopeErrorMessageKey', () => {
  it('returns a distinct key for every scope', () => {
    const keys = Object.values(SCOPES).map(getScopeErrorMessageKey);

    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.every(Boolean)).toBe(true);
  });

  it('points at the message explaining why the selected scope is empty', () => {
    expect(getScopeErrorMessageKey(SCOPES.ALL)).toBe('label.scope.emptyAll');
    expect(getScopeErrorMessageKey(SCOPES.NO_SCOPE)).toBe('label.scope.emptyNoScope');
    expect(getScopeErrorMessageKey(SCOPES.CURRENT_URL)).toBe('label.scope.emptyCurrentUrl');
  });
});
