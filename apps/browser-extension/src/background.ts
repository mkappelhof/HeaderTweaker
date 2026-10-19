// Keep in sync with STATUS_KEY in headertweaker.helper.ts
import { countAppliedHeaders } from '@helpers/header/count-applied-headers.helper';
import { createChromeUrlRestriction } from '@helpers/scope/chrome-url-restriction.helper';
import { matchUrlRestriction } from '@helpers/scope/match-url-restriction.helper';
import { isLocalhostUrl } from '@helpers/url/is-localhost-url.helper';

type Header = { name: string; value: string; enabled: boolean; urls?: string[] };

type BadgeAction = {
  setBadgeText: (details: { text: string; tabId?: number }) => Promise<void> | void;
  setBadgeBackgroundColor: (details: { color: string; tabId?: number }) => Promise<void> | void;
  setBadgeTextColor?: (details: { color: string; tabId?: number }) => Promise<void> | void;
};

const STATUS_KEY = 'isDisabled';
const BADGE_COLOR_ACTIVE = '#00D27C';
const BADGE_COLOR_INACTIVE = '#9B9DB1';
// Scopes are always overridden for localhost requests.
const LOCALHOST_URL_REGEX_FILTER =
  '^https?://(?:(?:[a-z0-9-]+\\.)*localhost|127\\.0\\.0\\.1|\\[::1\\])(?::\\d+)?(?:[/?#].*)?$';

const tabsApi = __BROWSER__ === 'firefox' ? browser.tabs : chrome.tabs;
const runtimeApi = __BROWSER__ === 'firefox' ? browser.runtime : chrome.runtime;
const storageApi = __BROWSER__ === 'firefox' ? browser.storage : chrome.storage;
const badgeAction: BadgeAction = __BROWSER__ === 'firefox' ? browser.browserAction : chrome.action;

const storageLocal = __BROWSER__ === 'firefox' ? browser.storage.local : chrome.storage.local;

const getStatus = async (): Promise<'enabled' | 'disabled'> => {
  const result = await storageLocal.get(STATUS_KEY);
  return result[STATUS_KEY] ? 'disabled' : 'enabled';
};

const getHeaders = async (): Promise<Header[]> => {
  const result = await storageLocal.get('headers');
  return (result.headers as Header[]) || [];
};

const isString = (value: string | null): value is string => value !== null;

const updateBadge = async (tabId: number, url?: string) => {
  const isEnabled = await getStatus();
  const headers = isEnabled === 'enabled' ? await getHeaders() : [];
  const count = countAppliedHeaders(headers, url);

  await badgeAction.setBadgeText({ text: String(count), tabId });
  await badgeAction.setBadgeBackgroundColor({
    color: count > 0 ? BADGE_COLOR_ACTIVE : BADGE_COLOR_INACTIVE,
    tabId,
  });
  await badgeAction.setBadgeTextColor?.({ color: '#ffffff', tabId });
};

const updateAllBadges = async () => {
  const allTabs = await tabsApi.query({});
  await Promise.all(
    allTabs.map((tab) => (tab.id === undefined ? undefined : updateBadge(tab.id, tab.url)))
  );
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
      let ruleId = 1;
      enabledHeaders.forEach(({ name, value, urls }) => {
        const hasUrlRestrictions = Boolean(urls?.length);
        const urlRestrictions = urls?.map(createChromeUrlRestriction).filter(isString) ?? [];
        if (hasUrlRestrictions) {
          urlRestrictions.forEach((regexFilter) => {
            addRules.push({
              id: ruleId++,
              priority: 1,
              action: {
                type: 'modifyHeaders',
                requestHeaders: [{ header: name, operation: 'set', value }],
              },
              condition: {
                regexFilter,
                resourceTypes: ALL_RESOURCE_TYPES,
              },
            });
          });
          addRules.push({
            id: ruleId++,
            priority: 1,
            action: {
              type: 'modifyHeaders',
              requestHeaders: [{ header: name, operation: 'set', value }],
            },
            condition: {
              regexFilter: LOCALHOST_URL_REGEX_FILTER,
              resourceTypes: ALL_RESOURCE_TYPES,
            },
          });
        } else {
          addRules.push({
            id: ruleId++,
            priority: 1,
            action: {
              type: 'modifyHeaders',
              requestHeaders: [{ header: name, operation: 'set', value }],
            },
            condition: {
              resourceTypes: ALL_RESOURCE_TYPES,
            },
          });
        }
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
      enabledHeaders.forEach(({ name, value, urls }) => {
        if (
          urls &&
          urls.length > 0 &&
          !isLocalhostUrl(details.url) &&
          !urls.some((url) => matchUrlRestriction(details.url, url))
        ) {
          return;
        }
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

tabsApi.onUpdated.addListener((tabId, _changeInfo, tab) => {
  updateBadge(tabId, tab.url);
});

tabsApi.onActivated.addListener(async ({ tabId }) => {
  const tab = await tabsApi.get(tabId);
  updateBadge(tabId, tab.url);
});

storageApi.onChanged.addListener(() => {
  updateAllBadges();
});

runtimeApi.onInstalled.addListener(() => {
  updateAllBadges();
});
runtimeApi.onStartup.addListener(() => {
  updateAllBadges();
});

updateAllBadges();
