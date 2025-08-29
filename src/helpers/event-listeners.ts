import type { Header, RenderFn } from '../types';
import {
  byId,
  closePanel,
  escapeHTML,
  getHeaders,
  removeHeader,
  replaceSpacesWithDash,
  setHeaders,
  setPanelContent,
  updateHeader,
} from './helpers';

// Handles opening a new window when clicking "Import headers" button
const openImportWindow = () => {
  const width = 800;
  const height = 500;
  const left = window.screen.availWidth - width - 100;
  const top = 100;
  window.open(
    `${window.location.pathname}?import=true`,
    'headertweaker',
    `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes`
  );
};

// Handles exporting existing headers
const exportExistingHeaders = async () => {
  const headers = await getHeaders();
  const exportData = {
    name: 'HeaderTweaker export',
    headers: headers,
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'headertweaker-export.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Handle importing new headers
const handleHeaderImport = (render: RenderFn) => {
  const fileInput = byId<HTMLInputElement>('import-json-file');
  if (fileInput?.files?.length) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data?.headers)) {
          await setHeaders(data.headers, render);
          alert('Headers imported successfully');
          window.close();
        }
      } catch (error) {
        console.error('Error importing headers:', error);
      }
    };
    reader.readAsText(file);
  }
};

// Handles changes in the header key input
export const handleHeaderKeyChange = () => {
  const headerKey = byId<HTMLInputElement>('header-key');
  if (headerKey) {
    const newKey = replaceSpacesWithDash(headerKey.value);
    headerKey.value = newKey;
  }
};

export const toggleEnableHeader = (header: Header, index: number, callback: RenderFn) =>
  updateHeader({ ...header, enabled: !header.enabled }, index, callback);

// Handles clicks on an edit button of a specific header and populates the input field values.
export const openEditHeaderPanel = async (index: number, render: RenderFn) => {
  const headers = await getHeaders();
  const selectedHeader = headers[Number(index)];

  setPanelContent({
    title: 'Edit header',
    elements: [
      {
        element: 'input',
        attributes: {
          type: 'hidden',
          id: 'header-index-to-edit',
          value: index.toString(),
        },
      },
      {
        element: 'label',
        attributes: {
          for: 'edit-header-active',
          class: 'toggle',
        },
        content: `
          <span>
            <input type="checkbox" id="edit-header-active" class="toggle" ${selectedHeader.enabled ? 'checked' : ''} />
            <span class="slider"></span>
          </span>
          <span id="edit-header-active-label">Header is active</span>
        `,
        listenTo: { change: changeHeaderEnabledLabel },
      },
      {
        element: 'input',
        attributes: {
          type: 'text',
          id: 'edit-header-key',
          placeholder: 'Header key',
          value: selectedHeader.name,
        },
      },
      {
        element: 'input',
        attributes: {
          type: 'text',
          id: 'edit-header-value',
          placeholder: 'Header value',
          value: selectedHeader.value,
        },
      },
      {
        element: 'button',
        attributes: {
          id: 'save-header-button',
        },
        content: 'Save',
        listenTo: { click: saveEditedHeader.bind(null, render) },
      },
    ],
  });
};

// Handles a click on the "Save header" button in the edit panel
export const saveEditedHeader = async (render: RenderFn) => {
  const index = Number(byId<HTMLInputElement>('header-index-to-edit')?.value);
  const updatedHeaderActive = byId<HTMLInputElement>('edit-header-active')?.checked;
  const updatedHeaderKey = escapeHTML(byId<HTMLInputElement>('edit-header-key')?.value.trim());
  const updatesHeaderValue = escapeHTML(byId<HTMLInputElement>('edit-header-value')?.value.trim());

  await updateHeader(
    {
      name: updatedHeaderKey,
      value: updatesHeaderValue,
      enabled: updatedHeaderActive === true,
    },
    index,
    render
  );

  closePanel();
};

// Handles a change in the "Active" toggle in the edit panel
export const changeHeaderEnabledLabel = () => {
  const labelElement = byId<HTMLSpanElement>('edit-header-active-label');
  if (labelElement) {
    labelElement.textContent = byId<HTMLInputElement>('edit-header-active')?.checked
      ? 'Header is active'
      : 'Header is disabled';
  }
};

// Handles removal of a header
export const removeSelectedHeader = async (index: number, render: RenderFn) => {
  if (window.confirm('Are you sure you want to delete this header?')) {
    await removeHeader(index, render);
  }
};

// Handles panel content on header import popup
export const showHeaderImportPanel = (render: RenderFn) => {
  setPanelContent({
    title: 'Import headers',
    elements: [
      {
        element: 'input',
        attributes: {
          type: 'file',
          id: 'import-json-file',
          accept: 'application/json',
        },
        listenTo: { change: handleHeaderImport.bind(null, render) },
      },
    ],
  });
};

// Handles opening the settings panel
export const openSettingsPanel = () => {
  setPanelContent({
    title: 'Settings',
    elements: [
      {
        element: 'button',
        content: 'Import new headers',
        listenTo: { click: openImportWindow },
      },
      {
        element: 'button',
        content: 'Export current headers',
        listenTo: { click: exportExistingHeaders },
      },
    ],
  });
};
