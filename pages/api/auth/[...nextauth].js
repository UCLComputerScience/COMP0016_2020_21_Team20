import NextAuth from 'next-auth';

import {
  handleUserAttemptLogin,
  handleUserSuccessfulLogin,
  handleUserLogout,
  getUserProfile,
} from '../../../lib/handleUserAuthEvents';

import config from '../../../lib/config';
import { Roles } from '../../../lib/constants';

/**
 * NextAuth.js is used to allow authentication between the web-app and the Keycloak instance
 * via OAuth 2.0.
 *
 * This module contains all the configuration for NextAuth.js.
 *
 * A custom provider is used to configure NextAuth.js to interact with the local Keycloak instance;
 * if the instance location changes, the .env file should be updated to reflect this.
 *
 * The following callbacks are also used:
 * - `jwt`: to add the refresh token, access token, and user ID to the token on first login.
 * - `session`: to fetch the latest user roles and IDs (user, department/hospital/health board)
 * from Keycloak whenever the session object is used throughout the codebase.
 * - `signIn`: to check whether a user's department has been archived, and inform them if so.
 *
 * The following events are also used:
 * - `signIn`: to ensure the platform's own database has the latest user type and ID for the user.
 * This is mainly used when the user logs in for the first time, so the database is made aware
 * that they exist so that responses etc. can then be tied to their ID.
 * - `signOut`: to destroy the user's Keycloak session so they aren't automatically logged back
 * in next time they try to login, without entering their credentials first.
 *
 * The homepage (pages/index.js) has a map of possible errors and how they should be rendered to
 * the user based on the error code.
 */
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
      // Store user's refresh token, access token and ID whenever they login each session
      if (profile) {
        token.refreshToken = account.refreshToken;
        token.accessToken = account.accessToken;
        token.sub = account.sub;
      }
      return token;
    },
    session: async (session, user) => {
      // Fetch user's latest information from Keycloak
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
      // Check if their department has been archived.
      // If so, cancel login, redirect to homepage with error query parameter
      console.log('User attempting log in');
      return await handleUserAttemptLogin(user, account, profile);
    },
  },
  events: {
    signIn: async message => {
      // Ensure their ID and latest user type is stored in our database, fetched from Keycloak
      console.log('User logged in successfully');
      return await handleUserSuccessfulLogin(message);
    },
    signOut: async message => {
      // Destroy user's Keycloak session
      console.log('User signing out');
      return await handleUserLogout(message.accessToken, message.refreshToken);
    },
  },
  pages: { error: '/' },
};

export default (req, res) => NextAuth(req, res, options);
