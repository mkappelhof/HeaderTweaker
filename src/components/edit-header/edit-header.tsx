import { Button } from '@components/button/button';
import { Input } from '@components/input/input';
import { Switch } from '@components/switch/switch';
import { useHeaderTweakerContext } from '@contexts/headertweaker.context';

export const EditHeader = () => {
  const { updateHeader, selectedHeader } = useHeaderTweakerContext();

  if (!selectedHeader) return null;

  return (
    <>
      <Switch
        isOn={selectedHeader.enabled}
        label={selectedHeader?.enabled ? 'Header is active' : 'Header is disabled'}
        onChange={async (state) =>
          await updateHeader({ header: selectedHeader, action: 'activate', isActive: state })
        }
      />

      <Input type="text" value={selectedHeader.name} />

      <Input type="text" value={selectedHeader.value} />

      <Button>Save header</Button>
    </>
  );
};
