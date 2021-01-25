import querystring from 'querystring';

import config from './config';

const getAdminAccessToken = async () => {
  const res = await fetch(config.KEYCLOAK_ADMIN_ACCESS_TOKEN_URL, {
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

export default getAdminAccessToken;
