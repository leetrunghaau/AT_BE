# BE-AT2 - Student Attendance API

This is the backend API for a student attendance system, built with Node.js, Express, and Prisma. The system is designed to automate class attendance by processing data from a hypothetical sensor to log when students enter or leave a classroom, providing detailed attendance statistics.

## Features

-   **Class Management**: CRUD operations for classes.
-   **Student Management**: CRUD operations for students.
-   **Subject Management**: CRUD operations for subjects.
-   **Attendance Tracking**: APIs to log student attendance.
-   **Dynamic API Validation**: Robust request validation using Joi.
-   **Centralized Response & Error Handling**.
-   **Pagination & Filtering** for list endpoints.

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [NPM](https://www.npmjs.com/) (comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd BE
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the example.
    ```bash
    # You can just create a .env file
    ```
    Then, add the required environment variables to the `.env` file. This configures Prisma to use a local SQLite database and sets the server port.
    ```env
    # Database URL for Prisma
    DATABASE_URL="file:./prisma/dev.db"

    # Server port
    PORT=3000
    ```

4.  **Run database migrations:**
    This command creates the SQLite database file (`dev.db`) and sets up the schema defined in `prisma/schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```

5.  **(Optional) Seed the database:**
    To populate the database with initial data for testing, run the seed script.
    ```bash
    npm run seed
    ```

### Running the Application

To start the development server with live-reloading (thanks to `nodemon`), run:
```bash
npm start
```
The server will be available at `http://localhost:3000`.

## Project Structure

```
/
├── prisma/
│   ├── migrations/       # Database migration history
│   ├── dev.db            # Local SQLite database file
│   ├── schema.prisma     # Prisma schema for database models
│   └── seed.js           # Script to populate the database
├── src/
│   ├── api/
│   │   ├── controllers/  # Handles request/response logic
│   │   ├── middlewares/  # Express middlewares (validation, error handling)
│   │   ├── routes/       # API routes definition
│   │   ├── services/     # Core business logic
│   │   └── validations/  # Joi validation schemas
│   ├── config/           # Project configuration (e.g., Prisma client)
│   ├── helpers/          # Helper/utility functions
│   └── server.js         # Main application entry point
├── .env                  # Environment variables (local)
├── CODING_RULES.md       # Project's coding standards
├── package.json          # Project dependencies and scripts
└── README.MD             # This file
```

## API Endpoints

The main API routes are defined in `src/api/routes/index.js`. All routes are prefixed with `/api`.

-   **Class Routes**: `/api/classes`
-   **Student Routes**: `/api/students` (To be implemented)
-   **Subject Routes**: `/api/subjects` (To be implemented)
-   **Attendance Routes**: `/api/attendance` (To be implemented)

For detailed API testing and interaction, you can use the `.http` files in the `/api` directory with a compatible REST client (like the VS Code REST Client extension).