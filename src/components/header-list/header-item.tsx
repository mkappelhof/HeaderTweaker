import { memo, useState } from 'react';
import { IconButton } from '@components/button/icon-button';
import { Confirm } from '@components/feedback/confirm';
import { Switch } from '@components/switch/switch';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import type { Header } from '@interfaces/index';
import classnames from 'clsx';

import css from './header-list.module.scss';

interface HeaderItemProps extends Header {
  openDrawer: (state: boolean) => void;
}

export const HeaderItem = memo(({ id, name, value, enabled, openDrawer }: HeaderItemProps) => {
  const [headerToDelete, setHeaderToDelete] = useState<Header | null>(null);
  const { isDisabled, selectedHeader, setSelectedHeader, updateHeader } = useHeaderTweakerContext();

  return (
    <>
      <tr className={classnames({ [css.disabled]: isDisabled })}>
        <td>
          <Switch
            isOn={enabled}
            disabled={isDisabled}
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
              disabled={isDisabled}
              aria-label="Edit header"
              onClick={() => {
                setSelectedHeader(selectedHeader ?? { id, name, value, enabled });
                openDrawer(true);
              }}
            >
              <PencilSquareIcon aria-label="Edit" />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              aria-label="Delete header"
              onClick={() => setHeaderToDelete({ id, name, value, enabled })}
            >
              <TrashIcon aria-label="Delete" />
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
          if (headerToDelete) {
            await updateHeader({ header: headerToDelete, action: 'remove' });
            setSelectedHeader(null);
            setHeaderToDelete(null);
          }
        }}
        onCancel={() => setHeaderToDelete(null)}
        onClose={() => setHeaderToDelete(null)}
      />
    </>
  );
});
