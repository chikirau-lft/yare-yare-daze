# Chapi

Chapi is Express server for Node.js which enables CRUD operations over MongoDB.


## Development server
Run `npm run start` for a dev server. Navigate to `http://localhost:5000/${APP_PREFIX}/:database/:collection`.

Run `npm run start-watch` for a dev server. Navigate to `http://localhost:5000/${APP_PREFIX}/:database/:collection`.
The app will automatically reload if you change any of the source files.

## Running unit tests

Run `npm run test` to execute the unit tests via [Supertest](https://github.com/visionmedia/supertest).

## CRUD Actions

1. **HTTP GET**. Read data from db using following query params:
   - *filter* - GET `/app/db/col?filter={"qty":{"$gt":50}}`. Allows to specify conditions on the documents. 
   - *page* - GET `/app/db/col?page=2`. Allows you to select which page should be returned. 
   - *pagesize* - GET `/app/db/col?pagesize=20`. Allows you to control the number of documents to return.
   - *sort* - GET `/app/db/col?sort={"field": 1}`. Allows you to specify sort condition. 
   - *keys* - GET `/app/db/col?keys={'item':1}&keys={'status':1}`. Allows you to specify the inclusion/exclusion of fields. 
   - *hint* - GET `/app/db/col?hint={'item':1}`. Allows you to override MongoDB’s query optimization process. 

2. **HTTP POST**. Insert multiple documents. Specifying `_id` field will perform update action:
		
        ```
        POST /app/db/col
        
		[
        	{
				text: 'text 1',
				number: 2000
			}, {
				text: 'text 2',
				number: 3000
			}
        ]
        ```

3. **HTTP DELETE**. Delete data from database:
	- delete by id:
		        
       	```
        DELETE /app/db/col/5e0f8e63e2f946d8b942ae12 - will delete document with id of 5e0f8e63e2f946d8b942ae12
        ```
    - delete using query filter param:
    	
        ```
        DELETE /app/db/col?filter={'number': 200} - will delete all documents with `number` field of value 200
        ```


## Environment variables

When running this application supports next process.env variables located in server/config/config.json file:

- `MONGO_URI`: MongoDB connection URI used to connect to a MongoDB.
- `MONGO_DATABASE`: MongoDB database used.
- `DEFAULT_PAGESIZE`: Pagesize returned by HTTP/HTTPS requests.
- `MAX_PAGESIZE`: Max pagesize returned by HTTP/HTTPS requests.
- `DEFAULT_PAGENUM`: Number of pages returned by HTTP/HTTPS requests.
- `DEFAULT_FILTER`: The filter query parameter.
- `DEFAULT_SORT`: The sort query parameter.
- `DEFAULT_KEYS`: The keys query parameter.
- `DEFAULT_HINT`: The hint query parameter.
