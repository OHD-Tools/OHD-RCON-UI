import { interfaces } from 'inversify-express-utils';
import { ApiPermission } from './ApiPermission';
export class AnonymousPrincipal implements interfaces.Principal {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public details: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(details: any) {
    this.details = details;
  }

  async isAuthenticated(): Promise<boolean> {
    return false;
  }

  async isInRole(role: string): Promise<boolean> {
    return role == ApiPermission.ANON;
  }

  async isResourceOwner(resourceId: unknown): Promise<boolean> {
    return resourceId == ApiPermission.ANON;
  }
}
