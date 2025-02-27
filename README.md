# OHD-RCON-UI

## Running OHD-RCON-UI

- Todo

## Running Locally for Development

> [!CAUTION]
> This setup uses default credentials designed for local development.
> If someone finds the IP to your instance and it's configured as-is
> and connected to OHD servers, your servers **WILL** be compromised.

### Pre-requisites:

- [Docker](https://www.docker.com/)
- [NodeJS v22.14.0+](https://nodejs.org/en)

### Running Locally

1. Enable Yarn

```bash
corepack enable yarn
```

2. Install Dependencies

```bash
yarn install
```

3. Set up the Database

```bash
docker compose -f docker-compose.yml --profile local up
```

4. Setup the ENV

Copy the env example at `/apps/backend/.env.example` to `/apps/backend/.env`

```bash
cp ./apps/backend/.env.example ./apps/backend/.env
```

5. Start the application

```bash
yarn dev
```
