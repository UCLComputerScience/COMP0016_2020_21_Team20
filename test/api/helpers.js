import OpenAPIResponseValidator from 'openapi-response-validator';
import openApiSchema from './openApiSchema';
import client from 'next-auth/client';

const getOpenApiValidatorForRequest = (endpoint, method = 'get') => {
  const expectedSchema = { ...openApiSchema };
  expectedSchema.responses =
    expectedSchema.responses[endpoint][method].responses;
  const validator = new OpenAPIResponseValidator(expectedSchema);

  return validator;
};

const mockSessionWithUserType = userType => {
  let mockSession = null;
  switch (userType) {
    case 'clinician': {
      mockSession = {
        expires: '1',
        user: { email: `${userType}@example.com`, name: userType, image: null },
      };
    }
  }
  client.useSession.mockReturnValue([mockSession, false]);
  client.getSession.mockReturnValue(mockSession);
};

module.exports = { getOpenApiValidatorForRequest, mockSessionWithUserType };
