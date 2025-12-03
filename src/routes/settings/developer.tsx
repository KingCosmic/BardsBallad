import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import ConfirmModal from "@/modals/confirm";
import { openModal } from "@/state/modals";
import clearLocalStorage from "@/utils/developer/clearLocalStorage";

export default function Developer() {
  // const settings = settingsState.useValue()

  return (
    <TabsContent value='developer' className='pt-4'>
      {/* <p className='my-2'><a className='underline' href='https://eruda.liriliri.io/' target='_blank'>Eruda</a> allows access to the development console on mobile.</p>
      <Label>Enable Eruda</Label>
      <Checkbox checked={settings.isErudaActive} onCheckedChange={setErudaActive} /> */}

      <Label className='mb-4'>Clear Local Storage</Label>
      <Button variant='destructive' onClick={() => openModal('clear-local-storage', ({ id }) => (
        <ConfirmModal id={id} title='Clear Local Storage' type='danger' message='Clearing local storage will remove everything from this device. all unsynced data will be lost.' onConfirm={clearLocalStorage} />
      ))}>Clear Local Storage</Button>
    </TabsContent>
  )
}