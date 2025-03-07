export enum ApiPermission {
  ADMIN = 'ADMIN',
  BAN = 'BAN',
  BAN_READ = 'BAN_READ',
  BAN_WRITE = 'BAN_WRITE',
  KICK = 'KICK',
  TOKENS = 'TOKENS',
  TOKENS_READ = 'TOKENS_READ',
  TOKENS_WRITE = 'TOKENS_WRITE',
  ANON = 'ANONYMOUS',
}

export const ApiPermissionArray = [
  ApiPermission.ADMIN,
  ApiPermission.BAN,
  ApiPermission.BAN_READ,
  ApiPermission.BAN_WRITE,
  ApiPermission.KICK,
  ApiPermission.TOKENS,
  ApiPermission.TOKENS_READ,
  ApiPermission.TOKENS_WRITE,
  ApiPermission.ANON,
] as const;
