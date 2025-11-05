import { z } from 'zod';

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  priority: z.number(),
});

export type RoleResponse = z.infer<typeof RoleSchema>;

export const UserRoleSchema = z.object({
  role: RoleSchema,
  roleId: z.number(),
  userId: z.number(),
});

export type UserRoleResponse = z.infer<typeof UserRoleSchema>;
