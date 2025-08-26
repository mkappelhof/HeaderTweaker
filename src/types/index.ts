export type Header = { name: string; value: string; enabled: boolean };

export type RenderFn = () => Promise<void>;
export interface EditHeaderButtonElement extends HTMLElement {
  dataset: {
    index: string;
  };
}
