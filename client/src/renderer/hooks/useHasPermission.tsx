import { BaseTagFragment } from '../generated/graphql';
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
      throw Error(
        `[useHasPermissions] User '${userId}' has no permissions on entity.`
      );
    }

    if (!(mode in userPermissions[resource])) {
      console.error(userPermissions[resource]);
      throw Error(
        `[useHasPermissions] No such mode '${mode}' on resource '${resource}'`
      );
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
