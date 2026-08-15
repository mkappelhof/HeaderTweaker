import { type FC, useEffect, useRef, useState } from 'react';
import { Drawer } from '@components/drawer/drawer';
import { EditHeader } from '@components/edit-header/edit-header';
import { HeaderItem } from '@components/header-list/header-item';
import { NoHeaders } from '@components/placeholders/no-headers';
import { Text } from '@components/text/text';
import { storage } from '@constants/index';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { getCurrentTabUrl } from '@helpers/header.helper';
import { filterHeadersByScope, getScopeErrorMessage } from '@helpers/scope.helper';
import classnames from 'clsx';

import css from './header-list.module.scss';

type HeaderListProps = Record<never, never>;

export const HeaderList: FC<HeaderListProps> = () => {
  const [open, setOpen] = useState(false);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [nameColWidth, setNameColWidth] = useState(275);
  const [labelColWidth, setLabelColWidth] = useState(150);
  const [isResizing, setIsResizing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | undefined>(undefined);
  const dragIndexRef = useRef<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const { headers, selectedHeader, reorderHeaders, useLabels, showHeadersFilter } =
    useHeaderTweakerContext();

  const visibleHeaders = filterHeadersByScope(headers, showHeadersFilter, currentUrl);

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
    const maxWidth = tableWidth - 218 - 80;
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
    const maxWidth = tableWidth - nameColWidth - 218 - 80;
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
    return <NoHeaders message="No headers to display yet, add your first one below" />;
  }

  if (!visibleHeaders.length) {
    return <NoHeaders message={getScopeErrorMessage(showHeadersFilter)} />;
  }

  return (
    <div className={css.root}>
      <table ref={tableRef} className={classnames({ [css.resizing]: isResizing })}>
        <colgroup>
          <col className={css.headerDragHandle} />
          <col className={css.headerSwitch} />
          {useLabels && <col style={{ width: labelColWidth }} />}
          <col style={{ width: nameColWidth }} />
          <col />
          <col className={css.headerScope} />
          <col className={css.headerActions} />
        </colgroup>
        <thead>
          <tr>
            <th />
            <th />
            {useLabels && (
              <th className={css.headerLabelTh}>
                <Text as="span">Label</Text>
                <div
                  className={classnames(css.columnResizeHandle, {
                    [css.columnResizeHandleActive]: isResizing,
                    [css.hidden]: !headers.length,
                  })}
                  onMouseDown={handleLabelResizeMouseDown}
                  aria-hidden="true"
                />
              </th>
            )}
            <th className={css.headerNameTh}>
              <Text as="span">Key</Text>
              <div
                className={classnames(css.columnResizeHandle, {
                  [css.columnResizeHandleActive]: isResizing,
                  [css.hidden]: !headers.length,
                })}
                onMouseDown={handleResizeMouseDown}
                aria-hidden="true"
              />
            </th>
            <th>
              <Text as="span">Value</Text>
            </th>
            <th />
            <th />
          </tr>
        </thead>
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
              currentUrl={currentUrl}
              {...header}
            />
          ))}
        </tbody>
      </table>
      <Drawer isOpen={open} title="Edit header" onClose={() => setOpen(false)}>
        {selectedHeader && <EditHeader closePanel={() => setOpen(false)} />}
      </Drawer>
    </div>
  );
};
