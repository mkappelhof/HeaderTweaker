export const isFirefox = typeof browser !== 'undefined';
export const storage = isFirefox ? browser.storage : chrome.storage;
