import type { Dispatch, SetStateAction } from 'react';
import { IconButton } from '@components/button/icon-button';
import { Switch } from '@components/switch/switch';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import type { Header } from '@interfaces/index';

import css from './header-list.module.scss';

interface HeaderItemProps extends Header {
  openDrawer: Dispatch<SetStateAction<boolean>>;
}

export const HeaderItem = ({ name, value, enabled, openDrawer }: HeaderItemProps) => {
  const { setSelectedHeader } = useHeaderTweakerContext();

  return (
    <tr>
      <td>
        <Switch isOn={enabled} onChange={(isOn) => console.log('isOn', isOn)} />
      </td>
      <td>
        <p>{name}</p>
      </td>
      <td>
        <p>{value}</p>
      </td>
      <td>
        <span className={css.buttonWrapper}>
          <IconButton
            onClick={() => {
              setSelectedHeader({ name, value, enabled });
              openDrawer(true);
            }}
          >
            <PencilSquareIcon />
          </IconButton>
          <IconButton>
            <TrashIcon />
          </IconButton>
        </span>
      </td>
    </tr>
  );
};
