# Stock Exchange Coding Challenge
This application is written using Nodejs/Express, Reactjs/Redux, and Mongodb

To run this application, begin by cloning this repository

Requirements:
  * Nodejs and npm,
  * Mongodb

On your terminal 'cd' to the root directory of this application and run:

    npm install

it should take a few minutes for the node packages to download.

Make sure your mongodb is running (and that this application has access to it).


run the application by typing:

  	npm run start

then view the app on localhost:3000


***
# Obtaining data from api:
***

  * 'npm run collect' or 'nohup npm run collect &' (if you want to run it in the background)

    * This will fetch data from stock market api and update the mongodb every 24 hours.
