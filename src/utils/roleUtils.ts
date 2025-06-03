import isArray from "lodash/isArray";
import some from "lodash/some";
import isPlainObject from "lodash/isPlainObject";
import isString from "lodash/isString";
import { PERMISSION_VALUE, ROLE_TYPE } from "constants/role";
import { TUser } from "types/User";

/* nhận string - mãng string - object */
export const isMatchRoles = (roles: any = {}, isSupperAdmin?: boolean) => {
  if (isSupperAdmin) {
    return true;
  }

  switch (true) {
    case isString(roles): {
      return [PERMISSION_VALUE.READ, PERMISSION_VALUE.READ_AND_WRITE].includes(roles as ROLE_TYPE);
    }
    case isArray(roles): {
      return some(roles, (item: ROLE_TYPE) =>
        [PERMISSION_VALUE.READ, PERMISSION_VALUE.READ_AND_WRITE].includes(item),
      );
    }
    case isPlainObject(roles): {
      return some(Object.values(roles), (item: ROLE_TYPE) =>
        [PERMISSION_VALUE.READ, PERMISSION_VALUE.READ_AND_WRITE].includes(item),
      );
    }
    default:
      return false;
  }
};

export const checkPermission = (role: ROLE_TYPE, user: Partial<TUser> | null) => {
  let isRead = false;
  let isReadAndWrite = false;
  let isMatch = false;

  if (user?.is_superuser || role === PERMISSION_VALUE.READ_AND_WRITE) {
    isReadAndWrite = true;
    isMatch = true;
    isRead = true;
  } else if (isMatchRoles(role, user?.is_superuser)) {
    isMatch = true;
    isRead = true;
  }
  return { isRead, isReadAndWrite, isMatch };
};
