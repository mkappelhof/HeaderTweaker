import { tabs } from '@constants/index';

export const getCurrentTabUrl = async (): Promise<string | undefined> => {
  const [activeTab] = await tabs.query({ active: true, currentWindow: true });
  return activeTab?.url;
};
