# TripTales

## Description

TripTales is a MERN stack web application that allows users to share their travel experiences to world through a user-friendly interface. The app supports user registration and login, enabling full CRUD functionality for managing places, including details like name, description, address, and images. Users can securely authenticate using JWT, and the app utilizes external APIs to fetch geolocation data for map rendering.

## Features

- **User Registration and Login**: Secure user authentication using JWT.
- **CRUD Functionality**: Users can create, read, update, and delete places they have visited.
- **Image Uploading**: Handles image uploads using Multer.
- **Geolocation Integration**: Fetches geolocation data for displaying places on an embedded map.

## Technologies Used

### Frontend

- **ReactJS**: Core library for building user interfaces.
- **ol**: Used for rendering interactive maps in the frontend.
- **react-router-dom**: For routing and navigation within the application.
- **react-transition-group**: To manage transitions and animations between components.

### Backend

- **NodeJS**: JavaScript runtime for building the server.
- **Express**: Framework for building web applications on top of Node.js.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Multer**: Middleware for handling `multipart/form-data`, used for image uploads.
- **jsonwebtoken**: For secure user authentication and session management using JWT.
- **bcryptjs**: For hashing passwords securely.
- **dotenv**: To manage environment variables.
- **express-validator**: For validating incoming request data.
- **mongoose-unique-validator**: Plugin to ensure unique fields in MongoDB.
- **opencage-api-client**: To generate latitude and longitude for locations.
- **uuid**: For generating unique identifiers.

### Installation

#### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB account and database setup (if using MongoDB).

#### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/triptales.git
   cd triptales

   ```

2. Install the frontend dependencies:

   ```bash
   cd Frontend
   npm install

   ```

3. Install the backend dependencies::

   ```bash
   cd server
   npm install

   ```

4. Create a .env file in the Frontend directory and add your environment variables:

   ```env
   VITE_API_BACKEND_URL=http://localhost:3000/api
   VITE_API_ASSET_URL=http://localhost:3000
   ```

5. Create a .env file in the Backend directory and add your environment variables:

   ```env
   PORT=yourPORTNumber
   DB_USER=yourUsername
   DB_PASSWORD=yourPassword
   DB_NAME=yourDatabaseName
   JWT_SECRET=yourJWTSecret
   OPENCAGE_API_KEY=yourOpencageAPIKey
   ```

6. Run the application:

   For the Backend:

   ```bash
   cd Backend
   npm run start

   ```

   For the Frontend:

   ```bash
   cd Frontend
   npm run dev

   ```

Thanks for stopping by!
