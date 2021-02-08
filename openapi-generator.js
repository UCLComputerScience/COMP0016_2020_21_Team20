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
    components: {
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
