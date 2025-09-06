import { type Dispatch, type SetStateAction, useState } from 'react';
import { IconButton } from '@components/button/icon-button';
import { Confirm } from '@components/feedback/confirm';
import { Switch } from '@components/switch/switch';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { removeHeader } from '@helpers/header.helper';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import type { Header } from '@interfaces/index';

import css from './header-list.module.scss';

interface HeaderItemProps extends Header {
  openDrawer: Dispatch<SetStateAction<boolean>>;
}

export const HeaderItem = ({ id, name, value, enabled, openDrawer }: HeaderItemProps) => {
  const [headerToDelete, setHeaderToDelete] = useState<Header | null>(null);
  const { setSelectedHeader, updateHeader } = useHeaderTweakerContext();

  return (
    <>
      <tr>
        <td>
          <Switch
            isOn={enabled}
            onChange={async (state) =>
              await updateHeader({
                header: { id, name, value, enabled: state },
                action: 'activate',
                isActive: state,
              })
            }
          />
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
                setSelectedHeader({ id, name, value, enabled });
                openDrawer(true);
              }}
            >
              <PencilSquareIcon />
            </IconButton>
            <IconButton onClick={() => setHeaderToDelete({ id, name, value, enabled })}>
              <TrashIcon />
            </IconButton>
          </span>
        </td>
      </tr>
      <Confirm
        isOpen={!!headerToDelete}
        title="Delete header"
        message={`Are you sure you want to delete the "${headerToDelete?.name}" header? This action cannot be undone.`}
        confirmText="Yes"
        cancelText="No"
        onConfirm={async () => {
          await removeHeader({ id, name, value, enabled });
          setSelectedHeader(null);
          setHeaderToDelete(null);
        }}
        onCancel={() => setHeaderToDelete(null)}
        onClose={() => setHeaderToDelete(null)}
      />
    </>
  );
};
