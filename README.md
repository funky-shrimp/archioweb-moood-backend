# Moood

Moood is a mashup between a whiteboard and Pinterest. It was developed for the course "ArchiOWeb" at HEIG-VD in Media Engineering.

This is the backend repository. You can find the [frontend here](https://github.com/funky-shrimp/archioweb-moood-frontend)

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [API Documentation](#api-documentation)
- [Dependencies](#dependencies)
- [License](#license)

## Features

- User authentication (JWT, basic)
- Boards, labels, and elements management
- Social features: likes, comments, follows
- RESTful API with modular routing
- MongoDB database integration

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or remote)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd archioweb-moood-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Copy the example environment file and configure it:
   ```sh
   cp .env.example .env
   ```
   Edit `.env` to set your `DATABASE_URL` and other secrets.

4. Start the development server:
   ```sh
   npm run dev
   ```
   Or for production:
   ```sh
   npm start
   ```

## Configuration

- All configuration is managed via environment variables.
- See `.env.example` for required variables.

| Variable      | Description                  |
|---------------|-----------------------------|
| DATABASE_URL  | MongoDB connection string   |
| PORT          | Server port (default: 3000) |
| JWT_SECRET    | Secret for JWT signing      |
| ORIGIN_FRONTEND    | Frontend cors allowed origin      |

## Project Structure

```
app.js                # Main Express app
config.js             # Configuration loader
bin/start.js          # App entry point
src/
  auth/               # Authentication logic
  features/           # Main features (boards, socials, etc.)
  routes/             # API and index routes
```

The project structure was based on this [article](https://fadamakis.com/express-mongo-application-architecture-and-folder-structure-1f95274c28fe) by Fotis Adamakis.

## Scripts

- `npm run dev` — Start in development mode with nodemon
- `npm start` — Start in production mode

## Testing the API

Automated tests are written using [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest).

Test files are located in the `src/spec/` directory and cover authentication, boards, and utilities.

### Running Tests

1. Make sure you have a local MongoDB instance running (the default test database is `mongodb://127.0.0.1/api-test`).
2. Run the test suite:
    ```sh
    npm test
    ```

### Writing Tests

- Add new test files in `src/spec/` following the pattern `<feature>.spec.js`.
- Use Jest for assertions and Supertest for HTTP requests against the Express app.
- Example:
   ```js
   // src/spec/example.spec.js
   import request from 'supertest';
   import app from '../../app.js';

   describe('Example API', () => {
      it('should return 200 for GET /api', async () => {
         const res = await request(app).get('/api');
         expect(res.statusCode).toBe(200);
      });
   });
   ```

Test configuration and setup can be customized in `package.json` and with environment variables as needed.

## API Documentation

- API routes are defined under `/api/docs`.
- See `src/routes/apiRouter.js` and feature folders for endpoints.
- (Optional) Swagger documentation can be added via `swagger-jsdoc` and `swagger-ui-express`.

API documentation was made with the help of Github Copilot and model GPT-4.1.

Here was the prompt (change **usersFollow** with the features name):
```
Can you do the api documentation for usersFollow.route.js.

Here is some instruction :
-Use the tag "usersFollow"
-Add parameters content and example
-Add requestBody content and example
-Add responses content and example
-Put the comment block above it's own route
-Optimize the documentation with components (schema, responses, parameters, requestBody) if necessary

You can base yourself on usersFollow's model, service and controller.
```

## Dependencies

- express
- mongoose
- jsonwebtoken
- bcrypt
- morgan
- http-errors
- dotenv
- nodemon (dev)
- jest (dev)

## License

This project is for educational purposes at HEIG-VD.
