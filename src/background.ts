// Keep in sync with STATUS_KEY in headertweaker.helper.ts
const STATUS_KEY = 'isDisabled';

type Header = { name: string; value: string; enabled: boolean };

// chrome.storage works in both Firefox (MV2) and Chrome (MV3)
const getStatus = async (): Promise<'enabled' | 'disabled'> => {
  const result = await chrome.storage.local.get(STATUS_KEY);
  return result[STATUS_KEY] ? 'disabled' : 'enabled';
};

const getHeaders = async (): Promise<Header[]> => {
  const result = await chrome.storage.local.get('headers');
  return result.headers || [];
};

if (__BROWSER__ === 'chrome') {
  // Chrome MV3: use declarativeNetRequest to modify outgoing request headers
  const { ResourceType } = chrome.declarativeNetRequest;
  const ALL_RESOURCE_TYPES: chrome.declarativeNetRequest.ResourceType[] = [
    ResourceType.MAIN_FRAME,
    ResourceType.SUB_FRAME,
    ResourceType.STYLESHEET,
    ResourceType.SCRIPT,
    ResourceType.IMAGE,
    ResourceType.FONT,
    ResourceType.OBJECT,
    ResourceType.XMLHTTPREQUEST,
    ResourceType.PING,
    ResourceType.CSP_REPORT,
    ResourceType.MEDIA,
    ResourceType.WEBSOCKET,
    ResourceType.OTHER,
  ];

  const updateRules = async () => {
    const isEnabled = await getStatus();
    const headers = await getHeaders();

    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const removeRuleIds = existingRules.map((rule) => rule.id);
    const addRules: chrome.declarativeNetRequest.Rule[] = [];

    if (isEnabled === 'enabled') {
      const enabledHeaders = headers.filter(({ enabled }) => enabled);
      enabledHeaders.forEach(({ name, value }, index) => {
        addRules.push({
          id: index + 1,
          priority: 1,
          action: {
            type: 'modifyHeaders',
            requestHeaders: [{ header: name, operation: 'set', value }],
          },
          condition: {
            resourceTypes: ALL_RESOURCE_TYPES,
          },
        });
      });
    }

    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
  };

  chrome.runtime.onInstalled.addListener(updateRules);
  chrome.runtime.onStartup.addListener(updateRules);
  chrome.storage.onChanged.addListener(() => {
    updateRules();
  });
} else {
  // Firefox MV2: use blocking webRequest to modify outgoing request headers
  const onBeforeSendHeaders = async (
    details: browser.webRequest._OnBeforeSendHeadersDetails
  ): Promise<browser.webRequest.BlockingResponse> => {
    const isEnabled = await getStatus();

    if (isEnabled === 'enabled') {
      const headers = await getHeaders();
      if (!headers.length || !details.requestHeaders) return {};

      const enabledHeaders = headers.filter(({ enabled }) => enabled);
      if (!enabledHeaders.length) return {};

      const requestHeaders = details.requestHeaders.slice();
      enabledHeaders.forEach(({ name, value }) => {
        for (let i = requestHeaders.length - 1; i >= 0; i--) {
          if (requestHeaders[i].name.toLowerCase() === name.toLowerCase()) {
            requestHeaders.splice(i, 1);
          }
        }
        requestHeaders.push({ name, value });
      });

      return { requestHeaders };
    }

    return {};
  };

  browser.webRequest.onBeforeSendHeaders.addListener(
    onBeforeSendHeaders,
    { urls: ['<all_urls>'] },
    ['blocking', 'requestHeaders']
  );
}
