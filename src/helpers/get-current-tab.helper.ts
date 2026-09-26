import { tabs } from '@constants/index';

export type CurrentUrl = {
  currentUrl?: string;
  currentHost?: string;
};

const getHost = (url?: string) => {
  if (!url) return undefined;

  try {
    return new URL(url).host.replace(/^www\./i, '');
  } catch {
    return undefined;
  }
};

export const getCurrentTabUrl = async (): Promise<CurrentUrl> => {
  const [activeTab] = await tabs.query({ active: true, currentWindow: true });
  const currentUrl = activeTab?.url;

  return { currentUrl, currentHost: getHost(currentUrl) };
};
