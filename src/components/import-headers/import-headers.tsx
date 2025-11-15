import { useCallback, useRef, useState } from 'react';
import { Success } from '@components/feedback/success';
import { Text } from '@components/text/text';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import { getHeaders } from '@helpers/header.helper';
import type { Header } from '@interfaces/index';
import classnames from 'clsx';

import css from './import-headers.module.scss';

export const ImportHeaders = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [importedHeaders, setImportedHeaders] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const { importHeaders } = useHeaderTweakerContext();

  const handleDrag = useCallback((e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (!file) return;
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const currentHeaders = await getHeaders();
      try {
        const data = JSON.parse(e.target?.result as string);

        if (Array.isArray(data?.headers)) {
          const validHeaders = (data.headers as Header[])
            .filter(
              ({ id, name, value, enabled }) => id && name && value && typeof enabled === 'boolean'
            )
            .filter(
              ({ name }) => !currentHeaders.some((existingHeader) => existingHeader.name === name)
            );
          validHeaders.forEach(console.log);
          setImportedHeaders(validHeaders.length);
          await importHeaders(validHeaders);
        }
      } catch (error) {
        console.error('Error importing headers:', error);
      }
    };
    reader.readAsText(file);
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
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
              handleFiles(e.dataTransfer.files);
            }
          }
        }}
        aria-label="File upload form"
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
            {dragActive
              ? 'Drop your file here...'
              : 'Drag & drop a HeaderTweaker export file here, or click to select'}
          </Text>
        </button>
      </form>
      <Success
        isOpen={importedHeaders > 0}
        title="Headers imported"
        message={`${importedHeaders} headers are successfully imported.`}
        onConfirm={() => window.close()}
        onClose={() => setImportedHeaders(0)}
      />
    </>
  );
};
