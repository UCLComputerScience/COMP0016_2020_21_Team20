const fs = require('fs');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Care Quality Dashboard REST API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://nhsw.sjain.dev/api',
      },
    ],
    security: [
      {
        cookieAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: '__Secure-next-auth.session-token',
        },
      },
      schemas: {
        error: {
          type: 'object',
          properties: {
            error: {
              type: 'boolean',
              default: true,
            },
            message: {
              type: 'string',
              example: 'Unauthorized access',
            },
          },
        },
        operationResult: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
          },
        },
      },
      examples: {
        unauthorized: {
          value: {
            error: true,
            message: 'Unauthorized access',
          },
        },
        internal_server_error: {
          value: {
            error: true,
            message:
              'An unexpected error occurred. Please try again later or contact the system administrator if the error persists.',
          },
        },
        invalid_question_id: {
          value: {
            error: true,
            message: 'Invalid Question ID provided',
          },
        },
        insufficient_permission: {
          value: {
            error: true,
            message: 'You do not have permission to modify question URLs',
          },
        },
      },
      responses: {
        unauthorized: {
          description: 'Unauthorized access',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/error',
              },
              examples: {
                unauthorized: {
                  $ref: '#/components/examples/unauthorized',
                },
              },
            },
          },
        },
        internal_server_error: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/error',
              },
              examples: {
                internal_server_error: {
                  $ref: '#/components/examples/internal_server_error',
                },
              },
            },
          },
        },
        invalid_question_id: {
          description: 'Invalid Question ID provided',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/error',
              },
              examples: {
                invalid_id: {
                  $ref: '#/components/examples/invalid_question_id',
                },
              },
            },
          },
        },
        insufficient_permission: {
          description:
            'Insufficient permission: the authenticated account is not of the correct user type for this operation.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/error',
              },
              examples: {
                invalid_id: {
                  $ref: '#/components/examples/insufficient_permission',
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./pages/api/**/*.js'],
};

const openapiSpec = swaggerJSDoc(options);
fs.writeFileSync(
  'care-quality-dashboard-api.json',
  JSON.stringify(openapiSpec, null, 2)
);
