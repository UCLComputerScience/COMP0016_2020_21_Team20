import querystring from 'querystring';

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

const updateUserAttribute = async ({
  userId,
  departmentId,
  hospitalId,
  healthBoardId,
} = {}) => {
  let attributeToAdd;
  if (typeof healthBoardId !== 'undefined') {
    attributeToAdd = { health_board_id: healthBoardId };
  } else if (typeof hospitalId !== 'undefined') {
    attributeToAdd = { hospital_id: hospitalId };
  } else if (typeof departmentId !== 'undefined') {
    attributeToAdd = { department_id: departmentId };
  }

  const accessToken = await getAdminAccessToken();
  const status = await fetch(
    `${process.env.KEYCLOAK_ADMIN_USERS_URL}/${userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${accessToken}`,
      },
      body: JSON.stringify({ attributes: attributeToAdd }),
    }
  ).then(res => res.status);

  return status === 204;
};

export default updateUserAttribute;
