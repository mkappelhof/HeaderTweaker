export type Permission = {
  name: string;
  where: string;
  why: string;
};

export const PERMISSIONS: Permission[] = [
  {
    name: 'storage',
    where: 'Firefox & Chrome',
    why: 'Keeps your header rules and settings locally in the browser.',
  },
  {
    name: 'webRequest + webRequestBlocking',
    where: 'Firefox',
    why: 'Modifies outgoing request headers before they’re sent.',
  },
  {
    name: 'declarativeNetRequestWithHostAccess',
    where: 'Chrome',
    why: 'Lets Chrome apply the rules without the extension reading request contents.',
  },
  {
    name: '<all_urls>',
    where: 'Firefox & Chrome',
    why: 'Lets rules target any site. Rules only run on requests that match your URL targets — except localhost, which every rule always matches.',
  },
];
