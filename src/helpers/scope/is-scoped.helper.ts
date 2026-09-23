import type { Header } from '@interfaces/index';

export const isScoped = (header: Header) => Boolean(header.urls?.length);
