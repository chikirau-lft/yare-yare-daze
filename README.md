# node-restHeart

Implementation of RESTHeart API(for more information visit https://restheart.org/), initialy written in Java, in Node.js server running on IIS.

### Prerequisites

To run the application you must have installed:

```
node.js >= v8.10.0

mongoDB >= 3.6
```

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:3000/mongo/:database/:collection`.

Run `npm run start-watch` for a dev server. Navigate to `http://localhost:3000/mongo/:database/:collection`.The app will automatically reload if you change any of the source files.

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
