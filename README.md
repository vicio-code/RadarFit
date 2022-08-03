# RadarFit

To run this project run `npm install` to install the dependencies. Then run `npx prisma migrate reset` to start the database and `npm run dev` to run the server

Here you can find a [link](https://www.getpostman.com/collections/f4fa6e9e657ca83bd1e4) of a Postman collection with exemples to every endpoint.

## How the API works

First you need to create a new competition. To do this send a requeste to the `/competition` endpoit using the `POST` method and a body like this:

```json
{
  "name": "Competição de Dardos"
}
```

The endpoint will return the ID of the competition.This endpoint only accepts the valid competitions. Using the method `GET` with `/competition` will return every competition, with status and ID.

You can update the status of a competiton sending a request using the method `PUT` to `/competition/id` endpoint using this body

```json
{
  "status": "Done"
}
```

To post an Athelete result send a request to `/competition/id/results` endpoint using the `POST` method and body like this:

```json
{
  "competition": "Competição de dardos",
  "athelete": "Maurilo",
  "value": "123",
  "unit": "km"
}
```

And to see the ranking of a competition send request to `/competition/id/` endpoint using the `GET` method
