import OpenAPIResponseValidator from 'openapi-response-validator';
import openApiSchema from './openApiSchema';

const getOpenApiValidatorForRequest = (endpoint, method = 'get') => {
  const expectedSchema = { ...openApiSchema };
  expectedSchema.responses =
    expectedSchema.responses[endpoint][method].responses;
  const validator = new OpenAPIResponseValidator(expectedSchema);

  return validator;
};

module.exports = { getOpenApiValidatorForRequest };
