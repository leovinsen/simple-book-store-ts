## Getting Started

For development purposes
```bash
$ cp .env.example .env # quickly setup .env file
$ npm install
$ npm migration:up # run migrations and create SQLite DB
$ npm run dev # start dev server
```

For production
```bash
$ npm run build # compiles to /dist folder
$ npm run start # run index.js in /dist
```

To run tests:
```bash
$ npm run test:all # to run all test suites
$ npm run test:unit # to run only unit tests with mocked dependencies
$ npm run test:e2e # to run only tests under e2e directory
$ npm run test <glob_pattern> # convenience script to supply custom glob pattern for finding test files
```

## Creating new Migration

Run the following command to create a new new migrations file under `src/database/migrations`.
```bash
$ npm run migration:create -- <migration_name_here>
```

## Folder Structure

```bash
src
├── app.ts # contains bootstrapper method for Express and required dependencies
├── config # a helper module for reading from .env
├── controller # Express (req, res, next) handlers
├── database # migrations & seed files, and SQLite bootstrapper method
├── error # custom error classes
├── helper # helper functions and/or classes
├── index.ts # contains entry point to app
├── middleware # Express middlewares
├── model # custom models
├── repository # performs CRUD into database
├── route # Express router that maps paths into controllers
├── service # orchestrates multiple repository to perform business logic
├── test # helper functions for testing purposes
├── types # global namespace type declaration
└── validator # helper functions for validating input
```

Test files are located next to the file it is testing, for example `src/repository/orderRepository.test.ts` next to `src/repository/orderRepository.ts`.
