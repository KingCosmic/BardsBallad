import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";


type Props = {
  onAccept(): void;
}

const MarketplaceDisclaimer: React.FC<Props> = ({ onAccept }) => {
  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Disclaimer</DialogTitle>
        </DialogHeader>
        <ScrollArea className='max-h-[60dvh]'>
          <p>BardsBallad is a system-agnostic character manager that supports a wide variety of user-created and open-license game systems</p>
          <br />
          <p>Some content may be based on systems originally published under the ORC License, Creative Commons (CC-BY 4.0), or other open licenses. All such content is provided either by BardsBallad or individual users in compliance with their respective licenses.</p>
          <br />
          <p>BardsBallad is not affiliated with or endorsed by Paizo Inc., Wizards of the Coast, or any other publishers. Names like “Pathfinder,” “Starfinder,” or “Dungeons & Dragons” are trademarks of their respective owners and are only used to indicate compatibility where appropriate.</p>
          <br />
          <p>Users are solely responsible for the legality of content they upload or share. Please do not upload copyrighted material or publisher-owned setting content (such as Golarion or the Forgotten Realms) unless you have the appropriate rights.</p>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onAccept}>I Understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MarketplaceDisclaimer