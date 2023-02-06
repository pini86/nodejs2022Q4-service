# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/pini86/nodejs2022Q4-service.git
```

## Installing NPM modules

```
npm install
```

## Switch to 'rest-service' branch

```
git switch rest-service
```

## Set HTTP port value (if necessary)

```
Rename '.env.example' to '.env' and set new value of PORT (4000 as default)
```

## Running application

```
npm run start
```

## Running application in developer mode

```
npm run start:dev
```

## Use OpenAPI/Swagger

```
After starting the app on port (4000 as default) you can open
in browser OpenAPI/Swagger documentation by route http://localhost:4000/doc/.
```

## Testing

After application running open new terminal and enter:

To run all tests

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
