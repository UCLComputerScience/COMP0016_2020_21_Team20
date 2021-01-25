import { Button, Message } from 'rsuite';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';

import { Header, LoginMessage } from '../../components';

import setUserDepartmentAndRole from '../../lib/setUserDepartmentAndRole';
import prisma from '../../lib/prisma';
import { Roles } from '../../lib/constants';

export const getServerSideProps = async context => {
  const { params } = context.query;
  const [type, joinCode] = params;

  if (
    ![Roles.USER_TYPE_CLINICIAN, Roles.USER_TYPE_DEPARTMENT].includes(type) ||
    !joinCode
  ) {
    return { notFound: true };
  }

  // User must have no role to be able to join a department
  const session = await getSession(context);
  if (!session || session.roles[0] !== Roles.USER_TYPE_UNKNOWN) {
    return { props: { session } };
  }

  const dbTable =
    type === Roles.USER_TYPE_DEPARTMENT
      ? prisma.department_join_codes
      : prisma.clinician_join_codes;

  const department = await dbTable.findFirst({ where: { code: joinCode } });

  if (!department) return { props: { invalidCode: true } };

  const success = await setUserDepartmentAndRole({
    departmentId: department.department_id,
    userId: session.user.userId,
    newUserType: type,
  });

  return { props: { success, session } };
};

function Join({ session, ...props }) {
  const router = useRouter();

  if (!session) {
    return (
      <div>
        <Header session={session} />
        <LoginMessage />
      </div>
    );
  }

  if (props.success === true) {
    return (
      <>
        <Header session={session} />
        <Message
          style={{ margin: 'auto', width: '50%', textAlign: 'center' }}
          type="success"
          title="Successfully joined department"
          description={
            <p>
              You have successfully joined the department!
              <br />
              <br />
              <Button appearance="primary" onClick={() => router.push('/')}>
                Click here to go back to the homepage
              </Button>
            </p>
          }></Message>
      </>
    );
  }

  return (
    <div>
      <Header session={session} />
      {session.roles[0] !== Roles.USER_TYPE_UNKNOWN &&
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
