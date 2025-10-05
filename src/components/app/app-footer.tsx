import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Button } from '@components/button/button';
import { Input } from '@components/input/input';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { cleanupHeaderKey } from '@helpers/validation.helper';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import type { Header } from '@interfaces/index';

import css from './app.module.scss';

export const AppFooter = () => {
  const [header, setHeader] = useState<Header>();
  const [disabledButton, setDisabledButton] = useState(true);
  const { isDisabled, updateHeader } = useHeaderTweakerContext();

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;

    setHeader((prev) => {
      const headerKey =
        target.getAttribute('data-type') === 'name' ? target.value : prev?.name || '';
      const headerValue =
        target.getAttribute('data-type') === 'value' ? target.value : prev?.value || '';
      return { id: '', name: headerKey, value: headerValue, enabled: false };
    });
  }, []);

  const validateHeaderKey = useCallback(() => {
    const headerKey = cleanupHeaderKey(header?.name || '');

    setHeader((prev) => ({
      ...prev,
      id: prev?.id ?? '',
      name: headerKey,
      value: prev?.value ?? '',
      enabled: false,
    }));
  }, [header?.name]);

  useEffect(
    () => setDisabledButton(!(header?.name && header?.value)),
    [header?.name, header?.value]
  );

  return (
    <footer className={css.footer}>
      <div className={css.inputWrapper}>
        <Input
          type="text"
          disabled={isDisabled}
          placeholder="Header key"
          data-type="name"
          value={header?.name ?? ''}
          onChange={handleInputChange}
          onBlur={validateHeaderKey}
        />
      </div>
      <div className={css.inputWrapper}>
        <Input
          type="text"
          disabled={isDisabled}
          placeholder="Header value"
          data-type="value"
          value={header?.value ?? ''}
          onChange={handleInputChange}
        />
      </div>
      <Button
        disabled={isDisabled || disabledButton}
        onClick={async () => {
          if (header) {
            await updateHeader({ header, action: 'add' });
            setHeader(undefined);
          }
        }}
      >
        <PlusCircleIcon />
        Add header
      </Button>
    </footer>
  );
};
