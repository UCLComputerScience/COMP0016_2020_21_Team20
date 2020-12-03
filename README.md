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

## Database

We use [Prisma](https://www.prisma.io/) as an ORM to interact with a [PostgreSQL database](http://postgresql.org/).

The SQL Schema can be found in [`schema.sql`](./schema.sql).

Make sure you have a `.env` file in [`./prisma`](./prisma) with the `DATABASE_URL` property set to the [PostgreSQL connection URL](https://www.prisma.io/docs/concepts/database-connectors/postgresql).

To introspect the PostgreSQL database and generate a Prisma Schema, run the following command:

```bash
npx prisma introspect
```

This should generate the [`./prisma/schema.prisma`](./prisma/schema.prisma) file, based on the SQL database schema.

Finally, to generate the Prisma Client, for use in our code, run:

```bash
npx prisma generate
```

This will generate the database-specific Prisma Client into `./node_modules/@prisma/client`.

See the [Prisma docs](https://www.prisma.io/docs/) for more detailed information and the API reference.
