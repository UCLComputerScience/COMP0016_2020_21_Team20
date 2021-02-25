import OpenAPIResponseValidator from 'openapi-response-validator';
import client from 'next-auth/client';

import openApiSchema from './openApiSchema';
import { Roles } from '../../lib/constants';

const getOpenApiValidatorForRequest = (endpoint, method = 'get') => {
  const expectedSchema = { ...openApiSchema };
  expectedSchema.responses =
    expectedSchema.responses[endpoint][method].responses;
  const validator = new OpenAPIResponseValidator(expectedSchema);

  return validator;
};

const mockSessionWithUserType = userType => {
  let mockSession = Object.values(Roles).includes(userType)
    ? {
        expires: '1',
        user: {
          email: `${userType}@example.com`,
          name: userType,
          image: null,
          roles: [userType],
        },
      }
    : null;

  switch (userType) {
    case Roles.USER_TYPE_CLINICIAN: {
      mockSession.user.userId = 'clinician';
      mockSession.user.departmentId = 1;
    }
    case Roles.USER_TYPE_HOSPITAL: {
      mockSession.user.userId = 'hospital';
      mockSession.user.hospitalId = 1;
    }
    case Roles.USER_TYPE_HEALTH_BOARD: {
      mockSession.user.userId = 'health_board';
      mockSession.user.healthBoardId = 1;
    }
  }
  client.useSession.mockReturnValue([mockSession, false]);
  client.getSession.mockReturnValue(mockSession);
};

module.exports = { getOpenApiValidatorForRequest, mockSessionWithUserType };
