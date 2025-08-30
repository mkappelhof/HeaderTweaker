// import { isFirefox, storage } from '../constants/constants';
// import type { Header, PanelElement } from '../interfaces';

// export const byId = <T extends HTMLElement>(id: string) => document.querySelector<T>(`#${id}`);

// export const getHeaders = async (): Promise<Header[]> => {
//   const result = await storage.local.get('headers');
//   return result.headers || [];
// };

// export const setHeaders = async (
//   headers: Header[],
//   callback: () => Promise<void>,
//   timeout: number | undefined = 0
// ) => {
//   if (isFirefox) {
//     await storage.local.set({ headers });
//     setTimeout(async () => await callback(), timeout);
//   } else {
//     storage.local.set({ headers }, callback);
//   }
// };

// export const updateHeader = async (header: Header, pos: number, callback: () => Promise<void>) => {
//   const headers = await getHeaders();
//   headers[pos] = header;
//   await setHeaders(headers, callback, 300);
// };

// export const removeHeader = async (pos: number, callback: () => Promise<void>) => {
//   const headers = await getHeaders();
//   headers.splice(pos, 1);
//   await setHeaders(headers, callback);
// };

// export const isValidHeaderKey = async (key: string) => {
//   const headers = await getHeaders();
//   return headers.some((header) => header.name !== key);
// };

// export const escapeHTML = (input: string | undefined) => {
//   if (!input) return '';

//   return input
//     .replace(/&/g, '&amp;')
//     .replace(/&lt;/g, '&lt;')
//     .replace(/&gt;/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#039;');
// };

// export const replaceSpacesWithDash = (input: string | undefined) => {
//   if (!input) return '';

//   return input.trim().replace(/\s+/g, '-');
// };

// export const openPanel = () => {
//   const panel = byId('edit-panel');
//   const backdrop = byId('backdrop');

//   panel?.classList.add('is-open');
//   backdrop?.classList.add('is-visible');
//   backdrop?.removeAttribute('hidden');

//   // Close the panel when clicking outside of it
//   byId('backdrop')?.addEventListener('click', closePanel);
// };

// export const closePanel = () => {
//   const panel = byId('edit-panel');
//   const backdrop = byId('backdrop');

//   panel?.classList.remove('is-open');
//   backdrop?.classList.remove('is-visible');
//   backdrop?.setAttribute('hidden', 'true');
// };

// export const setPanelContent = ({
//   title,
//   elements,
// }: {
//   title: string;
//   elements: PanelElement[];
// }) => {
//   const editPanel = byId<HTMLDivElement>('edit-panel');

//   if (editPanel) {
//     editPanel.innerHTML = '';

//     const titleElement = document.createElement('h2');
//     titleElement.textContent = title;
//     editPanel.appendChild(titleElement);

//     elements.forEach(({ element, attributes, content, listenTo }) => {
//       const newElement = document.createElement(element);

//       if (attributes) {
//         Object.entries(attributes).forEach(([attr, value]) => {
//           newElement.setAttribute(attr, value);
//         });
//       }

//       if (content) {
//         newElement.innerHTML = content;
//       }

//       if (listenTo) {
//         Object.entries(listenTo).forEach(([event, handler]) => {
//           newElement.addEventListener(event, handler);
//         });
//       }

//       editPanel.appendChild(newElement);
//     });

//     openPanel();
//   }
// };
