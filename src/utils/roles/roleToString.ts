
import Roles from '@/constants/roles'
import { hasRole } from './hasRole'

export default function roleToString(role: number) {
  if (hasRole(role, Roles.FREE)) return 'Free'
  if (hasRole(role, Roles.PREMIUM)) return 'Premium'
  if (hasRole(role, Roles.AMBASSADOR)) return 'Ambassador'
  if (hasRole(role, Roles.DEVELOPER)) return 'Developer'
  if (hasRole(role, Roles.ADMINISTRATOR)) return 'Admin'
}