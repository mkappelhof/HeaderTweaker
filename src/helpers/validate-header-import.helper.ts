import type { Header } from '@interfaces/index';
import { getHeaders } from './header/get-headers.helper';

type HeaderImportCallbacks = {
  onSuccess: (headers: Header[]) => void | Promise<void>;
  onError?: (error: Error) => void;
};

export const validateHeaderImport = (
  files: FileList,
  { onSuccess, onError }: HeaderImportCallbacks
) => {
  const file = files[0];
  if (!file) {
    onError?.(new Error('No file selected.'));
    return;
  }

  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    onError?.(new Error('Only JSON files can be imported.'));
    return;
  }

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const currentHeaders = await getHeaders();
      const data = JSON.parse(event.target?.result as string);

      if (!Array.isArray(data?.headers)) {
        throw new Error('The JSON file does not contain headers.');
      }

      const validHeaders = (data.headers as Header[])
        .filter(
          ({ id, name, value, enabled }) => id && name && value && typeof enabled === 'boolean'
        )
        .filter(
          ({ name }) => !currentHeaders.some((existingHeader) => existingHeader.name === name)
        );

      await onSuccess(validHeaders);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Unable to import headers.'));
    }
  };
  reader.onerror = () => onError?.(reader.error ?? new Error('Unable to read the selected file.'));
  reader.readAsText(file);
};
