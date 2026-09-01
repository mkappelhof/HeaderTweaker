import { type ChangeEvent, type FC, useState } from 'react';
import { Button } from '@components/button/button';
import { TextInput } from '@components/input/text-input';
import { ScopeSelector } from '@components/scope-selector/scope-selector';
import { Switch } from '@components/switch/switch';
import { Text } from '@components/text/text';
import { ToastItem } from '@components/toast/toast-item';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { useToastContext } from '@contexts/toast.context';
import { getDuplicateUrlIndexes } from '@helpers/scope/get-duplicate-url.helper';
import { cleanupHeaderKey } from '@helpers/validation.helper';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { Header } from '@interfaces/index';
import { useTranslation } from 'react-i18next';

import css from './edit-header.module.scss';

type EditHeaderProps = {
  closePanel: () => void;
};

export const EditHeader: FC<EditHeaderProps> = ({ closePanel }) => {
  const { t } = useTranslation();
  const { addToast } = useToastContext();
  const { updateHeader, selectedHeader, useLabels, setUseLabels } = useHeaderTweakerContext();
  const [header, setHeader] = useState<Header | null>(selectedHeader);

  const hasDuplicateUrls = getDuplicateUrlIndexes(header?.urls ?? []).length > 0;

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

  if (!header) return null;

  return (
    <div className={css.root}>
      <Switch
        isOn={header.enabled}
        label={t(header.enabled ? 'label.status.enabledHeader' : 'label.status.disabledHeader')}
        onChange={(state) => setHeader((prev) => prev && { ...prev, enabled: state })}
      />

      <TextInput
        value={header.name}
        data-type="name"
        onChange={handleInputChange}
        onBlur={validateHeaderKey}
      />

      <TextInput value={header.value} data-type="value" onChange={handleInputChange} />

      <TextInput
        placeholder={t('placeholder.header.label')}
        value={header.label ?? ''}
        data-type="label"
        onChange={handleInputChange}
      />

      <ScopeSelector
        urls={header.urls ?? []}
        onChange={(urls) => setHeader((prev) => prev && { ...prev, urls })}
      />

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

          addToast(
            <ToastItem
              isCloseable
              variant="positive"
              message={t('feedback.success.header.update')}
            />
          );

          closePanel();
        }}
      >
        <CheckCircleIcon />
        <Text as="span">{t('button.header.save')}</Text>
      </Button>
    </div>
  );
};
