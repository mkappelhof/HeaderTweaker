import { type ChangeEvent, type FC, type KeyboardEvent, useState } from 'react';
import { Button } from '@components/button/button';
import { IconButton } from '@components/button/icon-button';
import { Input } from '@components/input/input';
import { Switch } from '@components/switch/switch';
import { Text } from '@components/text/text';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { isDuplicateUrl, normalizeUrlRestriction } from '@helpers/scope.helper';
import { cleanupHeaderKey } from '@helpers/validation.helper';
import { CheckCircleIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { Header } from '@interfaces/index';

import css from './edit-header.module.scss';

type EditHeaderProps = {
  closePanel: () => void;
};

export const EditHeader: FC<EditHeaderProps> = ({ closePanel }) => {
  const { updateHeader, selectedHeader, useLabels, setUseLabels } = useHeaderTweakerContext();
  const [header, setHeader] = useState<Header | null>(selectedHeader);
  const [focusedUrlIndex, setFocusedUrlIndex] = useState<number | null>(null);
  const [duplicateUrlIndex, setDuplicateUrlIndex] = useState<number | null>(null);

  const hasDuplicateUrls = (() => {
    const urls = (header?.urls ?? []).map(normalizeUrlRestriction).filter(Boolean);
    return new Set(urls).size !== urls.length;
  })();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const type = target.getAttribute('data-type');

    setHeader((prev) => ({
      id: prev?.id ?? '',
      name: type === 'name' ? target.value : prev?.name || '',
      value: type === 'value' ? target.value : prev?.value || '',
      label: type === 'label' ? target.value : prev?.label,
      enabled: prev?.enabled ?? false,
      urls: prev?.urls,
    }));
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
    setDuplicateUrlIndex((currentIndex) => (currentIndex === index ? null : currentIndex));
    setHeader((prev) => {
      if (!prev) return prev;
      const urls = [...(prev.urls ?? [])];
      urls[index] = value;
      return { ...prev, urls };
    });
  };

  const addUrl = () => {
    setHeader((prev) => {
      if (!prev) return prev;

      const urls = [...(prev.urls ?? []), ''];
      setFocusedUrlIndex(urls.length - 1);
      return { ...prev, urls };
    });
  };

  const handleUrlKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    if (isDuplicateUrl(header, index)) {
      setDuplicateUrlIndex(index);
      return;
    }

    setDuplicateUrlIndex(null);
    addUrl();
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

      <Input
        type="text"
        placeholder="Label (optional)"
        value={header.label ?? ''}
        data-type="label"
        onChange={handleInputChange}
      />

      <div className={css.urlSection}>
        <Text as="span" variant="body-small">
          URL restrictions
        </Text>
        {(header.urls ?? []).map((url, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: order is stable, no reordering
          <div key={`edit-header-${index}`} className={css.urlEntry}>
            <div className={css.urlRow}>
              <Input
                type="text"
                placeholder="example.com"
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                onKeyDown={(event) => handleUrlKeyDown(event, index)}
                autoFocus={focusedUrlIndex === index}
                onFocus={() => setFocusedUrlIndex(null)}
              />
              <IconButton aria-label="Remove URL" onClick={() => removeUrl(index)}>
                <XMarkIcon />
              </IconButton>
            </div>
            {duplicateUrlIndex === index && (
              <Text as="span" variant="body-small" className={css.urlError}>
                This scope already exists
              </Text>
            )}
          </div>
        ))}
        <Button variant="ghost" onClick={addUrl}>
          <PlusIcon />
          <Text as="span">Add URL</Text>
        </Button>
      </div>

      <Button
        disabled={hasDuplicateUrls}
        onClick={async () => {
          if (hasDuplicateUrls) return;

          if (header.label?.trim() && !useLabels) {
            setUseLabels(true);
          }

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
