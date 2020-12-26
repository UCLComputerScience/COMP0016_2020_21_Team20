import prisma from './prisma';
import updateUserAttribute from './updateUserAttribute';

// TODO also update keycloak role
const setUserDepartment = async ({ session, departmentId, newUserType }) => {
  const results = await Promise.all([
    updateUserAttribute({ userId: session.user.userId, departmentId }),
    prisma.users.update({
      data: { user_type: newUserType },
      where: { id: session.user.userId },
    }),
  ]);

  return results && results.every(r => !!r);
};

export default setUserDepartment;
