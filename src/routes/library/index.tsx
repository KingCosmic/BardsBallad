import Header from "@/components/header"
import { Spinner } from "@/components/ui/spinner"
import NoSubscriptions from "./no-subscriptions"
import SubscriptionCard from "./subscription-card"
import FloatingActionButton from "@/components/ui/fab"
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { openModal } from "@/state/modals"
import importItem from "@/db/shared/methods/importItem"
import ImportFile from "@/modals/import-file"
import CreateSubscription from "@/modals/creation/create-subscription"
import PageContent from '@/components/page-content'
import useSubscriptionsWithData from '@/db/subscription/hooks/useSubscriptionsWithData'


const Library: React.FC = () => {
  const { subscriptions, isLoading } = useSubscriptionsWithData()

  console.log(subscriptions)

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

      <PageContent>
        {/* TODO: Searchbar */}

        {subscriptions.length === 0 ? (
          <NoSubscriptions />
        ) : (
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <h4 className='mb-2 text-xl'>Subscribed Systems</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {subscriptions.filter(sub => sub.type === 'system').map(sub => (
                  <SubscriptionCard key={sub.local_id} item={sub.item} subscriptionId={sub.sub.local_id} />
                ))}
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <h4 className='mb-2 text-xl'>Subscribed Datapacks</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {subscriptions.filter(sub => sub.type === 'datapack').map(sub => (
                  <SubscriptionCard key={sub.local_id} item={sub.item} subscriptionId={sub.sub.local_id} />
                ))}
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <h4 className='mb-2 text-xl'>Subscribed Themes</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {subscriptions.filter(sub => sub.type === 'theme').map(sub => (
                  <SubscriptionCard key={sub.local_id} item={sub.item} subscriptionId={sub.sub.local_id} />
                ))}
              </div>
            </div>
          </div>
        )}

        <FloatingActionButton>
          <DropdownMenuContent side='top' className='w-56' align='start'>
            <DropdownMenuItem onClick={() => {
              openModal('create-subscription', CreateSubscription)
            }}>
              Create Item
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              openModal('import-system', ({ id }) => <ImportFile id={id} title='Import Item' onSave={async (fileContent: string) => {
                  try {
                    const parsed = JSON.parse(fileContent)
                    await importItem(parsed)
                  } catch (e) {
                    console.error(e)
                  }
                }} />
              )
            }}>
              Import Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </FloatingActionButton>
      </PageContent>
    </div>
  )
}

export default Library