export default {
  // Backend
  KEYCLOAK_ADMIN_USERS_URL: `${process.env.BASE_KEYCLOAK_ADMIN_URL}/admin/realms/${process.env.KEYCLOAK_REALM_NAME}/users`,
  KEYCLOAK_ADMIN_ACCESS_TOKEN_URL: `${process.env.BASE_KEYCLOAK_ADMIN_URL}/realms/master/protocol/openid-connect/token`,
  KEYCLOAK_BASE_AUTH_URL: `${process.env.BASE_KEYCLOAK_CLIENT_URL}/realms/${process.env.KEYCLOAK_REALM_NAME}/protocol/openid-connect`,

  // Frontend
  KEYCLOAK_USER_ACCOUNT_MANAGE_URL:
    process.env.NEXT_PUBLIC_KEYCLOAK_USER_ACCOUNT_MANAGE_URL,
};
