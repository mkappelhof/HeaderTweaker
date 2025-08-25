import '../styles/style.scss';
import type { EditHeaderButtonElement } from '../types';
import {
  byId,
  closePanel,
  escapeHTML,
  getHeaders,
  setHeaders,
  storage,
  updateHeader,
} from './helpers';

// Elements
const headerKeyInput = byId<HTMLInputElement>('header-key');
const headerValueInput = byId<HTMLInputElement>('header-value');
const addHeaderButton = byId<HTMLButtonElement>('add-header-button');
const headerList = byId('header-list');

// New header data
let headerKey: string | undefined, headerValue: string | undefined;

// Update the button disabled state based on input values
const updateButtonState = () => {
  headerKey = headerKeyInput?.value;
  headerValue = headerValueInput?.value;

  if (addHeaderButton) {
    addHeaderButton.disabled = !(headerKey && headerValue);
  }
};

headerKeyInput?.addEventListener('input', updateButtonState);
headerValueInput?.addEventListener('input', updateButtonState);

const render = async () => {
  const headers = await getHeaders();
  if (headerList) headerList.innerHTML = '';

  // Append headers to header row container
  headers.forEach((header, index) => {
    const div = document.createElement('div');
    div.setAttribute('class', 'header-row');

    div.innerHTML = `
      <label for="http-header-${index}" class="toggle">
        <input type="checkbox" id="http-header-${index}" data-index="${index}" class="toggle toggle-checkbox" ${header.enabled ? 'checked' : ''} />
        <span class="slider"></span>
      </label>
      <div class="header-content-wrapper">
        <strong>${header.name}</strong><span>${header.value}</span>
      </div>
      <button data-index="${index}" class="edit-header">edit</button>
      <button data-index="${index}" class="remove-header"><img src="trash-alt.svg" alt="Trash icon" width="14" /></button>
    `;

    headerList?.appendChild(div);
  });

  // Listen to edit button clicks to open the edit panel
  document.querySelectorAll<EditHeaderButtonElement>('.edit-header').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = byId('edit-panel');
      const backdrop = byId('backdrop');

      const editHeaderActiveInput = byId<HTMLInputElement>('edit-header-active');
      const editHeaderKeyInput = byId<HTMLInputElement>('edit-header-key');
      const editHeaderValueInput = byId<HTMLInputElement>('edit-header-value');
      const headerToEdit = byId<HTMLInputElement>('header-index-to-edit');

      const selectedHeader = headers[Number(button.dataset.index)];

      panel?.classList.add('is-open');
      backdrop?.classList.add('is-visible');

      panel?.removeAttribute('hidden');
      backdrop?.removeAttribute('hidden');

      if (editHeaderActiveInput && editHeaderKeyInput && editHeaderValueInput && headerToEdit) {
        editHeaderActiveInput.checked = selectedHeader.enabled;
        editHeaderKeyInput.value = selectedHeader.name;
        editHeaderValueInput.value = selectedHeader.value;
        headerToEdit.value = button.dataset.index;
      }
    });
  });

  // Save the changed header
  byId<HTMLButtonElement>('save-header-button')?.addEventListener('click', async () => {
    const index = Number(byId<HTMLInputElement>('header-index-to-edit')?.value);
    const updatedHeaderActive = byId<HTMLInputElement>('edit-header-active')?.checked;
    const updatedHeaderKey = escapeHTML(byId<HTMLInputElement>('edit-header-key')?.value.trim());
    const updatesHeaderValue = escapeHTML(
      byId<HTMLInputElement>('edit-header-value')?.value.trim()
    );

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
  });

  // Close the panel when clicking outside of it
  byId('backdrop')?.addEventListener('click', closePanel);

  // Toggle activation label
  byId<HTMLInputElement>('edit-header-active')?.addEventListener('change', () => {
    const labelElement = byId<HTMLSpanElement>('edit-header-active-label');
    if (labelElement) {
      labelElement.textContent = byId<HTMLInputElement>('edit-header-active')?.checked
        ? 'Header is active'
        : 'Header is disabled';
    }
  });
};

// Create a new header
addHeaderButton?.addEventListener('click', async () => {
  if (headerKey && headerValue) {
    const result = await storage.local.get('headers');
    const headers = result.headers || [];
    headers.push({ name: headerKey, value: headerValue, enabled: true });

    await setHeaders(headers, render);

    if (headerKeyInput) headerKeyInput.value = '';
    if (headerValueInput) headerValueInput.value = '';
  }
});

render();
