import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  activateHeader,
  addHeader,
  getHeaders,
  importHeaders,
  removeHeader,
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
  selectedHeader: Header | null;
  updateHeader: (args: HeaderFn) => Promise<void>;
  importHeaders: (headers: Header[]) => Promise<void>;
  setStatus: (status: Status) => Promise<void>;
  setSelectedHeader: Dispatch<SetStateAction<Header | null>>;
};

const initialState: HeaderTweakerContextValue = {
  headers: [],
  selectedHeader: null,
  loading: false,
  isDisabled: false,
  updateHeader: async () => {},
  importHeaders: async () => {},
  setSelectedHeader: () => {},
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
  const [headerList, setHeaderList] = useState<Header[]>([]);
  const [selectedHeader, setSelectedHeaderRaw] = useState<Header | null>(null);

  const setSelectedHeader = (value: SetStateAction<Header | null>) => {
    setSelectedHeaderRaw(value);
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
  }, []);

  const value = {
    loading,
    isDisabled,
    headers: headerList,
    selectedHeader,
    setSelectedHeader,
    setStatus,
    updateHeader: updateHeaderFn,
    importHeaders: importHeaderFn,
  };

  return <HeaderTweakerContext.Provider value={value}>{children}</HeaderTweakerContext.Provider>;
};
