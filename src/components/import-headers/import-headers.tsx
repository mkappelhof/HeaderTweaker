import { type FC, useRef, useState } from 'react';
import { Success } from '@components/feedback/success';
import { Text } from '@components/text/text';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { validateHeaderImport } from '@helpers/import.helper';
import classnames from 'clsx';
import { useTranslation } from 'react-i18next';

import css from './import-headers.module.scss';

type ImportHeadersProps = Record<never, never>;

export const ImportHeaders: FC<ImportHeadersProps> = () => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [importedHeaders, setImportedHeaders] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const { importHeaders } = useHeaderTweakerContext();

  const handleDrag = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleFiles = (files: FileList) => {
    validateHeaderImport(files, {
      onSuccess: async (headers) => {
        setImportedHeaders(headers.length);
        await importHeaders(headers);
      },
      onError: (error) => console.error('Error importing headers:', error),
    });
  };

  const onButtonClick = () => inputRef.current?.click();

  return (
    <>
      <form
        className={css.root}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={(e: React.DragEvent<HTMLFormElement>) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          if (e.dataTransfer.files?.[0]) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        aria-label={t('importHeaders.formLabel')}
        tabIndex={-1}
      >
        <button
          type="button"
          className={classnames(css.uploadButton, { [css.dragActive]: dragActive })}
          onClick={onButtonClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onButtonClick();
            }
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.[0]) {
                handleFiles(e.target.files);
              }
            }}
          />
          <Text as="span">
            {dragActive ? t('importHeaders.dropActive') : t('importHeaders.dropIdle')}
          </Text>
        </button>
      </form>
      <Success
        isOpen={importedHeaders > 0}
        title={t('importHeaders.successTitle')}
        message={t('importHeaders.successMessage', { count: importedHeaders })}
        onConfirm={() => window.close()}
        onClose={() => setImportedHeaders(0)}
      />
    </>
  );
};
