import Header from "@/components/header"
import { MarketplaceItem } from "@/types/marketplace"
import ItemCard from "./item"
import { useQuery } from "@tanstack/react-query"
import { getMarketplaceItems } from "@/lib/api/marketplace/getMarketplaceItems"
import { authState } from "@/state/auth"
import { useEffect, useMemo } from "react"
import { hasRole } from "@/utils/roles/hasRole"
import Roles from "@/constants/roles"
import FloatingActionButton from "@/components/ui/fab"
import { closeModal, openModal } from "@/state/modals"
import PublishItem from "@/modals/marketplace/publish-item"
import MarketplaceDisclaimer from "@/modals/marketplace/disclaimer"

const Marketplace: React.FC = () => {
  const { isLoggedIn, user } = authState.useValue()

  const isAdmin = useMemo(() => {
    if (!isLoggedIn) return false
    if (!user) return false

    return hasRole(user.role, Roles.ADMINISTRATOR)
  }, [isLoggedIn, user])

  const { isPending, data: items } = useQuery<MarketplaceItem[]>({
    queryKey: ['marketplace-items'],
    queryFn: () => getMarketplaceItems(),
    initialData: []
  })

  useEffect(() => {
    const disclaimer = async () => {
      const hasSeenDisclaimer = localStorage.getItem('seen-marketplace-disclaimer')

      if (hasSeenDisclaimer === 'true') return

      openModal('marketplace-disclaimer', ({ id }) => (
        <MarketplaceDisclaimer onAccept={() => {
          closeModal(id)
          localStorage.setItem('seen-marketplace-disclaimer', 'true')
        }} />
      ))
    }

    disclaimer()
  }, [])

  return (
    <div>
      <Header title='Marketplace' subtitle='Coming soon: community-made systems, datapacks, & themes.' />

      <div className='relative flex flex-col gap-4 p-4'>
        <div className='flex flex-col gap-4'>
          <h3 className='text-3xl font-semibold mt-4 mb-2'>Featured Systems</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {items.filter(i => i.resource_type === 'system').map((item, index) => <ItemCard key={index} item={item} />)}
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <h3 className='text-3xl font-semibold mt-4'>Featured Datapacks</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {items.filter(i => i.resource_type === 'datapack').map((item, index) => <ItemCard key={index} item={item} />)}
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <h3 className='text-3xl font-semibold mt-4'>Featured Themes</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {items.filter(i => i.resource_type === 'datapack').map((item, index) => <ItemCard key={index} item={item} />)}
          </div>
        </div>

        {isAdmin && (
          <FloatingActionButton onClick={() => {
            openModal('publish-item', PublishItem)
          }} />
        )}
      </div>
    </div>
  )
}

export default Marketplace