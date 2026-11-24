# Trello-style Task Manager API

A small REST API for managing users and tasks, with email-confirmed accounts and JWT authentication.

## Features

- Sign-up with **email confirmation** (and resend link), login and logout
- Tasks: add, update, delete, list per user and list all with details
- Profile: view, update, change password, delete account
- Nodemailer for confirmation emails

## Tech stack

- Node.js, Express
- MongoDB with Mongoose
- JWT, bcrypt
- Nodemailer

## API modules

Base URL: `http://localhost:5000`

| Route prefix | Purpose |
|---|---|
| `/auth` | Sign up, login, confirm email, logout |
| `/user` | Profile and password |
| `/tasks` | Create, read, update and delete tasks |

## Project structure

```
├── index.js            # app entry point
├── DB/
│   ├── connection.js   # database connection
│   └── models/         # data models
└── src/
    ├── index.router.js # mounts all modules
    ├── middleware/     # authentication, validation
    ├── modules/        # one folder per feature (router + controller)
    └── utils/          # email, error handling, helpers
```

## Getting started

**Requirements:** Node.js 18+ and a running database (see the environment variables below).

```bash
npm install
# create a .env file with the variables below
node index.js
```

## Environment variables

Create a `.env` file in the project root (never commit it):

```env
DB_URL=
SALT_ROUND=
TOKEN_SIGNATURE=
EMAIL_SIGNATURE=
EMAIL=
EMAIL_PASSWORD=
```

## Notes

- Requests are validated before they reach the controllers, and errors go through a central error handler.
- Protected routes need a valid token from the sign-in endpoint.
