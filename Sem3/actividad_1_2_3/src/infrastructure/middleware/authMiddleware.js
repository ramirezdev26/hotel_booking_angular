/**
 * Authentication middleware for protecting routes using Keycloak
 */

const authMiddleware = (keycloak) => {
  return {
    /**
     * Protect routes requiring authentication
     * @returns Keycloak protect middleware
     */
    protect: () => keycloak.protect(),

    /**
     * Protect routes requiring specific role
     * @param {string} role - Role required to access the route
     * @returns Keycloak protect middleware with role check
     */
    protectWithRole: (role) => keycloak.protect(role),

    /**
     * Enforce specific resource permissions
     * @param {string|Array} permissions - Permission(s) required
     * @param {Object} options - Configuration options
     * @returns Keycloak enforcer middleware
     */
    enforcePermissions: (permissions, options = {}) => keycloak.enforcer(permissions, options)
  };
};

export default authMiddleware;
