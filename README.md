# Education

Express, Sequelize, PostgresQl, EJS

- npm install

- change config

```javascript
// config/config.json
  "development": {
    "username": "postgres",// change this
    "password": "postgres",// change this
    "database": "edu_dbe",// change this
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
```

- npx sequelize-cli db:create
- npx sequelize-cli db:migrate
- npx sequelize-cli db:seed:all
- npm start

http://localhost:3000/
