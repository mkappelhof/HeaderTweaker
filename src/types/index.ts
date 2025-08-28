export type Header = { name: string; value: string; enabled: boolean };

export type RenderFn = () => Promise<void>;
