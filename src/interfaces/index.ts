export type Header = { id: string; name: string; value: string; enabled: boolean };

export type RenderFn = () => Promise<void>;

export type PanelElement = {
  element: string;
  content?: string;
  attributes?: Record<string, string>;
  listenTo?: Record<string, (event: Event) => void>;
};
