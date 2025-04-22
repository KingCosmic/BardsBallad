
const ROLES: { [key:number]: string } = {
  0: 'free',
  1: 'premium',
  2: 'fancy',
  3: 'developer'
}

export default function getPermsFromRole(role: number) {
  return ROLES[role] || 'free'
}