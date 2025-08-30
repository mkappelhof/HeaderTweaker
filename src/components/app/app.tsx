import { HeaderList } from '@components/header-list/header-list';
import { HeaderTweakerProvider } from '@contexts/headertweaker.context';
import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';

import css from './app.module.scss';

export const App = () => {
  return (
    <HeaderTweakerProvider>
      <div className={css.root}>
        <AppHeader />
        <div className={css.content}>
          <HeaderList />
        </div>
        <AppFooter />
      </div>
    </HeaderTweakerProvider>
  );
};
