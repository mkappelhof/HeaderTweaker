import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getHeaders, saveHeader as saveHeaderInStorage } from '@helpers/header.helper';
import type { Header } from '@interfaces/index';

type HeaderTweakerContextValue = {
  loading: boolean;
  headers: Header[];
  saveHeader: (header: Header) => Promise<void>;
};

const initialState: HeaderTweakerContextValue = {
  headers: [],
  loading: false,
  saveHeader: async () => {},
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

  const fetchHeaders = useCallback(async () => {
    try {
      const headers = await getHeaders();
      setHeaderList(headers);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  const saveHeader = useCallback(
    async (header: Header) => {
      await saveHeaderInStorage(header);
      await fetchHeaders();
    },
    [fetchHeaders]
  );

  useEffect(() => {
    fetchHeaders();
  }, [fetchHeaders]);

  const value = useMemo(
    () => ({ loading, headers: headerList, saveHeader }),
    [loading, headerList, saveHeader]
  );

  return <HeaderTweakerContext.Provider value={value}>{children}</HeaderTweakerContext.Provider>;
};
