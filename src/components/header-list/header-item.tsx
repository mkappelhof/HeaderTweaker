import { type FC, useState } from 'react';
import { IconButton } from '@components/button/icon-button';
import { Confirm } from '@components/feedback/confirm';
import { HeaderContent } from '@components/header-content/header-content';
import { Switch } from '@components/switch/switch';
import { Text } from '@components/text/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/tooltip/tooltip';
import { SCOPES } from '@constants/scopes';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { matchesUrl } from '@helpers/header.helper';
import { Bars3Icon, GlobeAltIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import type { Header } from '@interfaces/index';
import classnames from 'clsx';
import { useTranslation } from 'react-i18next';

import css from './header-list.module.scss';

type HeaderItemProps = Header & {
  openDrawer: (state: boolean) => void;
  index: number;
  isDragOver: boolean;
  showLabel: boolean;
  currentUrl?: string;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
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
  currentUrl,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: HeaderItemProps) => {
  const { t } = useTranslation();
  const [headerToDelete, setHeaderToDelete] = useState<Header | null>(null);
  const { isDisabled, setSelectedHeader, updateHeader, showHeadersFilter } =
    useHeaderTweakerContext();

  const isScoped = urls && urls.length >= 1;
  const isCurrentUrl = !!(isScoped && currentUrl && matchesUrl(currentUrl, urls));

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
        <td className={css.scopedCell}>
          {showHeadersFilter === SCOPES.ALL ? (
            <Tooltip align="center">
              <TooltipTrigger>
                <GlobeAltIcon
                  width={20}
                  height={20}
                  className={classnames(css.scopedIcon, {
                    [css.active]: isScoped,
                    [css.inactive]: !isScoped,
                    [css.currentUrl]: isCurrentUrl,
                  })}
                />
              </TooltipTrigger>

              <TooltipContent>
                {!isScoped && <Text>{t('tooltip.scope.noScope')}</Text>}

                {isScoped ? (
                  isCurrentUrl ? (
                    <Text>{t('tooltip.scope.currentUrl')}</Text>
                  ) : (
                    <Text>{t('tooltip.scope.scope', { urls: urls?.join(', ') ?? '' })}</Text>
                  )
                ) : null}
              </TooltipContent>
            </Tooltip>
          ) : null}
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
          }
        }}
        onCancel={() => setHeaderToDelete(null)}
        onClose={() => setHeaderToDelete(null)}
      />
    </>
  );
};
