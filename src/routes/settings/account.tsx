import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemActions, ItemContent, ItemHeader, ItemMedia, ItemTitle } from '@/components/ui/item';
import { TabsContent } from "@/components/ui/tabs";
import Roles from "@/constants/roles";
import { logout } from '@/lib/api/auth/logout';
import getLoginLink from '@/lib/api/discord/getLoginLink';
import { openBilling } from '@/lib/api/openBilling';
import { subscribe } from '@/lib/api/subscribe';
import ConfirmModal from "@/modals/confirm";
import { authState } from "@/state/auth";
import { openModal } from "@/state/modals";
import { hasRole } from "@/utils/roles/hasRole";
import roleToString from "@/utils/roles/roleToString";
import { IconBrandDiscord, IconLogout, IconSubscript } from '@tabler/icons-react';
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

  return (
    <TabsContent value='account' className='flex flex-col gap-4'>
      <div className='flex flex-col gap-4 w-full p-4'>
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

      <Item variant='outline'>
        <ItemHeader>Subscription</ItemHeader>
        <ItemMedia variant='icon'>
          <IconSubscript />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            Current Tier: {roleToString(user.role)}
          </ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button onClick={async () => {
            let url = ''

            const isPremium = hasRole(user.role, Roles.PREMIUM)
            const isNormalUser = hasRole(user.role, Roles.FREE) || hasRole(user.role, Roles.PREMIUM)

            if (isNormalUser && !isPremium) {
              const { data: newUrl } = await subscribe()
              url = newUrl
            } else if (isNormalUser && isPremium) {
              const { data: newUrl } = await openBilling()
              url = newUrl
            }

            window.open(url, '_self')
          }}>
            {(hasRole(user.role, Roles.FREE)) ? 'Subscribe' : (hasRole(user.role, Roles.PREMIUM)) ? 'Manage Subscription' : 'Thank you for everything!'}
          </Button>
        </ItemActions>
      </Item>

      <Item variant='outline'>
        <ItemHeader>Discord Integration</ItemHeader>
        <ItemMedia variant='icon'>
          <IconBrandDiscord />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            {user.discord_id ? 'Discord linked!' : 'Link your Discord account to access additional features'}
          </ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant={user.discord_id ? 'destructive' : 'outline'} onClick={getLoginLink}>
            {user.discord_id ? 'Disconnect' : 'Connect'}
          </Button>
        </ItemActions>
      </Item>

      <Item variant='outline'>
        <ItemHeader>Danger Zone</ItemHeader>
        <ItemMedia variant='icon'>
          <IconLogout />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className='text-destructive'>
            All local data is cleared (unsynced data will be lost)
          </ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant='destructive' onClick={() =>
            openModal('confirm', ({ id }) => (
              <ConfirmModal id={id} title='Logout' type='danger' message='All local data is cleared (unsynced data will be lost)' onConfirm={logout} />
            ))
          }>
            Logout
          </Button>
        </ItemActions>
      </Item>
    </TabsContent>
  )
}