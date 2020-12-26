import { Header } from '../../components';

import { useSession, getSession, signOut } from 'next-auth/client';

import setUserDepartmentAndRole from '../../lib/setUserDepartmentAndRole';
import prisma from '../../lib/prisma';
import roles from '../../lib/roles';

export const getServerSideProps = async ctx => {
  const { params } = ctx.query;
  const [type, joinCode] = params;

  if (
    ![roles.USER_TYPE_CLINICIAN, roles.USER_TYPE_DEPARTMENT].includes(type) ||
    !joinCode
  ) {
    return { notFound: true };
  }

  // User must have no role to be able to join a department
  const session = await getSession(ctx);
  if (!session || session.roles[0] !== roles.USER_TYPE_UNKNOWN) {
    return { props: {} };
  }

  const dbTable =
    type === roles.USER_TYPE_DEPARTMENT
      ? prisma.department_join_codes
      : prisma.clinician_join_codes;

  const department = await dbTable.findFirst({ where: { code: joinCode } });

  if (!department) return { props: { invalidCode: true } };

  const success = await setUserDepartmentAndRole({
    departmentId: department.department_id,
    newUserType: type,
    session,
  });

  return { props: { success } };
};

function Join(props) {
  const [session, loading] = useSession(); // TODO use loading state better?

  if (!session) {
    return (
      <div>
        <Header />
        <p>Please login</p>
      </div>
    );
  }

  if (props.success === true) {
    setTimeout(() => signOut({ callbackUrl: '/' }), 5000);
  }

  return (
    <div>
      <Header />
      {session.roles[0] !== roles.USER_TYPE_UNKNOWN &&
        'You are not eligible to join a department at this time.'}
      {props.invalidCode &&
        'Your join code is invalid. Please ensure your code has not expired and is exactly as you were provided.'}
      {props.success === true &&
        'You have successfully joined the department. You will be redirected in 5 seconds.'}
      {props.success === false && 'There was an error joining the department.'}
    </div>
  );
}

export default Join;
