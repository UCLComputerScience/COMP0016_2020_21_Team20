# nhsw-self-assessment-tool

## Project Structure

This is a Next.js app:

- frontend pages belong in [`./pages/`](./pages)
- react components belong in [`./components/`](./components) and should be re-exported in [`./components/index.js`](./components/index.js)
- backend API routes belong in [`./pages/api/`](./pages/api)
- static files belong in [`./public`](./public)

Prettier and ESLint enforce code style. There is a pre-commit hook to auto-format code.

## Development

- Run `npm install` to make sure you have all dependencies installed
- Run `npm run dev` to start the web-app in development mode on `localhost:3000` -- hot reloading should be enabled by default
- Run `npm run build` to build the project (although, only really needed on deployment)
