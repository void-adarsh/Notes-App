# Notes APP

The Notes APP is a simple RESTful API built with Node.js, Express.js, and MongoDB. It allows users to create, read, update, and delete notes. Additionally, users can sign up and login to access protected routes.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contact Information](#contact-information)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/void-adarsh/NotesApp.git
cd NotesApp
```

2. Install Dependencies:

```bash
npm install
```

- In this project I have used multiple dependencies which are as follows:
  `Bcrypt` - Library for hashing passwords to securely store them in the database.
  `Jest` - Testing framework for writing unit tests.
  `Supertest` - Library for testing HTTP requests/responses in combination with Jest.
  `Mongoose` - MongoDB object modeling tool to interact with the database.
  `JsonWebToken` - For implementing an authentication protocol using JSON Web Tokens.
  `nodemon` - Utility to monitor changes in the code and automatically restart the server during development.
  `express` - Web application framework for building APIs and server-side applications.
  `express-rate-limit` - Web application framework for building APIs and server-side applications.
  `dotenv` - Library to load environment variables from a .env file.
  `cors` - Middleware for enabling Cross-Origin Resource Sharing to allow requests from different origins.

3. Setup MongoDB

- Make sure you have [MongoDB](#https://www.mongodb.com/cloud/atlas/register) installed and running locally or provide a remote MongoDB URI in the .env file.

4. Create a .env file in the root directory and add the following environment variables:
   `PORT=5000`
   `MONGODB_URI=your-mongodb-uri`
   ` SECRET_KEY=notesapi`

- Replace ` your-mongodb-uri` with the MongoDB connection URI, and ` your_secret_key` with a secret key for JWT authentication.
-

## Usage

To start the server, run:

```bash
npm start
```

The server will run on http://localhost:5000.

## API Endpoints

```
    POST /api/users/signup: Sign up a new user.
    POST /api/users/login: Login an existing user.
    POST /api/notes: Create a new note (requires authentication).
    GET /api/notes: Get all notes (requires authentication).
    GET /api/notes/:id: Get a specific note by ID (requires authentication).
    PUT /api/notes/:id: Update a specific note by ID (requires authentication).
    DELETE /api/notes/:id: Delete a specific note by ID (requires authentication).
    POST /api/notes/:id/share: share a note with another user (requires authentication).
    GET /api/search?q=:query: search for notes based on keywords (requires authentication).
```
- ``` For API Endpoint testing I have used POSTMAN```
  
## Testing

To run the unit tests for the application, use the following command:

```bash
npm test
```

## Important Notes

` Imp Note:  When testing the application in POSTMAN, please add the Bearer token that you will get when you login in the Headers in the form of Authorization.`

` Note: Please run the test cases for different files separately as there might be issues with the port number. When running all the test cases simultaneously, there might be an instance where the port number is already in use.`

# Contact Information

- Developed by : `Adarsh Kannan Iyengar`
- Email : ajju1632000@gmail.com
- Assessment provided by : `Speer Technologies`
