import { getHeaders } from '@helpers/header/get-headers.helper';
import type { Header } from '@interfaces/index';

export const getSelectedHeader = async (header: Header) => {
  const headers = await getHeaders();
  return {
    headers,
    pos: headers.findIndex(({ id }) => id === header.id),
    selectedHeader: headers.find(({ id }) => id === header.id),
  };
};
