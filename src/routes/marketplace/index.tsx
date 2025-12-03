import Header from "@/components/header"
import { MarketplaceItem } from "@/types/marketplace"
import ItemCard from "./item"
import { useQuery } from "@tanstack/react-query"
import { getMarketplaceItems } from "@/lib/api/marketplace/getMarketplaceItems"

const Marketplace: React.FC = () => {
  // const { isLoggedIn, user } = authState.useValue()

  // const isAdmin = useMemo(() => {
  //   if (!isLoggedIn) return false
  //   if (!user) return false

  //   if (!hasRole(user.role, Roles.ADMINISTRATOR)) return false
  // }, [isLoggedIn, user])

  const { isPending, data: items } = useQuery<MarketplaceItem[]>({
    queryKey: ['marketplace-items'],
    queryFn: () => getMarketplaceItems(),
    initialData: []
  })

  // useEffect(() => {
  //   const disclaimer = async () => {
  //     const hasSeenDisclaimer = await MiscStorage.get('seen-marketplace-disclaimer')

  //     if (hasSeenDisclaimer) return

  //     openModal('marketplace-disclaimer', ({ id }) => (
  //       <MarketplaceDisclaimer onAccept={() => {
  //         closeModal(id)
  //         MiscStorage.set('seen-marketplace-disclaimer', true)
  //       }} />
  //     ))
  //   }

  //   disclaimer()
  // }, [])

  return (
    <div>
      <Header title='Marketplace' subtitle='Coming soon: community-made systems, datapacks, & themes.' />

      <div className='p-4'>
        {/* Categories */}
        <div>
          <h3 className='text-3xl font-semibold mt-4'>Browse Categories</h3>
          <div className='flex flex-wrap gap-3 mt-2'>
            {[
              '⚔️ Game Systems (40)',
              '📦 Datapacks (100+)',
              '🎨 Themes (32)',
            ].map(item => (
              <span key={item} className='cursor-pointer bg-linear-to-br from-fantasy-accent/20 to-fantasy-accent-dark/10 border border-fantasy-accent/30 rounded-xl px-4 py-2 text-sm leading-relaxed'>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className='text-3xl font-semibold mt-4 mb-2'>Featured Systems</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {items.filter(i => i.resource_type === 'system').map((item, index) => <ItemCard key={index} item={item} />)}
          </div>
        </div>
        <div>
          <h3 className='text-3xl font-semibold mt-4'>Featured Datapacks</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {items.filter(i => i.resource_type === 'datapack').map((item, index) => <ItemCard key={index} item={item} />)}
          </div>
        </div>
        <div>
          <h3 className='text-3xl font-semibold mt-4'>Featured Themes</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {items.filter(i => i.resource_type === 'datapack').map((item, index) => <ItemCard key={index} item={item} />)}
          </div>
        </div>
      </div>
      
      {/* {isAdmin && (
        <FloatingActionButton
          onClick={() => openModal('publish-item', ({ id }) => (
            <PublishNewSystem id={id} />
          ))}
        />
      )} */}
    </div>
  )
}

export default Marketplace