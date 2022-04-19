# Marius NC NEWS
Welcome to my back end portfolio project

I did build an API for the purpose of accessing application data programmatically. My intention here is to mimic the building of a real world backend service  which  provide information to the front end architecture.

I did use PSQL database and node-postgrest to atchieve this. 

# Setup

Here is two databases in this project. One for dev data and another for test data.
In order successfully connect to the local databases please create .env.test and .env.development files in the root level of the folder.
Add "PGDATABASE="nc_news_test" to .env.test file and "PGDATABASE="nc_news" to .env.development file
These files should be .gitignored
