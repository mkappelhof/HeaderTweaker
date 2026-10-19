import { storage } from '@constants/index';
import type { Header } from '@interfaces/index';

export const saveHeaders = async (headers: Header[]) => storage.local.set({ headers });
