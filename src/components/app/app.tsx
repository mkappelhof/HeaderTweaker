import { HeaderList } from '@components/header-list/header-list';
import { ImportHeaders } from '@components/import-headers/import-headers';
import { IMPORT_PARAM } from '@constants/index';
import { HeaderTweakerProvider } from '@contexts/headertweaker.context';
import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';

import css from './app.module.scss';

export const App = () => {
  const params = new URLSearchParams(window.location.search);

  const isImportWindow = params.get(IMPORT_PARAM) === 'true';

  return (
    <HeaderTweakerProvider>
      <div className={css.root}>
        <AppHeader withoutSettings={isImportWindow} />
        <div className={css.content}>{isImportWindow ? <ImportHeaders /> : <HeaderList />}</div>
        {!isImportWindow && <AppFooter />}
      </div>
    </HeaderTweakerProvider>
  );
};
