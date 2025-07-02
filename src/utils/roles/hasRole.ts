export function hasRole(userRoles: number, roleToCheck: number): boolean {
  return (userRoles & roleToCheck) === roleToCheck;
}