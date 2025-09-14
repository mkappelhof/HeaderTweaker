import { type ChangeEvent, useCallback, useState } from 'react';
import { Button } from '@components/button/button';
import { Input } from '@components/input/input';
import { Switch } from '@components/switch/switch';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { cleanupHeaderKey } from '@helpers/validation.helper';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { Header } from '@interfaces/index';

import css from './edit-header.module.scss';

interface EditHeaderProps {
  closePanel: () => void;
}

export const EditHeader = ({ closePanel }: EditHeaderProps) => {
  const { updateHeader, selectedHeader } = useHeaderTweakerContext();
  const [header, setHeader] = useState<Header | null>(selectedHeader);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;

    setHeader((prev) => {
      const headerKey =
        target.getAttribute('data-type') === 'name' ? target.value : prev?.name || '';
      const headerValue =
        target.getAttribute('data-type') === 'value' ? target.value : prev?.value || '';
      return { id: prev?.id ?? '', name: headerKey, value: headerValue, enabled: false };
    });
  }, []);

  const validateHeaderKey = useCallback(() => {
    const headerKey = cleanupHeaderKey(header?.name || '');

    setHeader((prev) => ({
      ...prev,
      id: prev?.id ?? '',
      name: headerKey,
      value: prev?.value ?? '',
      enabled: prev?.enabled ?? false,
    }));
  }, [header?.name]);

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

      <Button
        onClick={async () => {
          await updateHeader({ header, action: 'update' });
          closePanel();
        }}
      >
        <CheckCircleIcon />
        Save header
      </Button>
    </div>
  );
};
