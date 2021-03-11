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
    jwt: async (token, user, account, profile) => {
      if (profile) {
        token.refreshToken = account.refreshToken;
        token.accessToken = account.accessToken;
        token.sub = account.sub;
      }
      return token;
    },
    session: async (session, user) => {
      const profile = await getUserProfile(
        user.accessToken,
        user.refreshToken,
        user
      );
      if (!profile || profile.error) {
        console.error(
          'Error fetching user profile, returning null session',
          profile
        );
        return {};
      }

      session.user.roles = profile.roles.filter(r =>
        Object.values(Roles).includes(r)
      );
      if (!session.user.roles.length)
        session.user.roles = [Roles.USER_TYPE_UNKNOWN];

      session.user.userId = profile.sub;
      session.user.departmentId = profile.department_id;
      session.user.hospitalId = profile.hospital_id;
      session.user.healthBoardId = profile.health_board_id;
      return session;
    },
    signIn: async (user, account, profile) => {
      console.log('User attempting log in');
      return await handleUserAttemptLogin(user, account, profile);
    },
  },
  events: {
    signIn: async message => {
      console.log('User logged in successfully');
      return await handleUserSuccessfulLogin(message);
    },
    signOut: async message => {
      console.log('User signing out');
      return await handleUserLogout(message.accessToken, message.refreshToken); // Make sure all their sessions are killed in Keycloak
    },
  },
  pages: { error: '/' },
};

export default (req, res) => NextAuth(req, res, options);
