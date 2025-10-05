import { getStatus } from '@helpers/headertweaker.helper';

const isFirefox = typeof browser !== 'undefined';
const webRequest = isFirefox ? browser.webRequest : chrome.webRequest;

type Header = { name: string; value: string; enabled: boolean };

type OnBeforeSendHeadersDetails<T> = T extends typeof browser.webRequest
  ? browser.webRequest._OnBeforeSendHeadersDetails
  : T extends typeof chrome.webRequest
    ? chrome.webRequest.OnBeforeSendHeadersDetails
    : never;

const getHeaders = async (): Promise<Header[]> => {
  const storage = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
  const result = await storage.local.get('headers');
  return result.headers || [];
};

// Listener to modify request headers
const onBeforeSendHeaders = async <D extends OnBeforeSendHeadersDetails<typeof webRequest>>(
  details: D
) => {
  const isEnabled = await getStatus();

  if (isEnabled) {
    const headers = (await getHeaders()) as Header[];
    if (!headers.length || !details.requestHeaders) return {} as D;

    // Only modify enabled headers
    const enabledHeaders = headers.filter(({ enabled }) => enabled);
    if (!enabledHeaders.length) return {} as D;

    // Clone and modify request headers
    const requestHeaders = details.requestHeaders.slice();
    enabledHeaders.forEach(({ name, value }) => {
      // Remove any existing header with the same name
      for (let i = requestHeaders.length - 1; i >= 0; i--) {
        if (requestHeaders[i].name.toLowerCase() === name.toLowerCase()) {
          requestHeaders.splice(i, 1);
        }
      }
      // Add new header
      requestHeaders.push({ name, value });
    });

    return { requestHeaders } as D;
  }
};

// Register the listener
webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders, { urls: ['<all_urls>'] }, [
  'blocking',
  'requestHeaders',
]);
