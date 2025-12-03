import Header from "@/components/header"
import { Spinner } from "@/components/ui/spinner"
import useSubscriptionsWithData from "@/hooks/subscriptions/useSubscriptionsWithData"
import NoSubscriptions from "./no-subscriptions"
import SubscriptionCard from "./subscription-card"


const Library: React.FC = () => {
  const { subscriptions, isLoading } = useSubscriptionsWithData() 

  if (isLoading || !subscriptions) {
    return (
      <div>
        <Header title='Your Collection' subtitle='Manage your extra content' />

        <div className='flex grow gap-2 justify-center items-center'>
          <Spinner />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title='Your Collection' subtitle='Manage your extra content' />

      <div className='p-4'>
        {/* TODO: Searchbar */}

        {subscriptions.length === 0 ? (
          <NoSubscriptions />
        ) : (
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <h4 className='mb-2 text-xl'>Subscribed Systems</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {subscriptions.filter(sub => sub.type === 'system').map(item => (
                  <SubscriptionCard key={item.item_id} itemData={item.item} subs={item.subscriptions} />
                ))}
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <h4 className='mb-2 text-xl'>Subscribed Datapacks</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {subscriptions.filter(sub => sub.type === 'datapack').map(item => (
                  <SubscriptionCard key={item.item_id} itemData={item.item} subs={item.subscriptions} />
                ))}
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <h4 className='mb-2 text-xl'>Subscribed Themes</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {subscriptions.filter(sub => sub.type === 'theme').map(item => (
                  <SubscriptionCard key={item.item_id} itemData={item.item} subs={item.subscriptions} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* <FloatingActionButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} buttons={[
          { name: 'Create', icon: '', onClick: () =>
              openModal('create-subscription', ({ id }) => <CreateSubscription id={id} onCreate={() => {}} />)
          },
          { name: 'Import', icon: '', onClick: () =>
              openModal('import-system', ({ id }) => <ImportFile id={id} title='Import System' onSave={async (fileContent: string) => {
                try {
                  const parsed = JSON.parse(fileContent)
                  await importItem(parsed.type, parsed.item, parsed.version)
                } catch (e) {
                  console.error(e)
                }
              }} />
            )
          }
          ]}
        /> */}
      </div>
    </div>
  )
}

export default Library