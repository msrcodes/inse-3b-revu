# Docs

Please try to keep these updated as it will make it easier for people to work on things others have done

## Running
`npm start`

Site will then be accessible at [localhost:3005](http://localhost:3005)

## [Frontend](frontend/frontend.md)
Put more detailed docs in `/docs/frontend/`

All front end files are in `/frontend/`

This will be in the form of a single page app

static files including media, js, and css are stored in `/frontend/static/`, all other routes will just give the user the SPA

We will be using js modules these are stored in `/frontend/static/js/modules`


## [backend](backend/backend.md)
Put more detailed docs in `/docs/backend/`

All backend files are in `/backend/`

app.js is the file that is run by `npm start`, this shouldn't really need changing frequently

### [API](backend/api.md)
All API routes are in `/backend/routes/api.js`, this could be split into multiple files to maintain readability

### modules

All modules including the managers and the database interface are in `/backend/modules/`

