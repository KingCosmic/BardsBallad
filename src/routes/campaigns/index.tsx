import Header from '@/components/header';
import PageContent from '@/components/page-content';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

export default function Campaigns() {

  return (
    <div>
      <Header title='Your Heroic tales' subtitle='hopefully of epic adventures and not murder hobos' />

      <PageContent>
        <Empty className='absolute top-0 left-0 bottom-0 right-0'>
          <EmptyHeader>
            <EmptyTitle>Under Construction</EmptyTitle>
            <EmptyDescription>
              In the near future this will be where you can invite users
              to play together in groups, gm tools, shared characters, VTT.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </PageContent>
    </div>
  )
}