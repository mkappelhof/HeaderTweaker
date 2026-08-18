import { type FC, type KeyboardEvent, useState } from 'react';
import { Button } from '@components/button/button';
import { IconButton } from '@components/button/icon-button';
import { Select } from '@components/select/select';
import { Text } from '@components/text/text';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import {
  getDuplicateUrlIndexes,
  getKnownUrls,
  normalizeUrlRestriction,
} from '@helpers/scope.helper';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

import css from './url-selector.module.scss';

export type UrlSelectorProps = {
  urls: string[];
  onChange: (urls: string[]) => void;
};

export const UrlSelector: FC<UrlSelectorProps> = ({ urls, onChange }) => {
  const { t } = useTranslation();
  const { headers } = useHeaderTweakerContext();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const knownUrls = getKnownUrls(headers);
  const duplicateIndexes = getDuplicateUrlIndexes(urls);

  const getOptions = (index: number) =>
    knownUrls
      .filter(
        (url) =>
          !urls.some(
            (value, i) =>
              i !== index && normalizeUrlRestriction(value) === normalizeUrlRestriction(url)
          )
      )
      .map((url) => ({ label: url, value: url }));

  const addUrl = () => {
    setFocusedIndex(urls.length);
    onChange([...urls, '']);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    if (duplicateIndexes.includes(index)) return;

    addUrl();
  };

  return (
    <div className={css.root}>
      <Text as="span" variant="body-small">
        {t('urlSelector.title')}
      </Text>

      {urls.map((url, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: order is stable, no reordering
        <div key={`url-selector-${index}`} className={css.entry}>
          <div className={css.row}>
            <Select
              allowCreate
              value={url}
              options={getOptions(index)}
              placeholder={t('urlSelector.placeholder')}
              createLabel={t('urlSelector.createLabel')}
              createPlaceholder={t('urlSelector.createPlaceholder')}
              autoFocus={focusedIndex === index}
              onChange={(value) =>
                onChange(urls.map((current, i) => (i === index ? value : current)))
              }
              onInputKeyDown={(event) => handleKeyDown(event, index)}
            />
            <IconButton
              aria-label={t('urlSelector.remove')}
              onClick={() => onChange(urls.filter((_, i) => i !== index))}
            >
              <XMarkIcon />
            </IconButton>
          </div>
          {duplicateIndexes.includes(index) && (
            <Text as="span" variant="body-small" className={css.error}>
              {t('urlSelector.duplicate')}
            </Text>
          )}
        </div>
      ))}

      <Button variant="ghost" onClick={addUrl}>
        <PlusIcon />
        <Text as="span">{t('urlSelector.add')}</Text>
      </Button>
    </div>
  );
};
