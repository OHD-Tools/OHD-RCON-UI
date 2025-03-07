import { Principal } from 'inversify-express-utils';
import { ApiPermission } from '~/auth/ApiPermission';
import { OHDUserPrincipal } from '~/auth/ohduser.principal';

export const hasPermission = async (
  tUser: Principal<unknown>,
  permission: ApiPermission,
): Promise<boolean> => {
  const user = tUser as OHDUserPrincipal;
  return user.isInRole(permission);
};
