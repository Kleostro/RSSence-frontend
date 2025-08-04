import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { UserResponse } from '@/app/api/schemas/users-response';
import { ROLE } from '@/app/constants/roles';
import { ENVIRONMENT } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly http = inject(HttpClient);
  public rolePriority: Map<string, number> | null = null;

  private getMaxRolePriority(roles: string[]): number {
    if (!roles.length || !this.rolePriority) {
      return -1;
    }

    return Math.max(
      ...roles
        .map((role) => this.rolePriority?.get(role))
        .filter((priority): priority is number => priority !== undefined),
    );
  }

  public addRoleToUser(userId: number, roleName: string): Observable<UserResponse> {
    return this.http.patch<UserResponse>(
      `${ENVIRONMENT.API_URL}${ENDPOINTS.USERS}/${userId.toString()}/${ENDPOINTS.ROLES}/${roleName}`,
      {},
    );
  }

  public canManageRole(currentUserRoles: string[], targetUserRoles: string[], role: string): boolean {
    const rolePriority = this.rolePriority?.get(role) ?? -1;
    if (!this.rolePriority) {
      return false;
    }

    const highestRole = [...this.rolePriority.keys()].at(-1) ?? '';
    const isHighestRole = currentUserRoles.includes(highestRole);
    if (isHighestRole) {
      return true;
    }

    const isAdmin = currentUserRoles.some((r) => r === ROLE.ADMIN);

    if (!isAdmin) {
      return false;
    }

    const adminPriority = this.rolePriority.get(ROLE.ADMIN) ?? -1;

    if (rolePriority >= adminPriority) {
      return false;
    }

    const targetUserMax = this.getMaxRolePriority(targetUserRoles);
    return targetUserMax < adminPriority;
  }

  public getRoleHierarchy(): Observable<{ name: string; priority: number }[]> {
    return this.http
      .get<{ name: string; priority: number }[]>(`${ENVIRONMENT.API_URL}${ENDPOINTS.ROLES}/${ENDPOINTS.HIERARCHY}`)
      .pipe(
        tap((hierarchy) => {
          this.rolePriority = new Map(hierarchy.map((role) => [role.name, role.priority]));
        }),
      );
  }

  public hasAccess(userRoles: string[], requiredRole?: string): boolean {
    if (!requiredRole) {
      return true;
    }
    const requiredPriority = this.rolePriority?.get(requiredRole);

    if (requiredPriority === undefined) {
      return false;
    }

    const result = userRoles.some(
      (role) =>
        this.rolePriority?.get(role) &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.rolePriority.get(role)! >= requiredPriority,
    );

    return result;
  }

  public isAllowedToBeDeleted(currentUserRoles: string[], targetUserRoles: string[]): boolean {
    const currentUserMax = this.getMaxRolePriority(currentUserRoles);
    const targetUserMax = this.getMaxRolePriority(targetUserRoles);

    return currentUserMax > targetUserMax;
  }

  public removeRoleFromUser(userId: number, roleName: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(
      `${ENVIRONMENT.API_URL}${ENDPOINTS.USERS}/${userId.toString()}/${ENDPOINTS.ROLES}/${roleName}`,
      {},
    );
  }
}
