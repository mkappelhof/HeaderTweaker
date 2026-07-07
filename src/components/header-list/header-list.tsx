import { useRef, useState } from 'react';
import { Drawer } from '@components/drawer/drawer';
import { EditHeader } from '@components/edit-header/edit-header';
import { HeaderItem } from '@components/header-list/header-item';
import { Text } from '@components/text/text';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';

import css from './header-list.module.scss';

export const HeaderList = () => {
  const [open, setOpen] = useState(false);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const { headers, selectedHeader, reorderHeaders } = useHeaderTweakerContext();

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

  return (
    <div className={css.root}>
      <table>
        <colgroup>
          <col className={css.headerDragHandle} />
          <col className={css.headerSwitch} />
          <col className={css.headerName} />
          <col className={css.headerValue} />
          <col className={css.headerActions} />
        </colgroup>
        <thead>
          <tr>
            <th />
            <th />
            <th>
              <Text as="span">Header key</Text>
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
