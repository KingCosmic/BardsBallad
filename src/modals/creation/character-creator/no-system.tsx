import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import importItem from "@/db/shared/methods/importItem";
import ImportFile from "@/modals/import-file";
import { closeModal, openModal } from "@/state/modals";
import { useCallback } from "react";
import { useNavigate } from "react-router";

interface Props {
  id: number
}

export default function NoSystem({ id }: Props) {
  const navigate = useNavigate();

  const goToMarketplace = useCallback(() => {
    closeModal(id)
    navigate('/marketplace')
  }, [id])

  const importSystem = useCallback(() => {
    closeModal(id)
    openModal('import-system', ({ id }) => <ImportFile id={id} title='Import System' onSave={async (fileContent: string) => {
      try {
        const parsed = JSON.parse(fileContent)
        importItem(parsed.type, parsed.item, parsed.version)
      } catch (e) {
        console.error(e)
      }
    }} />)
  }, [id])

  return (
    <Dialog open onOpenChange={() => closeModal(id)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>No System Found</DialogTitle>
          <DialogDescription>
            Your destiny is not yet decided..
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <h3>There was an error grabbing a default system, please subscribe to a system from the marketplace or import something!</h3>
        </DialogBody>
        <DialogFooter>
          <Button variant='outline' onClick={importSystem}>
            Import
          </Button>
          <Button onClick={goToMarketplace}>
            Marketplace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}