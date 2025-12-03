import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { TabsContent } from "@/components/ui/tabs";
import Roles from "@/constants/roles";
import ConfirmModal from "@/modals/confirm";
import { authState, logout } from "@/state/auth";
import { openModal } from "@/state/modals";
import { hasRole } from "@/utils/roles/hasRole";
import roleToString from "@/utils/roles/roleToString";
import { useNavigate } from "react-router";

export default function Account() {
  const { user, isLoggedIn } = authState.useValue()
  const navigate = useNavigate()

  if (!user || !isLoggedIn) {
    return (
      <TabsContent value='account'>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Logged Out</EmptyTitle>
            <EmptyDescription>
              You're using BardsBallad as a guest, please login to access account settings.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant='outline' onClick={() => navigate('/auth')}>
              Login / Signup
            </Button>
          </EmptyContent>
        </Empty>
      </TabsContent>
    )
  }

  const getLoginLink = () => {}

  return (
    <TabsContent value='account'>
      <div className='flex flex-col w-full bg-neutral-800 p-4 rounded-lg border-neutral-500 border'>
        {/* Header */}
        <div className="flex items-center">
          <div className="w-12 h-12 fantasy-accent-gradient rounded-xl flex items-center justify-center text-xl font-bold text-fantasy-dark mr-4 shadow-lg shadow-fantasy-accent/30">
            {user.username[0]}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-fantasy-text mb-1">{user.username}</h3>
            <div className="flex items-center gap-2 text-xs text-fantasy-accent/70">
              <span>{user.email}</span>
              <span className="bg-fantasy-accent/20 px-1.5 py-0.5 rounded text-[10px]">{roleToString(user.role)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col w-full bg-fantasy-dark p-4 rounded-lg border-fantasy-border border'>
        <p className='text-lg'>Subscription</p>
        <p className='mb-4'>Current Tier: {roleToString(user.role)}</p>
        <Button color='primary' onClick={async () => {
          let url = ''

          const isPremium = hasRole(user.role, Roles.PREMIUM)
          const isNormalUser = hasRole(user.role, Roles.FREE) || hasRole(user.role, Roles.PREMIUM)

          // if (isNormalUser && !isPremium) {
          //   const { data: newUrl } = await subscribe()
          //   url = newUrl
          // } else if (isNormalUser && isPremium) {
          //   const { data: newUrl } = await openBilling()
          //   url = newUrl
          // }

          window.open(url, '_self')
        }}>
          {(hasRole(user.role, Roles.FREE)) ? 'Subscribe' : (hasRole(user.role, Roles.PREMIUM)) ? 'Manage Subscription' : 'Thank you for everything!'}
        </Button>
      </div>

      {!user.discord_id ? (
        <div className='flex flex-col w-full bg-neutral-800 p-4 rounded-lg border-indigo-500 border'>
          <p className='text-lg'>Discord Integration</p>
          <p className='mb-4'>Link your Discord account to access additional features</p>
          <Button color='primary' onClick={getLoginLink}>
            Connect Discord Account
          </Button>
        </div>
      ) : (
        <div className='flex flex-col w-full bg-neutral-800 p-4 rounded-lg border-indigo-500 border'>
          <p className='text-lg'>Discord Integration</p>
          <p className='mb-4'>Discord linked!</p>
          <Button color='danger' onClick={getLoginLink}>
            Disonnect
          </Button>
        </div>
      )}

      <div className='flex flex-col w-full bg-neutral-800 p-4 rounded-lg border-red-500 border'>
        <p className='text-lg'>Danger Zone</p>
        <p className='mb-4 text-red-500'>All local data is cleared (unsynced data will be lost)</p>
        <Button color='danger' onClick={() =>
          openModal('confirm', ({ id }) => (
            <ConfirmModal id={id} title='Logout' type='danger' message='All local data is cleared (unsynced data will be lost)' onConfirm={logout} />
          ))
        }>
          Logout
        </Button>
      </div>
    </TabsContent>
  )
}