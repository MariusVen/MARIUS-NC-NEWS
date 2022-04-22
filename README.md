# Marius NC NEWS API
I did create Marius NC News API as my backend portfolio project. This project provides data for my NC News frontend [app](https://marius-nc-news.netlify.app/)

## :rocket: Hosted version on Heroku

https://marius-nc-news.herokuapp.com/api

## Setup

Clone the project and install required dependecies:
```sh
git clone https://github.com/MariusVen/MARIUS-NC-NEWS-Backend.git

cd MARIUS-NC-NEWS-Backend

npm install
```
## Database

Here is two databases in this project. One for dev data and another for test data.
In order successfully connect to the local databases please create
```sh
.env.test 
```
and
```sh
.env.development 
```
files in the root level of the folder.
Add ``` "PGDATABASE="nc_news_test"``` to ```.env.test``` file and ```"PGDATABASE="nc_news"``` to ```.env.development``` file
These files should be ```.gitignored```

## Setup and seeding database

```
npm run setup-dbs
npm run seed
```

## To run testing

```sh
npm run test
```

## Start local server to see all endpoints in the browser
```sh
npm start
```
## Minimum requirements:
Node.js
```v16.0.0```  
PostgreSQL 
```12.9```
