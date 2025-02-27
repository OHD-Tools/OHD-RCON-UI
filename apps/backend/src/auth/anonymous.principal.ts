import { interfaces } from 'inversify-express-utils';
import { ApiPermission } from './ApiPermission';
export class AnonymousPrincipal implements interfaces.Principal {
  public details: any;
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
