import { type ChangeEvent, useState } from 'react';
import { Button } from '@components/button/button';
import { IconButton } from '@components/button/icon-button';
import { Input } from '@components/input/input';
import { Switch } from '@components/switch/switch';
import { Text } from '@components/text/text';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { cleanupHeaderKey } from '@helpers/validation.helper';
import { CheckCircleIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { Header } from '@interfaces/index';

import css from './edit-header.module.scss';

interface EditHeaderProps {
  closePanel: () => void;
}

export const EditHeader = ({ closePanel }: EditHeaderProps) => {
  const { updateHeader, selectedHeader } = useHeaderTweakerContext();
  const [header, setHeader] = useState<Header | null>(selectedHeader);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;

    setHeader((prev) => {
      const headerKey =
        target.getAttribute('data-type') === 'name' ? target.value : prev?.name || '';
      const headerValue =
        target.getAttribute('data-type') === 'value' ? target.value : prev?.value || '';
      return {
        id: prev?.id ?? '',
        name: headerKey,
        value: headerValue,
        enabled: prev?.enabled ?? false,
        urls: prev?.urls,
      };
    });
  };

  const validateHeaderKey = () => {
    const headerKey = cleanupHeaderKey(header?.name || '');

    setHeader((prev) => ({
      ...prev,
      id: prev?.id ?? '',
      name: headerKey,
      value: prev?.value ?? '',
      enabled: prev?.enabled ?? false,
    }));
  };

  const handleUrlChange = (index: number, value: string) => {
    setHeader((prev) => {
      if (!prev) return prev;
      const urls = [...(prev.urls ?? [])];
      urls[index] = value;
      return { ...prev, urls };
    });
  };

  const addUrl = () => {
    setHeader((prev) => prev && { ...prev, urls: [...(prev.urls ?? []), ''] });
  };

  const removeUrl = (index: number) => {
    setHeader((prev) => {
      if (!prev) return prev;
      return { ...prev, urls: (prev.urls ?? []).filter((_, i) => i !== index) };
    });
  };

  if (!header) return null;

  return (
    <div className={css.root}>
      <Switch
        isOn={header.enabled}
        label={header.enabled ? 'Header is active' : 'Header is disabled'}
        onChange={(state) => setHeader((prev) => prev && { ...prev, enabled: state })}
      />

      <Input
        type="text"
        value={header.name}
        data-type="name"
        onChange={handleInputChange}
        onBlur={validateHeaderKey}
      />

      <Input type="text" value={header.value} data-type="value" onChange={handleInputChange} />

      <div className={css.urlSection}>
        <Text as="span" variant="body-small">
          URL restrictions
        </Text>
        {(header.urls ?? []).map((url, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: order is stable, no reordering
          <div key={index} className={css.urlRow}>
            <Input
              type="text"
              placeholder="https://example.com/*"
              value={url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
            />
            <IconButton aria-label="Remove URL" onClick={() => removeUrl(index)}>
              <XMarkIcon />
            </IconButton>
          </div>
        ))}
        <Button variant="ghost" onClick={addUrl}>
          <PlusIcon />
          <Text as="span">Add URL</Text>
        </Button>
      </div>

      <Button
        onClick={async () => {
          await updateHeader({
            header: { ...header, urls: header.urls?.filter((u) => u.trim() !== '') },
            action: 'update',
          });
          closePanel();
        }}
      >
        <CheckCircleIcon />
        <Text as="span">Save header</Text>
      </Button>
    </div>
  );
};
