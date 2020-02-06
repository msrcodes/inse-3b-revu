# API

Document all api endpoints, their parameters and return values

[restful api design](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api)
## base format
All api endpoints should have a url, and the return json

POST and PUT requests can also have a json body

### Methods
```
GET - get object, cached, idempotent (doing this doesn't change anything)
POST - Add new object, not cached or idempotent
PUT - Change existing object, not cached or idempotent
DELETE - delete an object, not cached or idempotent
```

### URL
Following standard REST format

### common HTTP status codes
* 200 - OK
* 201 - Created, OK but for POST
* 400 - Bad request, when the client has messed up for example missing required fields
* 401 - Unauthorized, user needs to login
* 403 - Forbidden, user logged in but not high enough privileges
* 404 - Not found
* 500 - Server error




## End points
### \*\*EXAMPLE\*\* `POST /univerities/12/reviews`
#### In
```json
{
    "staffRating": 0.4,
    "staffRatingDesc": "",
    "facilityRating": 0.7,
    "facilityRatingDesc": "",
    "...": ""
}
```
#### out: 201
```json
{}
```
