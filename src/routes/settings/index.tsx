import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import General from "./general"
import Header from "@/components/header"
import Account from "./account"
import Developer from "./developer"

export default function Settings() {
  return (
    <div>
      <Header title='Settings' subtitle='change your fate.' />

      <div className='flex flex-col p-4'>
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
      </div>
    </div>
  )
}
