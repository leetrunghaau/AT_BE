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
    Create a `.env` file in the root directory and add the following content. This file configures the database path, server port, and other necessary settings.
    ```env
    # Database URL for Prisma (points to the db file in the root)
    DATABASE_URL="file:./dev.db"

    # Server port
    PORT=5000

    # Base URL for the AI service
    AI_BASE_URL="http://localhost:8000"
    ```

4.  **Setup the Database:**
    These commands will create the SQLite database file and generate the Prisma Client based on your schema.

    a. **Create the database file:**
    First, create an empty database file named `dev.db` inside the `prisma` directory.

    b. **Generate Prisma Client:**
    This command reads your `schema.prisma` and generates the Prisma Client library tailored to your models.
    ```bash
    npx prisma generate
    ```

    c. **Push the schema to the database:**
    This command will synchronize your database schema with your Prisma schema, creating the tables.
    ```bash
    npx prisma db push
    ```
    *Note: `db push` is great for prototyping. For production and team workflows that require tracking schema changes, consider using `npx prisma migrate dev`.*

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

## Docker Support

This project includes a `Dockerfile` and a `docker-compose.yml` file to make it easy to build and run the application in a containerized environment.

### Method 1: Using Docker Compose (Recommended)

Docker Compose is the recommended way to run the application as it simplifies the management of ports, environment variables, and volumes for data persistence.

**Start the application:**
To build the image and start the container, run:
```bash
docker-compose up --build
```
To run in the background (detached mode), use:
```bash
docker-compose up -d --build
```

**Stop the application:**
To stop the container, run:
```bash
docker-compose down
```

The `docker-compose.yml` file is configured to automatically persist the data in `dev.db` and the `public/data` directory by mounting them as volumes.

### Method 2: Using Docker Manually

If you prefer not to use Docker Compose, you can build and run the container manually.

**1. Build the Docker Image:**
```bash
docker build -t be-at2 .
```

**2. Run the Docker Container:**
```bash
docker run -d -p 5000:5000 --name be-at2-container --env-file .env be-at2
```
*   **Note:** This manual method does not persist the database. Any data will be lost if the container is removed.

### Triển khai vào Docker Compose tổng

Nếu bạn đang chạy nhiều service trên máy chủ và quản lý bằng một tệp `docker-compose.yml` tổng, bạn có thể sao chép đoạn mã dưới đây và dán vào tệp đó.

**Lưu ý:** Bạn cần chỉnh sửa các đường dẫn (`build`, `env_file`, `volumes`) và tên `networks` cho phù hợp với cấu trúc thư mục và thiết lập trên máy chủ của bạn.

```yaml
# --- Service cho BE-AT2 ---
services:
  backend-at2: # Đặt một tên duy nhất cho service
    build: ./path/to/your/BE-project # THAY ĐỔI: Đường dẫn đến thư mục project này
    container_name: be-at2-backend
    env_file:
      - ./path/to/your/BE-project/.env # THAY ĐỔI: Đường dẫn đến tệp .env
    volumes:
      # Volume để lưu trữ database và các dữ liệu khác
      # THAY ĐỔI: Đường dẫn bên trái dấu hai chấm (:) là đường dẫn trên máy chủ của bạn
      - ./your-data/at2/dev.db:/app/dev.db
      - ./your-data/at2/public/data:/app/public/data
    networks:
      - your-shared-network # THAY ĐỔI: Tên network chung của các service
    ports:
      - "5000:5000" # THAY ĐỔI: Ánh xạ cổng nếu cần
    restart: unless-stopped

# ... các service khác của bạn ...

# networks:
#   your-shared-network:
#     external: true # Hoặc định nghĩa network tại đây
```

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
