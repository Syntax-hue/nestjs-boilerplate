import { RolesBuilder } from 'nest-access-control';
import { RolesBuilderService } from './roles-builder/roles-builder.service';

export const APP_RESOURCES = [
  {
    name: 'Users',
    value: 'users'
  },
  {
    name: 'Roles',
    value: 'roles'
  },
  {
    name: 'Notifications',
    value: 'notifications'
  },
  {
    name: 'News',
    value: 'news'
  }
]

export async function createRolesFactory(rolesBuilderService: RolesBuilderService): Promise<RolesBuilder> {
  const actions = ['read', 'create', 'update', 'delete']

  // Creating the ADMIN role with all resources and all permission
  // Every time app starts, it will make sure that ADMIN have all permission
  const defaultAdminRole = {
    roleName: 'ADMIN',
    resources: APP_RESOURCES.map(resource => ({
      name: resource.value,
      ...actions.reduce((obj, item) => ({ ...obj, [item]: { name: 'any', attributes: '*' } }), {})
    }))
  };
  const defaultAdminRoleModel = new rolesBuilderService.rolesModel(defaultAdminRole);
  const doesAdminRoleExists = await rolesBuilderService.rolesModel.findOne({ roleName: 'ADMIN' });
  doesAdminRoleExists
    ? await rolesBuilderService.rolesModel.replaceOne({ roleName: 'ADMIN' }, defaultAdminRole)
    : await rolesBuilderService.create(defaultAdminRoleModel);

  const dbRoles = await rolesBuilderService.getAll();
  const roles = [];
  dbRoles.forEach(roleEntity => {
    roleEntity.resources.forEach(resource => {
      actions.forEach(action => {
        if (resource[action]) {
          roles.push({
            role: roleEntity.roleName,
            resource: resource.name,
            action: `${action}:${resource[action].name}`,
            attributes: resource[action].attributes
          })
        }
      })
    })
  })
  return new RolesBuilder(roles);
}

export enum AppRoles {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}
