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
    eyebrow: 'Header details',
    title: 'Add a header and choose which URLs it applies to',
    description:
      'Every header gets a key, a value and an optional label. Leave it global, or scope it to as many target URLs as you need — including the page you’re on right now.',
    image: 'edit-header.png',
    alt: 'The Edit header panel with key, value, optional label and a list of target URLs',
    reverse: false,
  },
  {
    eyebrow: 'Bulk URL targets',
    title: 'Change the URL targets for several headers at once',
    description:
      'Prevent your headers from being applied to every request you make, target multiple headers at once to specific URLs.',
    image: 'bulk-url-targets.png',
    alt: 'The Bulk URL target change dialog, step 1: three of four headers selected',
    reverse: true,
  },
  {
    eyebrow: 'All · Global · Current',
    title: 'Filter the header-list to see what applies where',
    description:
      'Switch between All, Global and Current. Headers that apply everywhere are flagged, so it’s clear what’s reaching sites you probably didn’t mean to target.',
    image: 'global-tab.png',
    alt: 'The Global tab showing one header with a notice that global headers apply to all requests',
    reverse: false,
  },
  {
    eyebrow: 'Settings',
    title: 'Export, import or pause your configuration',
    description:
      'Export your headers to a JSON file to move them to another browser or share them with your team. A single switch pauses every rule without deleting any of them.',
    image: 'settings-panel.png',
    alt: 'The Settings panel with the master switch, a Use labels toggle and Import and Export buttons',
    reverse: true,
  },
];
