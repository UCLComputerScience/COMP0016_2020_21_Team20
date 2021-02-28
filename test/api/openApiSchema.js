import fs from 'fs';
import $RefParser from '@apidevtools/json-schema-ref-parser';

const openApiSchema = JSON.parse(
  fs.readFileSync('care-quality-dashboard-api.json', 'utf-8')
);
openApiSchema.responses = openApiSchema.paths;
delete openApiSchema.openapi;
delete openApiSchema.info;
delete openApiSchema.servers;
delete openApiSchema.security;
delete openApiSchema.tags;
delete openApiSchema.paths;

let dereferencedOpenApiSchema;
export default async () => {
  // Dereference OpenAPI schema -- we only need to do this because openapi-response-validator
  // doesn't always follow references correctly according to the spec, so dereferencing it
  // to 'inline' references is the only way to make it work.
  // See https://github.com/kogosoftwarellc/open-api/issues/483 bug report.
  if (!dereferencedOpenApiSchema) {
    dereferencedOpenApiSchema = await $RefParser.dereference(openApiSchema);
    delete dereferencedOpenApiSchema.components;
  }

  // Return clone of schema
  return Object.assign({}, dereferencedOpenApiSchema);
};
