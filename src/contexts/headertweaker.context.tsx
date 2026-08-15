import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { SCOPES, type Scope, storage } from '@constants/index';
import {
  activateHeader,
  addHeader,
  getHeaders,
  importHeaders,
  removeHeader,
  reorderHeaders,
  updateHeader,
} from '@helpers/header.helper';
import {
  isDisabledGlobally,
  setStatus as setHeaderTweakerStatus,
} from '@helpers/headertweaker.helper';
import type { Header, Status } from '@interfaces/index';

type HeaderFn = {
  header: Header;
  action: 'add' | 'update' | 'remove' | 'activate';
  isActive?: boolean;
};

type HeaderTweakerContextValue = {
  loading: boolean;
  headers: Header[];
  isDisabled: boolean;
  useLabels: boolean;
  selectedHeader: Header | null;
  showHeadersFilter: Scope;
  updateHeader: (args: HeaderFn) => Promise<void>;
  importHeaders: (headers: Header[]) => Promise<void>;
  reorderHeaders: (headers: Header[]) => Promise<void>;
  setStatus: (status: Status) => Promise<void>;
  setUseLabels: (show: boolean) => void;
  setShowHeadersFilter: Dispatch<SetStateAction<Scope>>;
  setSelectedHeader: Dispatch<SetStateAction<Header | null>>;
};

const initialState: HeaderTweakerContextValue = {
  headers: [],
  selectedHeader: null,
  loading: false,
  isDisabled: false,
  useLabels: false,
  showHeadersFilter: SCOPES.ALL,
  updateHeader: async () => {},
  importHeaders: async () => {},
  reorderHeaders: async () => {},
  setSelectedHeader: () => {},
  setUseLabels: () => {},
  setShowHeadersFilter: () => {},
  setStatus: async () => {},
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
  const [selectedHeader, setSelectedHeaderRaw] = useState<Header | null>(null);
  const [showHeadersFilter, setShowHeadersFilter] = useState<Scope>(SCOPES.ALL);

  const setSelectedHeader = (value: SetStateAction<Header | null>) => {
    setSelectedHeaderRaw(value);
  };

  const setUseLabelsFn = (show: boolean) => {
    setUseLabels(show);
    storage.local.set({ useLabels: show });
  };

  const getStatus = async () => setIsDisabled(await isDisabledGlobally());

  const setStatus = async (status: Status) => {
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
    await reorderHeaders(headers);
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
    showHeadersFilter,
    setShowHeadersFilter,
    setSelectedHeader,
    setStatus,
    headers: headerList,
    setUseLabels: setUseLabelsFn,
    updateHeader: updateHeaderFn,
    importHeaders: importHeaderFn,
    reorderHeaders: reorderHeadersFn,
  };

  return <HeaderTweakerContext.Provider value={value}>{children}</HeaderTweakerContext.Provider>;
};
