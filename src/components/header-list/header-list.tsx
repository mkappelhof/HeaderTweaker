import { type FC, useEffect, useRef, useState } from 'react';
import { Alert, AlertContent } from '@components/alert/alert';
import { Drawer } from '@components/drawer/drawer';
import { EditHeader } from '@components/edit-header/edit-header';
import { HeaderItem } from '@components/header-list/header-item';
import { NoHeaders } from '@components/placeholders/no-headers';
import { Text } from '@components/text/text';
import { storage } from '@constants/index';
import { SCOPES } from '@constants/scopes';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { getCurrentTabUrl } from '@helpers/get-current-tab.helper';
import { groupHeaders } from '@helpers/header/group-headers.helper';
import { filterHeadersByScope } from '@helpers/scope/filter-headers-by-scope.helper';
import { getScopeErrorMessageKey } from '@helpers/scope/get-scoped-error.helper';
import classnames from 'clsx';
import { useTranslation } from 'react-i18next';

import css from './header-list.module.scss';

type HeaderListProps = Record<never, never>;

const DRAG_HANDLE_WIDTH = 28;
const SWITCH_WIDTH = 70;

export const HeaderList: FC<HeaderListProps> = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [nameColWidth, setNameColWidth] = useState(275);
  const [labelColWidth, setLabelColWidth] = useState(150);
  const [isResizing, setIsResizing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | undefined>(undefined);
  const dragIndexRef = useRef<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const { headers, selectedHeader, reorderHeaders, useLabels, scope } = useHeaderTweakerContext();

  const visibleHeaders = filterHeadersByScope(headers, scope, currentUrl);

  useEffect(() => {
    storage.local.get(['nameColWidth', 'labelColWidth']).then((result) => {
      if (typeof result.nameColWidth === 'number') {
        setNameColWidth(result.nameColWidth);
      }
      if (typeof result.labelColWidth === 'number') {
        setLabelColWidth(result.labelColWidth);
      }
    });
  }, []);

  useEffect(() => {
    getCurrentTabUrl().then(setCurrentUrl);
  }, []);

  const openDrawer = (state: boolean) => setOpen(state);

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndexRef.current !== index) {
      setDropIndex(index);
    }
  };

  const handleDrop = async (index: number) => {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    setDropIndex(null);
    if (from === null || from === index) return;

    const fromIndex = headers.findIndex(({ id }) => id === visibleHeaders[from]?.id);
    const toIndex = headers.findIndex(({ id }) => id === visibleHeaders[index]?.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const newHeaders = [...headers];
    const [moved] = newHeaders.splice(fromIndex, 1);
    newHeaders.splice(toIndex, 0, moved);
    await reorderHeaders(newHeaders);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDropIndex(null);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = nameColWidth;
    const tableWidth = tableRef.current?.offsetWidth ?? 600;
    const maxWidth =
      tableWidth - DRAG_HANDLE_WIDTH - SWITCH_WIDTH - (useLabels ? labelColWidth : 0) - 180;
    let currentWidth = startWidth;

    setIsResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      currentWidth = Math.max(80, Math.min(maxWidth, startWidth + delta));
      setNameColWidth(currentWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      storage.local.set({ nameColWidth: currentWidth });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleLabelResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = labelColWidth;
    const tableWidth = tableRef.current?.offsetWidth ?? 600;
    const maxWidth = tableWidth - nameColWidth - DRAG_HANDLE_WIDTH - SWITCH_WIDTH - 180;
    let currentWidth = startWidth;

    setIsResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      currentWidth = Math.max(80, Math.min(maxWidth, startWidth + delta));
      setLabelColWidth(currentWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      storage.local.set({ labelColWidth: currentWidth });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!headers.length) {
    return <NoHeaders message={t('feedback.empty.headers')} />;
  }

  if (!visibleHeaders.length) {
    return <NoHeaders message={t(getScopeErrorMessageKey(scope))} />;
  }

  const dividerBaseOffset = DRAG_HANDLE_WIDTH + SWITCH_WIDTH + (useLabels ? labelColWidth : 0);
  const labelDividerOffset = DRAG_HANDLE_WIDTH + SWITCH_WIDTH + labelColWidth;
  const nameDividerOffset = dividerBaseOffset + nameColWidth;

  return (
    <div className={css.root}>
      {scope === SCOPES.NO_SCOPE && (
        <Alert variant="warning">
          <AlertContent>
            <AlertContent>
              <Text variant="body-small">
                {t('label.scope.noScopeWarning', { count: visibleHeaders.length })}
              </Text>
            </AlertContent>
          </AlertContent>
        </Alert>
      )}

      <div className={css.tableWrapper}>
        <table
          ref={tableRef}
          className={classnames(css.tableFixed, { [css.resizing]: isResizing })}
        >
          <colgroup>
            <col className={css.headerDragHandle} />
            <col className={css.headerSwitch} />
            {useLabels && <col style={{ width: labelColWidth }} />}
            <col style={{ width: nameColWidth }} />
            <col />
            <col className={css.headerActions} />
          </colgroup>
          {scope === SCOPES.ALL ? (
            groupHeaders(visibleHeaders).map((group) => {
              const groupKey = group.urls.length ? group.urls.join(',') : 'global';
              const groupLabel = group.urls.length
                ? group.urls.join(', ')
                : t('label.scope.noScope');

              return (
                <tbody key={groupKey}>
                  <tr className={css.groupRow}>
                    <td colSpan={useLabels ? 6 : 5}>
                      <Text as="span" variant="body-small" textStyle="secondary">
                        {groupLabel}
                      </Text>
                    </td>
                  </tr>
                  {group.headers.map((header) => {
                    const index = visibleHeaders.findIndex(({ id }) => id === header.id);

                    return (
                      <HeaderItem
                        key={`${groupKey}-${header.id}`}
                        index={index}
                        showLabel={useLabels}
                        isDragOver={dropIndex === index}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                        openDrawer={openDrawer}
                        {...header}
                      />
                    );
                  })}
                </tbody>
              );
            })
          ) : (
            <tbody>
              {visibleHeaders.map((header, index) => (
                <HeaderItem
                  key={header.id}
                  index={index}
                  showLabel={useLabels}
                  isDragOver={dropIndex === index}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  openDrawer={openDrawer}
                  {...header}
                />
              ))}
            </tbody>
          )}
        </table>
        {useLabels && (
          <div
            className={classnames(css.columnResizeHandle, {
              [css.columnResizeHandleActive]: isResizing,
            })}
            style={{ left: labelDividerOffset }}
            onMouseDown={handleLabelResizeMouseDown}
            aria-hidden="true"
          />
        )}
        <div
          className={classnames(css.columnResizeHandle, {
            [css.columnResizeHandleActive]: isResizing,
          })}
          style={{ left: nameDividerOffset }}
          onMouseDown={handleResizeMouseDown}
          aria-hidden="true"
        />
      </div>
      <Drawer isOpen={open} title={t('title.header.edit')} onClose={() => setOpen(false)}>
        {selectedHeader && <EditHeader closePanel={() => setOpen(false)} />}
      </Drawer>
    </div>
  );
};
