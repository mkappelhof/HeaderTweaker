import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import type { Header } from '@interfaces/index';

type HeaderFn = {
  header: Header;
  action: 'add' | 'update' | 'remove' | 'activate';
  isActive?: boolean;
};

type HeaderTweakerContextValue = {
  loading: boolean;
  headers: Header[];
  selectedHeader: Header | null;
  updateHeader: (args: HeaderFn) => Promise<void>;
  importHeaders: (headers: Header[]) => Promise<void>;
  setSelectedHeader: Dispatch<SetStateAction<Header | null>>;
};

const initialState: HeaderTweakerContextValue = {
  headers: [],
  selectedHeader: null,
  loading: false,
  updateHeader: async () => {},
  importHeaders: async () => {},
  setSelectedHeader: () => {},
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
  const [headerList, setHeaderList] = useState<Header[]>([]);
  const [selectedHeader, setSelectedHeaderRaw] = useState<Header | null>(null);

  const setSelectedHeader = useCallback((value: SetStateAction<Header | null>) => {
    setSelectedHeaderRaw(value);
  }, []);

  const fetchHeaders = useCallback(async () => {
    try {
      const headers = await getHeaders();
      setHeaderList(headers);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  const importHeaderFn = useCallback(
    async (headers: Header[]) => {
      await importHeaders([...headerList, ...headers]);
      await fetchHeaders();
    },
    [fetchHeaders, headerList]
  );

  const updateHeaderFn = useCallback(
    async ({ header, action, isActive }: HeaderFn) => {
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
    },
    [fetchHeaders, setSelectedHeader]
  );

  useEffect(() => {
    fetchHeaders();
  }, [fetchHeaders]);

  const value = useMemo(
    () => ({
      loading,
      headers: headerList,
      selectedHeader,
      setSelectedHeader,
      updateHeader: updateHeaderFn,
      importHeaders: importHeaderFn,
    }),
    [loading, headerList, selectedHeader, setSelectedHeader, updateHeaderFn, importHeaderFn]
  );

  return <HeaderTweakerContext.Provider value={value}>{children}</HeaderTweakerContext.Provider>;
};
