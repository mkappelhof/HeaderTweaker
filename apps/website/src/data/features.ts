export type Feature = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  reverse: boolean;
};

export const FEATURES: Feature[] = [
  {
    eyebrow: 'Header rules',
    title: 'Add a header. Aim it at the URLs that need it.',
    description:
      'Give every header a key, a value and an optional label. Leave it global, or add as many target URLs as you like — including the page you’re on right now.',
    image: 'edit-header.png',
    alt: 'The Edit header panel with key, value, optional label and a list of target URLs',
    reverse: false,
  },
  {
    eyebrow: 'Bulk URL targets',
    title: 'Retarget a whole set of headers in two steps.',
    description:
      'Moving from staging to production? Pick the headers, choose the URLs, save. No editing them one by one.',
    image: 'bulk-url-targets.png',
    alt: 'The Bulk URL target change dialog, step 1: three of four headers selected',
    reverse: true,
  },
  {
    eyebrow: 'All · Global · Current',
    title: 'See exactly what hits the page you’re on.',
    description:
      'Switch between All, Global and Current to filter your list. Headers that apply everywhere are flagged, so nothing leaks to sites you didn’t mean to.',
    image: 'global-tab.png',
    alt: 'The Global tab showing one header with a notice that global headers apply to all requests',
    reverse: false,
  },
  {
    eyebrow: 'Settings',
    title: 'Take your setup anywhere. Pause it in one click.',
    description:
      'Export your headers to a JSON file and import them on another machine or share them with your team. One master switch pauses every modification without losing a rule.',
    image: 'settings-panel.png',
    alt: 'The Settings panel with the master switch, a Use labels toggle and Import and Export buttons',
    reverse: true,
  },
];
