import querystring from 'querystring';

import prisma from './prisma';
import roles from './roles';

const getAdminAccessToken = async () => {
  const res = await fetch(process.env.KEYCLOAK_ADMIN_ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: querystring.stringify({
      client_id: 'admin-cli',
      username: process.env.KEYCLOAK_USER,
      password: process.env.KEYCLOAK_PASSWORD,
      grant_type: 'password',
    }),
  }).then(res => res.json());

  return res.access_token;
};

// Helper function to perform REST API requests using access token
const fetchWithAuth = (url, accessToken, { method, body } = {}) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${accessToken}`,
    },
  };

  if (method) options.method = method;
  if (body) options.body = body;
  return fetch(url, options);
};

const updateUserAttribute = async ({
  userId,
  departmentId,
  hospitalId,
  healthBoardId,
  accessToken,
} = {}) => {
  let attributeToAdd;
  if (typeof healthBoardId !== 'undefined') {
    attributeToAdd = { health_board_id: healthBoardId };
  } else if (typeof hospitalId !== 'undefined') {
    attributeToAdd = { hospital_id: hospitalId };
  } else if (typeof departmentId !== 'undefined') {
    attributeToAdd = { department_id: departmentId };
  }

  const status = await fetchWithAuth(
    `${process.env.KEYCLOAK_ADMIN_USERS_URL}/${userId}`,
    accessToken,
    {
      method: 'PUT',
      body: JSON.stringify({ attributes: attributeToAdd }),
    }
  ).then(res => res.status);

  return status === 204;
};

const setUserRole = async ({ userId, role, accessToken } = {}) => {
  const availableRoles = await fetchWithAuth(
    `${process.env.KEYCLOAK_ADMIN_USERS_URL}/${userId}/role-mappings/realm/available`,
    accessToken
  ).then(res => res.json());

  const assignedRoles = await fetchWithAuth(
    `${process.env.KEYCLOAK_ADMIN_USERS_URL}/${userId}/role-mappings/realm/composite`,
    accessToken
  ).then(res => res.json());

  if (assignedRoles.find(r => r.name === role)) {
    // Role already exists, break out
    return true;
  }

  // Delete all the existing roles from the user
  const rolesToDelete = assignedRoles.filter(r =>
    Object.values(roles).includes(r.name)
  );
  const roleToAdd = availableRoles.find(r => r.name === role);

  if (!roleToAdd) {
    console.warn(`Role ${role} not found`);
    return false;
  }

  // Store all the HTTP Keycloak REST API requests to make
  const requests = [];
  requests.push(
    fetchWithAuth(
      `${process.env.KEYCLOAK_ADMIN_USERS_URL}/${userId}/role-mappings/realm`,
      accessToken,
      { method: 'DELETE', body: JSON.stringify(rolesToDelete) }
    ).then(res => res.status)
  );

  requests.push(
    fetchWithAuth(
      `${process.env.KEYCLOAK_ADMIN_USERS_URL}/${userId}/role-mappings/realm`,
      accessToken,
      { method: 'POST', body: JSON.stringify([roleToAdd]) }
    ).then(res => res.status)
  );

  // Perform all the requests together
  const statuses = await Promise.all(requests);
  return statuses.every(s => s === 204);
};

const setUserDepartmentAndRole = async ({
  session,
  departmentId,
  newUserType,
}) => {
  const accessToken = await getAdminAccessToken();
  const results = await Promise.all([
    updateUserAttribute({
      userId: session.user.userId,
      departmentId,
      accessToken,
    }),
    setUserRole({
      userId: session.user.userId,
      role: newUserType,
      accessToken,
    }),
    prisma.users.update({
      data: { user_type: newUserType },
      where: { id: session.user.userId },
    }),
  ]);

  return results && results.every(r => !!r);
};

export default setUserDepartmentAndRole;