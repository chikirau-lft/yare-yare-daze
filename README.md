# node-restHeart

Implementation of RESTHeart API(for more information visit https://restheart.org/), 
initialy written in Java, in Node.js server running on Windows IIS or as common http node server.

### Pre-requisites

To run the application you must have installed:

1) [node.js](https://nodejs.org/en/) >= v8.10.0 

2) [mongoDB](https://www.mongodb.com/) >= 3.6

3) IIS 10.0 installed on your machine.

4) [IIS URL Rewrite extension](https://www.iis.net/downloads/microsoft/url-rewrite)

5) [latest iisnode v0.22.1 x64](https://github.com/tjanczuk/iisnode/releases/download/v0.2.21/iisnode-full-v0.2.21-x64.msi)

### Installation

The install is pretty straight forward for each component. You can simply go through each pre-requisites.

1) Install IIS via your preferred method. PowerShell or via Server Manager.

2) Install IIS URL Rewrite extension via the Web Platform Install UI or WebPICMD.

3) Install iisnode from your binary download.

Then ensure you can open up http://localhost successfully.

## Development server

1) Adding your site to IIS:
    
    Open up the program and on your Sites, right click and select "Add Website...". Fill out the details and link it to your folder with the app.js(app.js can be found 
    
    in this repository. After cloning just run `npm install`) and web.config files inside of it. Note! Your site name is IIS should be same as `APP_PREFIX` in 
    
    config.json. Then click Browse in IIS Manager.

2) Or you can run app just as http server without IIS:

    Just clone this repository and run `npm install`. Then run `npm run start` for a dev server. Navigate to `http://localhost:3000/${APP_PREFIX}/:database/:collection`.

    Run `npm run start-watch` for a dev server. Navigate to `http://localhost:3000/${APP_PREFIX}/:database/:collection`.The app will automatically reload if you change 
    
    any of the source files.

## Running unit tests

Run `npm run test` to execute the unit tests via [Supertest](https://github.com/visionmedia/supertest).

## Environment variables

When running this application supports next process.env variables located in server/config/config.json file:

- `MONGO_URI`: MongoDB connection URI used to connect to a MongoDB. Default is `mongodb://localhost:27017`.
- `MONGO_DATABASE`: MongoDB database used. Default is `Nectar_Export_100000`.
- `DEFAULT_PAGESIZE`: Pagesize returned by HTTP/HTTPS requests. Default is `100`.
- `MAX_PAGESIZE`: Max pagesize returned by HTTP/HTTPS requests. Default is `1000`.
- `DEFAULT_PAGENUM`: Number of pages returned by HTTP/HTTPS requests. Default is `1`.
- `DEFAULT_FILTER`: The filter query parameter. Default is empty string.
- `DEFAULT_SORT`: The sort query parameter. Default is `-id`.
- `DEFAULT_KEYS`: The keys query parameter. Default is empty string.
- `DEFAULT_HINT`: The hint query parameter. Default is empty string.
