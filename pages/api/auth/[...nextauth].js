import NextAuth from 'next-auth';

import {
  handleUserAttemptLogin,
  handleUserSuccessfulLogin,
  handleUserLogout,
} from '../../../lib/handleUserAuthEvents';

import config from '../../../lib/config';
import { Roles } from '../../../lib/constants';

const options = {
  providers: [
    {
      id: 'keycloak',
      name: 'Keycloak',
      params: { grant_type: 'authorization_code' },
      scope: 'openid roles',
      type: 'oauth',
      version: '2.0',
      accessTokenUrl: `${config.KEYCLOAK_BASE_AUTH_URL}/token`,
      authorizationUrl: `${config.KEYCLOAK_BASE_AUTH_URL}/auth?response_type=code`,
      clientId: process.env.CLIENT_ID,
      profileUrl: `${config.KEYCLOAK_BASE_AUTH_URL}/userinfo`,
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
        token.department_id = profile.department_id;
        token.hospital_id = profile.hospital_id;
        token.health_board_id = profile.health_board_id;
        token.roles = profile.roles.filter(r =>
          Object.values(Roles).includes(r)
        );

        if (!token.roles.length) token.roles = [Roles.USER_TYPE_UNKNOWN];
      }
      return token;
    },
    session: async (session, user) => {
      // TODO move this to session.user.roles
      session.roles = user.roles;
      session.user.userId = user.sub;
      session.user.departmentId = user.department_id;
      session.user.hospitalId = user.hospital_id;
      session.user.healthBoardId = user.health_board_id;
      return session;
    },
    signIn: async (user, account, profile) =>
      handleUserAttemptLogin(user, account, profile),
  },
  events: {
    signIn: async message => handleUserSuccessfulLogin(message),
    signOut: async message => handleUserLogout(message.sub), // Make sure all their sessions are killed in Keycloak
  },
  pages: { error: '/' },
};

export default (req, res) => NextAuth(req, res, options);
