export type Header = { name: string; value: string; enabled: boolean };

export interface EditHeaderButtonElement extends HTMLElement {
  dataset: {
    index: string;
  };
}
