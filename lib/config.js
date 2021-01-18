export default {
  KEYCLOAK_ADMIN_USERS_URL: `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM_NAME}/users`,
  KEYCLOAK_ADMIN_ACCESS_TOKEN_URL: `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/master/protocol/openid-connect/token`,
  KEYCLOAK_USER_ACCOUNT_MANAGE_URL: `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM_NAME}/account`,
  KEYCLOAK_BASE_AUTH_URL: `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM_NAME}/protocol/openid-connect`,
};
