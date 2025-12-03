const Roles = {
  FREE: 1 << 0,
  VERIFIED: 1 << 1,
  PREMIUM: 1 << 2,
  AMBASSADOR: 1 << 3,
  DEVELOPER: 1 << 4,
  ADMINISTRATOR: 1 << 5,
} as const;

export default Roles;