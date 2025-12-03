import { Subscription } from "@/db/subscription/schema"
import { useLiveQuery } from "dexie-react-hooks"
import getItem from "@/db/shared/methods/getItem"
import getVisualTextFromVersionID from "@/utils/misc/getVisualTextFromVersionID"
import reviveSubscription from "@/db/subscription/methods/reviveSubscription"
import { DropdownButton } from "@/components/ui/dropdown-button"
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import clearSubscription from "@/db/subscription/methods/clearSubscription"
import { openModal } from "@/state/modals"
import JSONToFile from "@/utils/object/JSONToFile"
import ConfirmModal from "@/modals/confirm"

export default ({ sub }: { sub: Subscription }) => {
  const item = useLiveQuery(() => getItem(sub.resource_type, sub.resource_id), [sub])

  if (!item) return <p>loading</p>

  return (
    <div key={sub.local_id} className='fantasy-card-gradient card-top-border border border-fantasy-border rounded-2xl p-6 cursor-pointer transition-all duration-500 backdrop-blur-lg shadow-2xl hover:-translate-y-2 hover:shadow-fantasy-accent/20 hover:shadow-xl hover:border-fantasy-accent/40 relative'>
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 fantasy-accent-gradient rounded-xl flex items-center justify-center text-xl font-bold text-fantasy-dark mr-4 shadow-lg shadow-fantasy-accent/30">
          {item.name[0]}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-fantasy-text mb-1">{item.name}</h3>
          <div className="flex items-center gap-2 text-xs text-fantasy-accent/70">
            <span>🏹 {sub.resource_type}</span>
            <span className="bg-fantasy-accent/20 px-1.5 py-0.5 rounded text-[10px]">{getVisualTextFromVersionID(sub.version_id)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          className="flex-1 fantasy-accent-gradient text-fantasy-dark px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fantasy-accent/40"
          onClick={() => reviveSubscription(sub.local_id)}
        >
          Revive {sub.resource_type}
        </button>
        <DropdownButton label='⚙️'>
          <DropdownMenuContent className='w-56' align='start'>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => JSONToFile(sub.resource_type, item, `${item.name}-export`)}>
                Export
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => {
                openModal('confirm', ({ id }) => (
                  <ConfirmModal
                    id={id} title={`Force Delete ${sub.resource_type}`}
                    type='danger'
                    message={`Are you sure you want to force delete this ${sub.resource_type}?`}
                    onConfirm={() => clearSubscription(sub.local_id)} />
                ))
              }}>
                Force Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownButton>
      </div>
    </div>
  )
}