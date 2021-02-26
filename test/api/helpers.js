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

const mockSessionWithUserType = (userType, entityId = 1) => {
  let mockSession = Object.values(Roles).includes(userType)
    ? {
        expires: '1',
        user: {
          email: `${userType}@example.com`,
          name: userType,
          image: null,
          roles: [userType],
          userId: userType,
        },
      }
    : null;

  switch (userType) {
    case Roles.USER_TYPE_CLINICIAN: {
      mockSession.user.departmentId = entityId;
      break;
    }
    case Roles.USER_TYPE_DEPARTMENT: {
      mockSession.user.departmentId = entityId;
      break;
    }
    case Roles.USER_TYPE_HOSPITAL: {
      mockSession.user.hospitalId = entityId;
      break;
    }
    case Roles.USER_TYPE_HEALTH_BOARD: {
      mockSession.user.healthBoardId = entityId;
      break;
    }
  }
  client.useSession.mockReturnValue([mockSession, false]);
  client.getSession.mockReturnValue(mockSession);
};

module.exports = { getOpenApiValidatorForRequest, mockSessionWithUserType };
