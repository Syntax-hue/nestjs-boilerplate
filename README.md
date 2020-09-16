<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>


## Description

A real-world CRM system with Role-based authorization.
Build in TypeScript and MongoDB.

You can use this app as a boilerplate for a production project.

## Docs

I'll implement [swagger](https://swagger.io/) ASAP.



## Roles

You can see all of the existing roles and add new roles in the runtime.

The roles are stored in the database in the following format:

```
let grantList = [
    { role: 'admin', resource: 'video', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'video', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'video', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'video', action: 'delete:any', attributes: '*' },

    { role: 'user', resource: 'video', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'user', resource: 'video', action: 'read:any', attributes: '*' },
    { role: 'user', resource: 'video', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'user', resource: 'video', action: 'delete:own', attributes: '*' }
];
```
See https://github.com/nestjsx/nest-access-control for more.

## Installation

I've used MongoDB and Mongoose because of the flexibility. If you have docker installed you can run

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
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
