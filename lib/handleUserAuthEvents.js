import prisma from './prisma';
import { Roles } from './constants';
import config from './config';
import setUserDepartmentAndRole from './setUserDepartmentAndRole';
import getAdminAccessToken from './getKeycloakAdminAccessToken';

const getUserType = userRoles => {
  if (userRoles.includes(Roles.USER_TYPE_DEPARTMENT)) {
    return Roles.USER_TYPE_DEPARTMENT;
  } else if (userRoles.includes(Roles.USER_TYPE_HEALTH_BOARD)) {
    return Roles.USER_TYPE_HEALTH_BOARD;
  } else if (userRoles.includes(Roles.USER_TYPE_HOSPITAL)) {
    return Roles.USER_TYPE_HOSPITAL;
  } else if (userRoles.includes(Roles.USER_TYPE_ADMIN)) {
    return Roles.USER_TYPE_ADMIN;
  } else if (userRoles.includes(Roles.USER_TYPE_CLINICIAN)) {
    return Roles.USER_TYPE_CLINICIAN;
  } else {
    return Roles.USER_TYPE_UNKNOWN;
  }
};

async function handleUserAttemptLogin(user, account, profile) {
  const userId = profile.sub;
  const isDepartmentArchived = profile.department_id
    ? await prisma.departments.count({
        where: {
          AND: [
            { id: { equals: profile.department_id } },
            { archived: { equals: true } },
          ],
        },
      })
    : false;

  if (isDepartmentArchived) {
    await setUserDepartmentAndRole({
      userId,
      newUserType: Roles.USER_TYPE_UNKNOWN,
    });

    return Promise.reject(new Error('departmentdeleted'));
  }

  return true;
}

async function handleUserSuccessfulLogin(message) {
  const { account } = message;
  const userinfo = await fetch(`${config.KEYCLOAK_BASE_AUTH_URL}/userinfo`, {
    headers: { Authorization: 'Bearer ' + account.accessToken },
  }).then(res => res.json());

  const userId = account.id;
  const userRoles = userinfo.roles;

  await prisma.users.upsert({
    create: {
      id: userId,
      user_type: getUserType(userRoles),
    },
    update: { user_type: getUserType(userRoles) },
    where: { id: userId },
  });
}

async function handleUserLogout(userId) {
  const accessToken = await getAdminAccessToken();
  const sessions = await fetch(
    `${config.KEYCLOAK_ADMIN_USERS_URL}/${userId}/sessions`,
    { headers: { Authorization: 'Bearer ' + accessToken } }
  ).then(res => res.json());

  const results = await Promise.all(
    sessions.map(s =>
      fetch(`${config.KEYCLOAK_ADMIN_SESSIONS_URL}/${s.id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + accessToken },
      }).then(res => res.status)
    )
  );

  return results.every(r => r === 204);
}

export { handleUserSuccessfulLogin, handleUserAttemptLogin, handleUserLogout };
