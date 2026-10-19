declare const __BROWSER__: 'firefox' | 'chrome';

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react';

  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
