import { useCallback, useRef, useState } from 'react';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';
import type { Header } from '@interfaces/index';
import classnames from 'clsx';

import css from './import-headers.module.scss';

export const ImportHeaders = () => {
  const inputRef = useRef<HTMLInputElement>(null);
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
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data?.headers)) {
          const validHeaders = (data.headers as Header[]).filter(
            (header) =>
              header.id && header.name && header.value && typeof header.enabled === 'boolean'
          );
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
        <span>
          {dragActive
            ? 'Drop your file here...'
            : 'Drag & drop a HeaderTweaker export file here, or click to select'}
        </span>
      </button>
    </form>
  );
};
