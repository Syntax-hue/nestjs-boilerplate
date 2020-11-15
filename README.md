<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>


## Description

Production ready boilerplate with Role-based authentication and authorization.
Contains module for notifications (sending tokens for auth in gmail), news (blog) and file-uploads.

See the necessary environment variables in example.

Build in TypeScript and MongoDB.

## Upcoming

Upload images with multer.


## Docs

I'll implement [swagger](https://swagger.io/) ASAP.

swagger v0.1
```
npm run start:dev
```

Enter localhost:5000/api/docs


## Roles

You can see all of the existing roles and add new roles in the runtime.

The roles are stored in the database in the following format:

```
let grantList = [
    { role: 'admin', resource: 'users', action: 'create:any', attributes: '*, !password' },
    { role: 'admin', resource: 'users', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'users', action: 'update:any', attributes: '*, !password' },
    { role: 'admin', resource: 'users', action: 'delete:any', attributes: '*' },

    { role: 'user', resource: 'video', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'user', resource: 'video', action: 'read:any', attributes: '*' },
    { role: 'user', resource: 'video', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'user', resource: 'video', action: 'delete:own', attributes: '*' }
];
```

The ADMIN role is inserted automatic with every start of the application.
To see how it works enter the app.roles.ts in the src directory. There you can add roles to admin.

See https://github.com/nestjsx/nest-access-control for more.

## Notifications

You can create custom notifications and use them in a service. They are used in auth service for sending email confirmation token.

## Installation

I'm using MongoDB and Mongoose because of the flexibility. If you have docker installed you can run

```bash
# to start mongodb
$ docker-compose up -d
```

And 

```bash
$ npm install
```
for dependencies.


## Running the app

```bash
# development watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
