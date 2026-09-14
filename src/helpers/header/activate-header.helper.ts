import { getSelectedHeader } from '@helpers/header/get-selected-header.helper';
import { saveHeaders } from '@helpers/header/save-headers.helper';
import type { Header } from '@interfaces/index';

export const activateHeader = async (header: Header, isActive: boolean) => {
  const { pos, headers, selectedHeader } = await getSelectedHeader(header);
  if (selectedHeader) {
    headers[pos] = { ...selectedHeader, enabled: isActive };
    await saveHeaders(headers);
    return headers[pos];
  }
};
