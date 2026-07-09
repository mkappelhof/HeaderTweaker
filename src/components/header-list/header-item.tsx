import { useState } from 'react';
import { IconButton } from '@components/button/icon-button';
import { Confirm } from '@components/feedback/confirm';
import { HeaderContent } from '@components/header-content/header-content';
import { Switch } from '@components/switch/switch';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { Bars3Icon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import type { Header } from '@interfaces/index';
import classnames from 'clsx';

import css from './header-list.module.scss';

interface HeaderItemProps extends Header {
  openDrawer: (state: boolean) => void;
  index: number;
  isDragOver: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
}

export const HeaderItem = ({
  id,
  name,
  value,
  enabled,
  urls,
  openDrawer,
  index,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: HeaderItemProps) => {
  const [headerToDelete, setHeaderToDelete] = useState<Header | null>(null);
  const { isDisabled, setSelectedHeader, updateHeader } = useHeaderTweakerContext();

  return (
    <>
      <tr
        draggable
        className={classnames({ [css.disabled]: isDisabled, [css.dragOver]: isDragOver })}
        onDragStart={() => onDragStart(index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={() => onDrop(index)}
        onDragEnd={onDragEnd}
      >
        <td className={css.dragHandleCell}>
          <span className={css.dragHandle}>
            <Bars3Icon />
          </span>
        </td>
        <td className={css.switchCell}>
          <Switch
            isOn={enabled}
            disabled={isDisabled}
            onChange={async (state) =>
              await updateHeader({
                header: { id, name, value, enabled: state, urls },
                action: 'activate',
                isActive: state,
              })
            }
          />
        </td>
        <td>
          <HeaderContent content={name} />
        </td>
        <td>
          <HeaderContent content={value} />
        </td>
        <td>
          <span className={css.buttonWrapper}>
            <IconButton
              disabled={isDisabled}
              aria-label="Edit header"
              onClick={() => {
                setSelectedHeader({ id, name, value, enabled, urls });
                openDrawer(true);
              }}
            >
              <PencilSquareIcon aria-label="Edit" />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              aria-label="Delete header"
              onClick={() => setHeaderToDelete({ id, name, value, enabled, urls })}
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
};
