import type { EditHeaderButtonElement, Header, RenderFn } from '../types';
import { byId, closePanel, escapeHTML, getHeaders, updateHeader } from './helpers';

export const toggleEnableHeader = (header: Header, index: number, callback: RenderFn) =>
  updateHeader({ ...header, enabled: !header.enabled }, index, callback);

// Handles clicks on an edit button of a specific header and populates the input field values.
export const openEditHeaderPanel = async (button: EditHeaderButtonElement) => {
  const headers = await getHeaders();

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
