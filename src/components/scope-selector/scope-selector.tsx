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

import css from './scope-selector.module.scss';

export type ScopeSelectorProps = {
  urls: string[];
  onChange: (urls: string[]) => void;
};

export const ScopeSelector: FC<ScopeSelectorProps> = ({ urls, onChange }) => {
  const { t } = useTranslation();
  const { headers } = useHeaderTweakerContext();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const knownUrls = getKnownUrls(headers);
  const duplicateIndexes = getDuplicateUrlIndexes(urls);
  const hasEmptyUrl = urls.some((url) => !url.trim());

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
    if (hasEmptyUrl) return;

    setFocusedIndex(urls.length);
    onChange([...urls, '']);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    if (duplicateIndexes.includes(index) || !urls[index]?.trim()) return;

    addUrl();
  };

  return (
    <div className={css.root}>
      <Text as="span" variant="body-small">
        {t('label.scope.selector')}
      </Text>

      {urls.map((url, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: order is stable, no reordering
        <div key={`url-selector-${index}`} className={css.entry}>
          <div className={css.row}>
            <Select
              allowCreate
              value={url}
              options={getOptions(index)}
              placeholder={t('placeholder.scope.url.select')}
              createLabel={t('label.scope.addNewUrl')}
              createPlaceholder={t('placeholder.scope.url.add')}
              createInputType="url"
              autoFocus={focusedIndex === index}
              onChange={(value) =>
                onChange(urls.map((current, i) => (i === index ? value : current)))
              }
              onInputKeyDown={(event) => handleKeyDown(event, index)}
            />
            <IconButton
              aria-label={t('a11y.ariaLabel.scope.remove')}
              onClick={() => onChange(urls.filter((_, i) => i !== index))}
            >
              <XMarkIcon />
            </IconButton>
          </div>
          {duplicateIndexes.includes(index) && (
            <Text as="span" variant="body-small" className={css.error}>
              {t('feedback.error.url.exists')}
            </Text>
          )}
        </div>
      ))}

      <Button variant="ghost" disabled={hasEmptyUrl} onClick={addUrl}>
        <PlusIcon />
        <Text as="span">{t('button.scope.addUrl')}</Text>
      </Button>
    </div>
  );
};
