#!/bin/bash

# init .env file 

touch .env

cat > .env << EOF
NODE_ENV=development
COOKIE_SECRET=YTNiZjZmMGZhZGVlODgwNjU2ZTdmMjFQ
JWT_SECRET=my_secret_key_laPaz
PORT=8080
DB_HOST=localhost
DB_NAME=laPaz_db
DB_USER=
DB_PASSWORD=
DB_URI=
ORIGIN_URL=http://localhost:3000
EOF