import Header from "@/components/header"
import PageContent from '@/components/page-content'
import { Show, SignIn, UserProfile } from '@clerk/react-router'

export default function Settings() {
  return (
    <div>
      <Header title='Account' subtitle='Who are you?' />

      <PageContent>
        <Show when='signed-out'>
          <SignIn />
        </Show>
        <Show when='signed-in'>
          <UserProfile /> 
        </Show>
      </PageContent>
    </div>
  )
}