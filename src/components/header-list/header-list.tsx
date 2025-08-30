import { useHeaderTweakerContext } from '@contexts/headertweaker.context';

export const HeaderList = () => {
  const { headers } = useHeaderTweakerContext();
  console.log('headers');
  headers.forEach(console.log);
  return <h1>Headers</h1>;
};
