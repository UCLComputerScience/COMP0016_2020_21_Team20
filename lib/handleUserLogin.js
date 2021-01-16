import prisma from './prisma';
import roles from './roles';
import setUserDepartmentAndRole from './setUserDepartmentAndRole';

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

async function handleUserAttemptLogin(user, account, profile) {
  const userId = profile.sub;
  const isDepartmentArchived = await prisma.departments.count({
    where: {
      AND: [
        { id: { equals: profile.department_id } },
        { archived: { equals: true } },
      ],
    },
  });

  if (isDepartmentArchived) {
    await setUserDepartmentAndRole({
      userId,
      newUserType: roles.USER_TYPE_UNKNOWN,
    });
    return Promise.reject(
      new Error(
        'Your department was deleted from the system by your hospital. Please retry logging in, and request a new join URL to join a new department.'
      )
    );
  }

  return true;
}

async function handleUserSuccessfulLogin(message) {
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

export { handleUserSuccessfulLogin, handleUserAttemptLogin };
