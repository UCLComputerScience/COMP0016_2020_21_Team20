import prisma from './prisma';
import roles from './roles';

const getUserType = userRoles => {
  if (userRoles.includes(roles.USER_TYPE_DEPARTMENT)) {
    return roles.USER_TYPE_DEPARTMENT;
  } else if (userRoles.includes(roles.USER_TYPE_HEALTH_BOARD)) {
    return roles.USER_TYPE_HEALTH_BOARD;
  } else if (userRoles.includes(roles.USER_TYPE_HOSPITAL)) {
    return roles.USER_TYPE_HOSPITAL;
  } else if (userRoles.includes(roles.USER_TYPE_ADMIN)) {
    return roles.USER_TYPE_ADMIN;
  } else if (userRoles.includes(roles.USER_TYPE_CLINICIAN)) {
    return roles.USER_TYPE_CLINICIAN;
  } else {
    return roles.USER_TYPE_UNKNOWN;
  }
};

async function handleUserLogin(message) {
  const { account } = message;
  const userinfo = await fetch(`${process.env.BASE_AUTH_URL}/userinfo`, {
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

export default handleUserLogin;
