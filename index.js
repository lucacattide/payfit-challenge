// Module Start
// PayFit Challenge
/**
 * Create a list of all paths and their minimum access level
 * @param {Array<Object>} Registry array of routes
 * @returns {Array<Object>} modified registry
 */
const getAllPaths = (registry) => {
  return [
    ...registry.map((location) => {
      const path = [location.path]; // Keep track of each path level
      let level = location.level;
      let locationParent = registry
      .find((parent) => parent.path === location.parent);

      // Parent existing check
      if (locationParent) {
        path.push(locationParent.path);

        // Update level only if the parent one is higher
        level = locationParent.level > level ? locationParent.level : level;

        // Recursively parent existing check
        if (locationParent.parent) {
          locationParent = registry
          .find((parent) => parent.path === locationParent.parent);

          path.push(locationParent.path);

          // Update level only if the parent one is higher
          level = locationParent.level > level ? locationParent.level : level;
        }
      }

      return {
        absolutePath: path.reverse().join('').replace('//', '/'), // Format & remove extra starting slashes
        level: level
      };
    })
  ];
}

/**
 * Check accessibilty for a user
 * @param {Object} User { name: string, level: number }
 * @param {String} Path path to check
 * @param {Array<Object>} ModifiedRegistry getAllPaths() result
 * @returns {Boolean} if the user has acces
 */
const hasAccess = (user, path, paths) => {
  const currentPath = paths.find((location) => location.absolutePath === path);
  const access = user.level >= currentPath.level;
  let parentPath = null;

  // User access check
  if (access) {
    // Parent existing check
    if (currentPath.parent) {
      parentPath = paths.find((parent) => parent.absolutePath === currentPath.parent);

      // Recursively parent existing check
      if (parentPath) {
        hasAccess(user, parentPath.path, paths);
      }
    }
  }

  return access;
}

/**
 * Get all paths a user has access too
 * @param {Object} User { name: string, level: number }
 * @param {Array<Object>} ModifiedRegistry getAllPaths() result
 * @returns {Array<Object>} filtered array of routes
 */
const getUserPaths = (user, paths) => {
  return paths.filter((location) => hasAccess(user, location.absolutePath, paths));
}

// Module export
module.exports = {
  getAllPaths,
  hasAccess,
  getUserPaths
}
// Module End
