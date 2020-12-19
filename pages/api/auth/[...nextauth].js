import NextAuth from 'next-auth';
import handleUserLogin from '../../../lib/handleUserLogin';

import roles from '../../../lib/roles';

const options = {
  providers: [
    {
      id: 'keycloak',
      name: 'Keycloak',
      params: { grant_type: 'authorization_code' },
      scope: 'openid roles',
      type: 'oauth',
      version: '2.0',
      accessTokenUrl: `${process.env.BASE_AUTH_URL}/token`,
      authorizationUrl: `${process.env.BASE_AUTH_URL}/auth?response_type=code`,
      clientId: process.env.CLIENT_ID,
      profileUrl: `${process.env.BASE_AUTH_URL}/userinfo`,
      profile: profile => {
        return {
          id: profile.sub,
          name: profile.preferred_username,
        };
      },
    },
  ],
  callbacks: {
    jwt: async (token, user, account, profile, isNewUser) => {
      if (profile) {
        token.sub = profile.sub;
        token.roles = profile.roles.filter(r =>
          Object.values(roles).includes(r)
        );
      }
      return token;
    },
    session: async (session, user) => {
      session.roles = user.roles;
      session.user.userId = user.sub;
      return session;
    },
  },
  events: {
    signIn: async message => handleUserLogin(message),
  },
};

export default (req, res) => NextAuth(req, res, options);
