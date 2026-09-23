import { getHeaders } from '@helpers/header/get-headers.helper';

export const exportHeaders = async () => {
  const headers = await getHeaders();
  const exportData = {
    name: 'HeaderTweaker export',
    date: new Date().toISOString(),
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
