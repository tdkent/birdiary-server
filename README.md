<h1 align="center">Birdiary</h1>
<p align="center">A web-based application to track bird sightings and manage a birdwatching life list.</p>

## Description

A Node.js REST API built with TypeScript, NestJS and Prisma.

## Important Scripts

#### Project setup

```zsh
$ npm install
```

#### Compile and run the project

```zsh
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### Run tests

```zsh
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## Environment Variables

`PORT=3000`

`DATABASE_URL=<db connection string>`

`SHADOW_DATABASE_URL=<shadow db connection string>`

- Note: the "shadow" database is necessary part of the `prisma migrate dev` command. [More information](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database)

## Routes

### Routing Information

#### API Endpoints

Use either the `npm run start` or `npm run start:dev` scripts to initiate a local endpoint at port 3000. Use the following as _base_url_:

```
http://localhost:3000
```

#### Headers

All requests that include a request object should include `Content-Type: application/json` in the header.

#### Errors

Validation errors will return an error object with code `400 Bad Request` and a custom error message.

### Users

#### Create new user

```
POST base_url + '/users'

Request object:

{ email, name, password }
```

Validation

- `email`: Required. Must be a valid email.
- `password`: Required. Must be an 8-36 character string.
- `name`: Optional. Maximum 36 character string.

Response object

```
{ id, email, name, created_at, update_at}
```

#### Find all users

```
GET base_url + '/users/'
```

Response object

```
{ id, email, name, created_at, update_at }
```

#### Find user by id

```
GET base_url + '/users/:id'
```

Validation

- `id`: Route parameter. Must parse to integer type.

Response object

```
{ id, email, name, created_at, update_at }
```
