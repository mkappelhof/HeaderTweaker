import { type ChangeEvent, type FC, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@components/button/button';
import { TextInput } from '@components/input/text-input';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { cleanupHeaderKey } from '@helpers/validation.helper';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import type { Header } from '@interfaces/index';
import { useTranslation } from 'react-i18next';

import css from './app.module.scss';

type AppFooterProps = Record<never, never>;

export const AppFooter: FC<AppFooterProps> = () => {
  const { t } = useTranslation();
  const [header, setHeader] = useState<Header>();
  const [disabledButton, setDisabledButton] = useState(true);
  const headerKeyRef = useRef<HTMLInputElement>(null);
  const { isDisabled, updateHeader } = useHeaderTweakerContext();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;

    setHeader((prev) => {
      const headerKey =
        target.getAttribute('data-type') === 'name' ? target.value : prev?.name || '';
      const headerValue =
        target.getAttribute('data-type') === 'value' ? target.value : prev?.value || '';
      return { id: '', name: headerKey, value: headerValue, enabled: false };
    });
  };

  const validateHeaderKey = () => {
    const headerKey = cleanupHeaderKey(header?.name || '');

    setHeader((prev) => ({
      ...prev,
      id: prev?.id ?? '',
      name: headerKey,
      value: prev?.value ?? '',
      enabled: false,
    }));
  };

  useEffect(
    () => setDisabledButton(!(header?.name && header?.value)),
    [header?.name, header?.value]
  );

  const addHeader = async () => {
    if (header) {
      await updateHeader({ header, action: 'add' });
      setHeader(undefined);
      headerKeyRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isDisabled && !disabledButton) {
      addHeader();
    }
  };

  return (
    <footer className={css.footer}>
      <div className={css.inputWrapper}>
        <TextInput
          ref={headerKeyRef}
          disabled={isDisabled}
          placeholder={t('placeholder.header.create.key')}
          data-type="name"
          value={header?.name ?? ''}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={validateHeaderKey}
        />
      </div>
      <div className={css.inputWrapper}>
        <TextInput
          disabled={isDisabled}
          placeholder={t('placeholder.header.create.value')}
          data-type="value"
          value={header?.value ?? ''}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button disabled={isDisabled || disabledButton} onClick={addHeader}>
        <PlusCircleIcon />
        {t('button.header.add')}
      </Button>
    </footer>
  );
};
