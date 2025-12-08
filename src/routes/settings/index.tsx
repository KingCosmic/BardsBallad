import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import General from "./general"
import Header from "@/components/header"
import Account from "./account"
import Developer from "./developer"
import PageContent from '@/components/page-content'

export default function Settings() {
  return (
    <div>
      <Header title='Settings' subtitle='change your fate.' />

      <PageContent>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value='account'>Account</TabsTrigger>
            <TabsTrigger value='general'>General</TabsTrigger>
            <TabsTrigger value='developer'>Developer</TabsTrigger>
          </TabsList>
          <Account />
          <General />
          <Developer />
        </Tabs>
      </PageContent>
    </div>
  )
}
