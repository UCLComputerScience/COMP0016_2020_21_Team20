import fs from 'fs';

// Store openApiSchema globally
const openApiSchema = JSON.parse(
  fs.readFileSync('care-quality-dashboard-api.json', 'utf-8')
);
openApiSchema.responses = openApiSchema.paths;
openApiSchema.definitions = openApiSchema.components;
delete openApiSchema.openapi;
delete openApiSchema.info;
delete openApiSchema.servers;
delete openApiSchema.security;
delete openApiSchema.tags;
delete openApiSchema.paths;
delete openApiSchema.components;

export default openApiSchema;
