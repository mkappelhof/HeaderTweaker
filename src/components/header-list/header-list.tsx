import { useState } from 'react';
import { Drawer } from '@components/drawer/drawer';
import { EditHeader } from '@components/edit-header/edit-header';
import { HeaderItem } from '@components/header-list/header-item';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';

import css from './header-list.module.scss';

export const HeaderList = () => {
  const [open, setOpen] = useState(false);
  const { headers, selectedHeader } = useHeaderTweakerContext();

  return (
    <div className={css.root}>
      <table>
        <colgroup>
          <col className={css.headerSwitch} />
          <col className={css.headerName} />
          <col className={css.headerValue} />
          <col className={css.headerActions} />
        </colgroup>
        <thead>
          <tr>
            <th />
            <th>Header key</th>
            <th>Header value</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {!headers.length ? (
            <tr>
              <td colSpan={4} className={css.notFound}>
                No headers to display yet
              </td>
            </tr>
          ) : (
            headers.map((header) => (
              <HeaderItem key={`header-${header.name}`} openDrawer={setOpen} {...header} />
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
