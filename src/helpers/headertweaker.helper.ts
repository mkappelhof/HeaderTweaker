import { isFirefox, storage } from '@constants/index';
import type { Status } from '@interfaces/index';

const STATUS_KEY = 'isDisabled';

export const setStatus = async (status: Status) => {
  if (isFirefox) {
    await storage.local.set({ [STATUS_KEY]: status === 'disabled' });
  } else {
    storage.local.set({ [STATUS_KEY]: status === 'disabled' });
  }

  return status;
};

export const getStatus = async (): Promise<Status> => {
  const result = await storage.local.get(STATUS_KEY);
  return result[STATUS_KEY] ?? 'enabled';
};

export const isDisabledGlobally = async () => {
  const status = await getStatus();
  return status === 'disabled';
};
