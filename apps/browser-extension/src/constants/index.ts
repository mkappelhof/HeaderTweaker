export const isFirefox = typeof browser !== 'undefined';
export const storage = isFirefox ? browser.storage : chrome.storage;
export const webRequest = isFirefox ? browser.webRequest : chrome.webRequest;
export const tabs = isFirefox ? browser.tabs : chrome.tabs;

export const IMPORT_PARAM = 'import';
