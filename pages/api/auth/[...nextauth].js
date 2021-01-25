import NextAuth from 'next-auth';

import {
  handleUserAttemptLogin,
  handleUserSuccessfulLogin,
  handleUserLogout,
  getUserProfile,
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
        token.accessToken = account.accessToken;
        token.sub = account.sub;
      }
      return token;
    },
    session: async (session, user) => {
      const profile = await getUserProfile(user.accessToken);
      if (!profile || profile.error) {
        console.error('Error fetching user profile', profile);
        session.roles = [Roles.USER_TYPE_UNKNOWN];
        return session;
      }

      // TODO move this to session.user.roles
      session.roles = profile.roles.filter(r =>
        Object.values(Roles).includes(r)
      );
      if (!session.roles.length) session.roles = [Roles.USER_TYPE_UNKNOWN];

      session.user.userId = profile.sub;
      session.user.departmentId = profile.department_id;
      session.user.hospitalId = profile.hospital_id;
      session.user.healthBoardId = profile.health_board_id;
      return session;
    },
    signIn: async (user, account, profile) =>
      handleUserAttemptLogin(user, account, profile),
  },
  events: {
    signIn: async message => handleUserSuccessfulLogin(message),
    signOut: async message => handleUserLogout(message.accessToken), // Make sure all their sessions are killed in Keycloak
  },
  pages: { error: '/' },
};

export default (req, res) => NextAuth(req, res, options);
