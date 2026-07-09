import { useEffect, useRef, useState } from 'react';
import { Drawer } from '@components/drawer/drawer';
import { EditHeader } from '@components/edit-header/edit-header';
import { HeaderItem } from '@components/header-list/header-item';
import { Text } from '@components/text/text';
import { storage } from '@constants/index';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import classnames from 'clsx';

import css from './header-list.module.scss';

export const HeaderList = () => {
  const [open, setOpen] = useState(false);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [nameColWidth, setNameColWidth] = useState(275);
  const [isResizing, setIsResizing] = useState(false);
  const dragIndexRef = useRef<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const { headers, selectedHeader, reorderHeaders } = useHeaderTweakerContext();

  useEffect(() => {
    storage.local.get('nameColWidth').then((result) => {
      if (typeof result.nameColWidth === 'number') {
        setNameColWidth(result.nameColWidth);
      }
    });
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
    const newHeaders = [...headers];
    const [moved] = newHeaders.splice(from, 1);
    newHeaders.splice(index, 0, moved);
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

  return (
    <div className={css.root}>
      <table ref={tableRef} className={classnames({ [css.resizing]: isResizing })}>
        <colgroup>
          <col className={css.headerDragHandle} />
          <col className={css.headerSwitch} />
          <col style={{ width: nameColWidth }} />
          <col />
          <col className={css.headerActions} />
        </colgroup>
        <thead>
          <tr>
            <th />
            <th />
            <th className={css.headerNameTh}>
              <Text as="span">Header key</Text>
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
              <Text as="span">Header value</Text>
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {!headers.length ? (
            <tr>
              <td colSpan={5} className={css.notFound}>
                <Text>No headers to display yet</Text>
              </td>
            </tr>
          ) : (
            headers.map((header, index) => (
              <HeaderItem
                key={header.id}
                index={index}
                isDragOver={dropIndex === index}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                openDrawer={openDrawer}
                {...header}
              />
            ))
          )}
        </tbody>
      </table>
      <Drawer isOpen={open} title="Edit header" onClose={() => setOpen(false)}>
        {selectedHeader && <EditHeader closePanel={() => setOpen(false)} />}
      </Drawer>
    </div>
  );
};
