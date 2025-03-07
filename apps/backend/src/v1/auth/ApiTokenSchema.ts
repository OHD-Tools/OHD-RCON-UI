import { z } from 'zod';
import { ApiPermissionArray } from '~/auth/ApiPermission';

export const ApiTokenCreateSchema = z.object({
  name: z.string().max(32).optional().default('User Token'),
  expires: z.union([z.string().pipe(z.coerce.date()).optional(), z.string()]),
  roles: z.array(z.enum(ApiPermissionArray)),
});
export type IApiTokenCreateSchema = z.infer<typeof ApiTokenCreateSchema>;
