import { type FC, useState } from 'react';
import { IconButton } from '@components/button/icon-button';
import { Confirm } from '@components/feedback/confirm';
import { HeaderContent } from '@components/header-content/header-content';
import { Switch } from '@components/switch/switch';
import { ToastItem } from '@components/toast/toast-item';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { useToastContext } from '@contexts/toast.context';
import { Bars3Icon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import type { Header } from '@interfaces/index';
import classnames from 'clsx';
import { useTranslation } from 'react-i18next';

import css from './header-list.module.scss';

type HeaderItemProps = Header & {
  openDrawer: (state: boolean) => void;
  index: number;
  isDragOver: boolean;
  showLabel: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number, urls?: string[]) => void;
  onDrop: (index: number, urls?: string[]) => void;
  onDragEnd: () => void;
};

export const HeaderItem: FC<HeaderItemProps> = ({
  id,
  name,
  value,
  enabled,
  urls,
  label,
  openDrawer,
  index,
  isDragOver,
  showLabel,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: HeaderItemProps) => {
  const { t } = useTranslation();
  const [headerToDelete, setHeaderToDelete] = useState<Header | null>(null);

  const { addToast } = useToastContext();
  const { isDisabled, setSelectedHeader, updateHeader } = useHeaderTweakerContext();

  return (
    <>
      <tr
        draggable
        className={classnames({ [css.disabled]: isDisabled, [css.dragOver]: isDragOver })}
        onDragStart={() => onDragStart(index)}
        onDragOver={(e) => onDragOver(e, index, urls ?? [])}
        onDrop={() => onDrop(index, urls ?? [])}
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
                header: { id, name, value, enabled: state, urls, label },
                action: 'activate',
                isActive: state,
              })
            }
          />
        </td>
        {showLabel && (
          <td className={css.labelCell}>
            {label ? <span className={css.label}>{label}</span> : null}
          </td>
        )}
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
              aria-label={t('a11y.ariaLabel.header.edit')}
              onClick={() => {
                setSelectedHeader({ id, name, value, enabled, urls, label });
                openDrawer(true);
              }}
            >
              <PencilSquareIcon aria-label={t('a11y.ariaLabel.header.edit')} />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              aria-label={t('a11y.ariaLabel.header.delete')}
              onClick={() => setHeaderToDelete({ id, name, value, enabled, urls, label })}
            >
              <TrashIcon aria-label={t('a11y.ariaLabel.header.delete')} />
            </IconButton>
          </span>
        </td>
      </tr>
      <Confirm
        isOpen={!!headerToDelete}
        title={t('title.header.delete')}
        message={t('feedback.confirm.delete', { name: headerToDelete?.name ?? '' })}
        confirmText={t('button.feedback.confirmDelete')}
        cancelText={t('button.feedback.cancelDelete')}
        onConfirm={async () => {
          if (headerToDelete) {
            await updateHeader({ header: headerToDelete, action: 'remove' });
            setSelectedHeader(null);
            setHeaderToDelete(null);
            addToast(
              <ToastItem variant="positive" message={t('feedback.success.header.delete')} />
            );
          }
        }}
        onCancel={() => setHeaderToDelete(null)}
        onClose={() => setHeaderToDelete(null)}
      />
    </>
  );
};
