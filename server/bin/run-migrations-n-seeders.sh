#!/usr/bin/env bash
echo 'Sequelize migrations and seeders will be executed (should be started from root folder)'

export DATABASE_URL='postgres://rorkirpezukztl:fe2b636d4a18a49c9824c71c0a94dfa9ab8a63c8eb53280cc08eecdfdc89d3c1@ec2-54-217-235-11.eu-west-1.compute.amazonaws.com:5432/d1k2c363eahrl5?sslmode=require';
cd server
sequelize db:migrate
sequelize db:seed:undo:all
sequelize db:seed:all
