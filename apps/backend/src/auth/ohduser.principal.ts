import { ApiPermission } from './ApiPermission';
import type { interfaces } from 'inversify-express-utils';

export class OHDUserPrincipal implements interfaces.Principal {
  public roles: Set<ApiPermission>;
  constructor(
    public id: string,
    public details: unknown,
    public type: 'api' | 'refresh' | 'access',
    roles: Array<ApiPermission> = [],
  ) {
    this.roles = new Set(this.type == 'api' ? roles : [ApiPermission.ADMIN]);
  }

  async isAuthenticated(): Promise<boolean> {
    return true;
  }

  async isInRole(role: ApiPermission): Promise<boolean> {
    return (
      this.roles.has(role) ||
      (role.includes('_') &&
        this.roles.has(role.split('_')[0] as ApiPermission))
    );
  }

  async isResourceOwner(_resId: unknown): Promise<boolean> {
    return true;
  }
}
