<h1 align="center">Birdiary</h1>
<p align="center">A web-based application to track bird sightings and manage a birdwatching life list.</p>

## Description

This is a Node.js REST API built with TypeScript, NestJS and Prisma. The server handles requests to create and authenticate users and their birdwatching activities. The database stores user and bird sighting records, and general information about more than 800 North American bird species. The API routes, validates, and processes a variety of requests and queries to support the Birdiary client application.

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

All protected routes require a JWT token in the `Authorization` header of the request:

```
Authorization: Bearer <token>
```

The user's ID is extracted from the token to complete the request.

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

Behavior: A new row will be added to `User` and a related row to `Profile` representing the user's profile data.

Response object

```
{ id, email, name, created_at, update_at}
```

#### Find all users

```
GET base_url + '/users'
```

Response object

```
[
  {
    id,
    email,
    profile: {
      name,
      string,
      user_id
      },
    created_at,
    update_at
  }
]
```

#### Delete user

```
DELETE base_url + '/users'
```

Authorization

- Protected route. Requires token in `Authorization` header.

Behavior: Deletes `User` and related `Profile` table rows.

Response object

```
{ id }
```

#### Sign in user

```
POST base_url + '/users/auth/signin'

Request object:

{ email, password }
```

Validation

- `email`: Required. Must match a stored email.
- `password`: Required. Must match the stored email's password.

Response object

```
{ id, email, token}
```

#### Find user by id

```
GET base_url + '/users/profile'
```

Authorization

- Protected route. Requires token in `Authorization` header.

Response object

```
{
  id,
  email,
  profile: {
    name,
    string,
    user_id
    },
  created_at,
  update_at
}
```

#### Update user

```
PATCH base_url + '/users/profile'

Request object:

{ name, location }
```

Authorization

- Protected route. Requires token in `Authorization` header.

Validation

- `name`: Maximum 36 character string. Should be the same as the user's current name if the value is not being updated.
- `location`: Maximum 60 character string. Should be the same as the user's current location if the value is not being updated.

Response object

```
{ user_id, name, location }
```

#### Create/update favorite bird

```
PUT base_url + '/users/profile/fav?birdid=:id'
```

Authorization

- Protected route. Requires token in `Authorization` header.

Validation

- `birdid`:

Response object

```
{ user_id, bird_id }
```

## Dependencies

- TypeScript
- Node.js
- NestJS
- ESLint
- Prettier
- Jest
- Supertest

#### Packages

- @nestjs/platform-express
  - NestJS uses Express under the hood as an HTTP platform
- @nestjs/jwt
- @nestjs/swagger
- bcrypt
- rxjs
- class-transformer
- class-validator
- jest-mock
- ts-jest
- ts-node

#### Required Types Packages

- @types/bcrypt
- @types/express
- @types/jest
- @types/node
- @types/supertest
