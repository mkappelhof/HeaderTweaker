export type Header = {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
  urls?: string[];
  label?: string;
};

export type Status = 'enabled' | 'disabled';
