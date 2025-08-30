import { IconButton } from '@components/button/icon-button';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';

import css from './app.module.scss';

export const AppFooter = () => {
  return (
    <footer className={css.footer}>
      <img src="icon.png" alt="HeaderTweaker" width="56" />
      <h1>
        <span className={css.headerName}>Header</span>
        <span className={css.tweakerName}>Tweaker</span>
      </h1>
      <IconButton>
        <Cog6ToothIcon />
      </IconButton>
    </footer>
  );
};
