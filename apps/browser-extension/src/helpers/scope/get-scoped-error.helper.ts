import { SCOPES, type Scope } from '@constants/scopes';
import type { TranslationKey } from '@i18n/config';

export const getScopeErrorMessageKey = (scope: Scope): TranslationKey => {
  switch (scope) {
    case SCOPES.NO_SCOPE:
      return 'label.scope.emptyNoScope';
    case SCOPES.CURRENT_URL:
      return 'label.scope.emptyCurrentUrl';
    default:
      return 'label.scope.emptyAll';
  }
};
