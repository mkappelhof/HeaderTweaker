declare const __BROWSER__: 'firefox' | 'chrome';

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}
