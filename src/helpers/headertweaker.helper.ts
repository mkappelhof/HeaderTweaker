import { storage } from '@constants/index';

const STATUS_KEY = 'isDisabled';

export const setStatus = async (status: string) => {
  await storage.local.set({ [STATUS_KEY]: status === 'disabled' });
  return status;
};

export const getStatus = async (): Promise<string> => {
  const result = await storage.local.get(STATUS_KEY);
  return result[STATUS_KEY] ? 'disabled' : 'enabled';
};

export const isDisabledGlobally = async () => {
  const status = await getStatus();
  return status === 'disabled';
};
