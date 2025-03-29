import type { BaseTagFragment } from '../generated/graphql';
import useUserId from './useUserId';

export const hasPermission = (
  userId: string,
  entity: {
    user?: { _id: string };
    tags: Array<Pick<BaseTagFragment, 'user' | 'permissions'>>;
  },
  resource: 'tag' | 'notes',
  mode: string
): boolean => {
  if (entity.user?._id === userId) {
    return true;
  }
  return entity.tags.some((tag) => {
    if (entity.user && tag.permissions.length === 1) {
      return false;
    }

    const userPermissions = tag.permissions.find(
      (permission) => permission.user._id === userId
    );

    if (!userPermissions) {
      console.error(
        `[useHasPermissions] User '${userId}' has no permissions on entity.`
      );
      return false;
    }

    if (!(mode in userPermissions[resource])) {
      console.error(
        `[useHasPermissions] No such mode '${mode}' on resource '${resource}'`,
        userPermissions[resource]
      );
      return false;
    }

    return userPermissions[resource][mode] as boolean;
  });
};

const useHasPermission = (
  entity: {
    tags: Array<Pick<BaseTagFragment, 'user' | 'permissions'>>;
  },
  resource: 'tag' | 'notes',
  mode: string
): boolean => {
  const userId = useUserId();
  return hasPermission(userId, entity, resource, mode);
};

export default useHasPermission;
