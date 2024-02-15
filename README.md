
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




