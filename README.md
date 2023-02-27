# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker and Docker compose [Download & install Docker](https://www.docker.com/products/docker-desktop/)


## Docker image pull command

```
docker pull pini86/nodejs2022q4-service
```

## Downloading repository

```
git clone https://github.com/pini86/nodejs2022Q4-service.git
```

## Switch to 'auth' branch

```
git switch auth
```

## Installing NPM modules

```
npm ci
```

## Set HTTP port value (if necessary)

```
Rename '.env.example' to '.env' and set new value of PORT (4000 as default), level of Logging (default 2 : ['log', 'error'])
```

## Running application

```
docker-compose up
```

## Stop application (you can also use 'CTRL+C')

```
docker-compose down
```

## Vulnerabilities scan for Node and Postgres

```
npm run scan:node
npm run scan:pg
```

## Use OpenAPI/Swagger

```
After starting the app on port (4000 as default) you can open
in browser OpenAPI/Swagger documentation by route http://localhost:4000/doc/.
```

## Testing

After application running open new terminal and enter:

To run all tests with authorization

```
docker-compose exec node npm run test:auth
```

## Auto-fix and format

```
docker-compose exec node npm run lint
```

```
docker-compose exec node npm run format
```
