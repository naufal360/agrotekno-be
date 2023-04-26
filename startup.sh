#!/bin/bash

npx sequelize db:migrate && npx sequelize-cli db:seed:all; npm run start-dev 