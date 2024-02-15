
## Prepairing 

1. Install NodeJS version 20.5.1
2. Download and Install PostgreSQL (in projects using version 16) - [text](https://www.postgresql.org/download/)
3. Create DB:
  - use Shell SQL (for windows) or sme for mac
  - use command to create db - ' create database incode;'
  - use command to create user for db - 'create user incode with encrypted password '123';
  - use command to add privileges - 'grant all privileges on database incode to incode;
  - change owner for bd in pgAdmin PostgreSQL -> incode -> schemas ->public -> properties -> general/owner -> select incode
  and check privileges for incode -> security/incode

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```



## Migration tutorial
```bash
#drop all tables 
$ npm run db:drop

#create migration 
$ npm run db:create src/migrations/[MigrationName]

#use created migration 
$ npm run db:migrate
```

## Postman collection
[Postman for testing](https://winter-meadow-119738.postman.co/workspace/My-Workspace~5283901a-ddae-43ff-85bf-f18c69ab8e84/collection/21293932-437e3228-7587-43b2-ae65-ae75e2de030f?action=share&creator=21293932)



