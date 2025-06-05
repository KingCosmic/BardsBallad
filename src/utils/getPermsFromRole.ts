
const ROLES: { [key:number]: string } = {
  100: 'free',
  101: 'verified',
  200: 'premium',
  300: 'ambassador',
  800: 'developer',
  900: 'admin'
}

export default function getPermsFromRole(role: number) {
  return ROLES[role] || 'free'
}