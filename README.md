# La Paz Backend

This project is built to maintain the inventory control of a funeral home, in which clients can make their payments through the platform and have a better follow-up of their payments and debts.

## Project Requirements

- [MySql](https://www.apachefriends.org/es/index.html)
- [npx](https://www.npmjs.com/package/npx)
- [nodejs](https://nodejs.org/es/)

## Project Structure

    ├── .github
    ├── app                 # Express App
       ├── api                # Api
          ├── helpers             # Helpers
          ├── middlewares         # Authentication middlewares
          ├── routes              # API Routes
          ├── utils               # Utility functions
       ├── db                 # Database
          ├── config              # Database Seeders
             ├── config.js            # DB connection config
                ├── index.js              # Parameter setting for the DB
                └── database.js           # DB connection configuration
          ├── models              # Database Models
          └── index.js            # Database export
    ├── .gitignore
    ├── init-env.sh
    ├── package-lock.json
    ├── package.json
    └── README.md

## How to execute the project

If you want to be able to execute the project you will first need to install the requirements listed in the [Project Requirements Section](#project-requirements).

- Clone this repo by running:

  ```bash
  git clone https://github.com/enmanuelPersonal/LaPaz-Back-End.git
  ```

- Create the `.env` file:

  ```bash
  ./init-env.sh
  ```

- Run the server:

```bash
npm run dev
```

The local development server will be running at [localhost:8080](http://localhost:8080).
