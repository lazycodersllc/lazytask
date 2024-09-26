export const hasPermission = (userPermissions, requiredPermissions) => {
    if ((userPermissions ==='undefined' || !Array.isArray(userPermissions)) || !Array.isArray(requiredPermissions)) {
        // console.error('Invalid arguments: Expected arrays');
        return false;
    }
    return requiredPermissions.some(permission => userPermissions.includes(permission));
};
