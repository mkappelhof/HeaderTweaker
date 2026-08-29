import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { storage } from '@constants/index';
import { SCOPES, type Scope } from '@constants/scopes';
import { activateHeader } from '@helpers/header/activate-header.helper';
import { addHeader } from '@helpers/header/add-header.helper';
import { getHeaders } from '@helpers/header/get-headers.helper';
import { importHeaders } from '@helpers/header/import-headers.helper';
import { removeHeader } from '@helpers/header/remove-header.helper';
import { saveHeaders } from '@helpers/header/save-headers.helper';
import { updateHeader } from '@helpers/header/update-headers.helper';
import {
  isDisabledGlobally,
  setStatus as setHeaderTweakerStatus,
} from '@helpers/headertweaker.helper';
import type { Header } from '@interfaces/index';

type HeaderFn = {
  header: Header;
  action: 'add' | 'update' | 'remove' | 'activate';
  isActive?: boolean;
};

type HeaderTweakerContextValue = {
  loading: boolean;
  headers: ReadonlyArray<Header>;
  isDisabled: boolean;
  useLabels: boolean;
  selectedHeader: Header | null;
  scope: Scope;
  showBulkScopeChange: boolean;
  updateHeader: (args: HeaderFn) => Promise<void>;
  importHeaders: (headers: Header[]) => Promise<void>;
  reorderHeaders: (headers: Header[]) => Promise<void>;
  setStatus: (status: string) => Promise<void>;
  setUseLabels: (show: boolean) => void;
  setscope: Dispatch<SetStateAction<Scope>>;
  setSelectedHeader: Dispatch<SetStateAction<Header | null>>;
  setShowBulkScopeChange: Dispatch<SetStateAction<boolean>>;
};

const initialState: HeaderTweakerContextValue = {
  headers: [],
  selectedHeader: null,
  loading: false,
  isDisabled: false,
  useLabels: false,
  scope: SCOPES.ALL,
  showBulkScopeChange: false,
  updateHeader: async () => {},
  importHeaders: async () => {},
  reorderHeaders: async () => {},
  setSelectedHeader: () => {},
  setUseLabels: () => {},
  setscope: () => {},
  setStatus: async () => {},
  setShowBulkScopeChange: () => {},
};

export const HeaderTweakerContext = createContext<HeaderTweakerContextValue>({
  ...initialState,
});

export const useHeaderTweakerContext = (): HeaderTweakerContextValue => {
  return useContext(HeaderTweakerContext);
};

interface HeaderTweakerContextProps {
  children: ReactNode;
}

export const HeaderTweakerProvider = ({ children }: HeaderTweakerContextProps) => {
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [useLabels, setUseLabels] = useState(false);
  const [headerList, setHeaderList] = useState<Header[]>([]);
  const [showBulkScopeChange, setShowBulkScopeChange] = useState(false);
  const [selectedHeader, setSelectedHeaderRaw] = useState<Header | null>(null);
  const [scope, setscope] = useState<Scope>(SCOPES.ALL);

  const setSelectedHeader = (value: SetStateAction<Header | null>) => {
    setSelectedHeaderRaw(value);
  };

  const setUseLabelsFn = (show: boolean) => {
    setUseLabels(show);
    storage.local.set({ useLabels: show });
  };

  const getStatus = async () => setIsDisabled(await isDisabledGlobally());

  const setStatus = async (status: string) => {
    const newStatus = await setHeaderTweakerStatus(status);
    setIsDisabled(newStatus === 'disabled');
  };

  const fetchHeaders = async () => {
    try {
      const headers = await getHeaders();
      setHeaderList(headers);
    } finally {
      setLoading(false);
    }
  };

  const importHeaderFn = async (headers: Header[]) => {
    await importHeaders([...headerList, ...headers]);
    await fetchHeaders();
  };

  const reorderHeadersFn = async (headers: Header[]) => {
    await saveHeaders(headers);
    setHeaderList(headers);
  };

  const updateHeaderFn = async ({ header, action, isActive }: HeaderFn) => {
    let newHeader: Header | undefined;

    switch (action) {
      case 'add':
        newHeader = await addHeader(header);
        break;
      case 'update':
        newHeader = await updateHeader(header);
        break;
      case 'remove':
        await removeHeader(header);
        break;
      case 'activate':
        newHeader = await activateHeader(header, isActive ?? false);
        break;
    }

    await fetchHeaders();

    if (newHeader) {
      setSelectedHeader(newHeader);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: should only run on mount
  useEffect(() => {
    getStatus();
    fetchHeaders();
    storage.local.get('useLabels').then((result) => {
      if (typeof result.useLabels === 'boolean') {
        setUseLabels(result.useLabels);
      }
    });
  }, []);

  const value = {
    loading,
    isDisabled,
    useLabels,
    selectedHeader,
    scope,
    showBulkScopeChange,
    setscope,
    setSelectedHeader,
    setStatus,
    setShowBulkScopeChange,
    headers: headerList,
    setUseLabels: setUseLabelsFn,
    updateHeader: updateHeaderFn,
    importHeaders: importHeaderFn,
    reorderHeaders: reorderHeadersFn,
  };

  return <HeaderTweakerContext.Provider value={value}>{children}</HeaderTweakerContext.Provider>;
};
