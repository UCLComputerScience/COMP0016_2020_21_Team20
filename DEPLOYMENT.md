# Deployment

This document describes the deployment process for the Care Quality Dashboard.

Please ensure you have read the [ARCHITECTURE.md](./ARCHITECTURE.md) document before proceeding to deployment.

As this project is dockerised, the standard deployment process simply consists of building the web-app Docker image, pushing it to GitHub Packages and pulling it on the desired machine.

However, if you are provisioning a new server, you will need to perform a few more setup steps.

Whilst most Operating Systems that support Docker and Docker Compose should be compatible with the platform, this document will describe the setup for an Ubuntu (Linux) based server. It has only been tested on Ubuntu 20.04.2 LTS.

## Provisioning a new server

Standard Linux security configurations must be applied, which are out of the scope of this guide. Examples include disabling root SSH login, disabling password SSH login, restricting SSH login to public key authentication only, setting up a firewall, etc.

1. Install Docker and Docker Compose by following the official installation instructions:

- Docker: https://docs.docker.com/get-docker/
- Docker Compose: https://docs.docker.com/compose/install/

2. Install Caddy Server using the official installation instructions: https://caddyserver.com/docs/install

   Note: anything that can function as a reverse proxy server will suffice, however we recommend Caddy as it will handle HTTPS certificates automatically under-the-hood.

3. Create a new user `cqdashboard` (with minimal privileges)

4. Copy over the following files/directories to the root of `cqdashboard`'s home directory:

- [`docker-compose-prod.yml`](./docker-compose-prod.yml)
- [`schema.sql`](./schema.sql)
- [`setup-db.sh`](./setup-db.sh)
- [`Caddyfile`](./Caddyfile)
- [`keycloak/`](./keycloak) -- **note: you must also copy the secret `care_quality_dashboard_realm.json` file into this folder too**

5. Update the `Caddyfile` to e.g. change the hostname based on the domain name that will be serving the website.

6. Run `caddy run` to start the Web Server (ensure the firewall allows HTTPS/port 443 requests)

7. Run `docker-compose -f docker-compose-prod.yml up -d` to start the Docker Containers for the system

The platform should now be running and accessible at your specified domain name over HTTPS.

## Deploying to an already-configured server

### Setting up Continuous Deployment

This project has Continuous Integration and Continuous Deployment configured. In most cases, this should be used for deploying the system, with minimal manual changes on the server.

To configure Continuous Deployment, update the following [GitHub Secrets](https://docs.github.com/en/actions/reference/encrypted-secrets) for the repository:

- `HOST` -- the IP address of the server hosting the platform
- `KEY` -- the private key of the `cqdashboard` user on the server
- `NEXT_PUBLIC_KEYCLOAK_USER_ACCOUNT_MANAGE_URL` -- the URL for the user account manage page (e.g. `auth.cqdashboard.net/auth/realms/care_quality_dashboard/account`)

In addition, there are the following GitHub Secrets that may be configured if your setup requires:

- `DOCKER_COMPOSE_FILE` -- the name of the Docker Compose file on the server (e.g. `docker-compose-prod.yml`)
- `PORT` -- the SSH port for the server
- `USERNAME` -- the username of the Care Quality Dashboard-dedicated user on the server (with minimal privileges)

Once these are configured, the [`./github/workflows/deploy/yml`](./github/workflows/deploy/yml) GitHub Actions Workflow should automatically run on all pushes to the `main` branch, and will build the web-app docker image, publish to GitHub Packages for the `uclcomputerscience/comp0016_2020_21_team20/care-quality-dashboard-web` repository, and SSH into the server to restart the Docker containers.

**Note**: If the Docker Image repository is different, it must be changed in the GitHub Actions Workflow.

### Deploying manually

If you require to deploy manually, simply SSH into the server and run `docker-compose -f docker-compose-prod.yml pull && docker-compose -f docker-compose-prod.yml up -d --build` (replacing filenames as appropriate) to re-fetch the latest Docker image and start the containers.

**Note**: the Docker Compose file is configured to fetch the Docker Image from the `uclcomputerscience/comp0016_2020_21_team20/care-quality-dashboard-web` repository. If this is different it must be changed in the Docker Compose file.
