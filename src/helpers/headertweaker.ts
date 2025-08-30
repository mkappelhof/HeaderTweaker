// import { storage } from '../constants/constants';
// import {
//   handleHeaderKeyChange,
//   openEditHeaderPanel,
//   openSettingsPanel,
//   removeSelectedHeader,
//   showHeaderImportPanel,
//   toggleEnableHeader,
// } from './event-listeners';
// import { byId, getHeaders, setHeaders } from './helpers';

// import '../styles/style.scss';

// // Elements
// const headerKeyInput = byId<HTMLInputElement>('header-key');
// const headerValueInput = byId<HTMLInputElement>('header-value');
// const addHeaderButton = byId<HTMLButtonElement>('add-header-button');
// const settingsButton = byId<HTMLButtonElement>('settings-button');
// const headerList = byId('header-list');

// // New header data
// let headerKey: string | undefined, headerValue: string | undefined;

// // Update the button disabled state based on input values
// const updateButtonState = () => {
//   headerKey = headerKeyInput?.value;
//   headerValue = headerValueInput?.value;

//   if (addHeaderButton) {
//     addHeaderButton.disabled = !(headerKey && headerValue);
//   }
// };

// headerKeyInput?.addEventListener('input', updateButtonState);
// headerKeyInput?.addEventListener('change', handleHeaderKeyChange);
// headerValueInput?.addEventListener('input', updateButtonState);

// const render = async () => {
//   const headers = await getHeaders();
//   if (headerList)
//     headerList.innerHTML = headers.length
//       ? `
//       <div class="headers-desc-row">
//         <h3>Header key</h3>
//         <h3>Header value</h3>
//       </div>
//     `
//       : '';

//   // Append headers to header row container
//   headers.forEach((header, index) => {
//     const div = document.createElement('div');
//     div.setAttribute('class', 'header-row');

//     const headerToggle = document.createElement('label');
//     headerToggle.setAttribute('for', `http-header-${index}`);
//     headerToggle.setAttribute('class', 'toggle');

//     const headerToggleInput = document.createElement('input');
//     headerToggleInput.setAttribute('type', 'checkbox');
//     headerToggleInput.setAttribute('id', `http-header-${index}`);
//     headerToggleInput.setAttribute('data-index', `${index}`);
//     headerToggleInput.setAttribute('class', 'toggle toggle-checkbox');
//     headerToggleInput.checked = header.enabled;

//     const headerToggleSlider = document.createElement('span');
//     headerToggleSlider.setAttribute('class', 'slider');

//     headerToggle.appendChild(headerToggleInput);
//     headerToggle.appendChild(headerToggleSlider);

//     headerToggleInput.addEventListener(
//       'change',
//       toggleEnableHeader.bind(null, header, index, render)
//     );

//     const headerContentWrapper = document.createElement('div');
//     headerContentWrapper.setAttribute('class', 'header-content-wrapper');

//     const headerLabel = document.createElement('strong');
//     headerLabel.textContent = header.name;

//     const headerValue = document.createElement('span');
//     headerValue.textContent = header.value;

//     headerContentWrapper.appendChild(headerLabel);
//     headerContentWrapper.appendChild(headerValue);

//     div.appendChild(headerToggle);
//     div.appendChild(headerContentWrapper);

//     const buttonWrapper = document.createElement('div');
//     buttonWrapper.setAttribute('class', 'button-wrapper');

//     const editButton = document.createElement('button');
//     editButton.setAttribute('data-index', `${index}`);
//     editButton.classList.add('icon-button', 'edit-header');

//     // Add click event listener for edit button
//     editButton.addEventListener('click', openEditHeaderPanel.bind(null, index, render));

//     const editButtonIcon = document.createElement('i');
//     editButtonIcon.classList.add('fa-regular', 'fa-edit');
//     editButton.appendChild(editButtonIcon);

//     const removeButton = document.createElement('button');
//     removeButton.setAttribute('data-index', `${index}`);
//     removeButton.classList.add('icon-button', 'remove-header');

//     // Add click event listener for remove button
//     removeButton.addEventListener('click', async () => await removeSelectedHeader(index, render));

//     const removeButtonIcon = document.createElement('i');
//     removeButtonIcon.classList.add('fa-regular', 'fa-trash-alt');
//     removeButton.appendChild(removeButtonIcon);

//     buttonWrapper.appendChild(editButton);
//     buttonWrapper.appendChild(removeButton);

//     div.appendChild(buttonWrapper);

//     headerList?.appendChild(div);
//   });
// };

// // Create a new header
// addHeaderButton?.addEventListener('click', async () => {
//   if (headerKey && headerValue) {
//     const result = await storage.local.get('headers');
//     const headers = result.headers || [];
//     headers.push({ name: headerKey, value: headerValue, enabled: true });

//     await setHeaders(headers, render);

//     if (headerKeyInput) headerKeyInput.value = '';
//     if (headerValueInput) headerValueInput.value = '';
//   }
// });

// // Open settings panel
// settingsButton?.addEventListener('click', openSettingsPanel);

// // Show file import in popup
// if (window.location.search.includes('import=true')) {
//   window.addEventListener('DOMContentLoaded', showHeaderImportPanel.bind(null, render));
// }

// render();
