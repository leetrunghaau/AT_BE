# Student Attendance API System

![License](https://img.shields.io/badge/license-ISC-blue.svg)

A backend API for an automated attendance system, built with Node.js, Express, and Prisma. The system is designed to automate classroom attendance by processing sensor data to log when students enter or leave, providing detailed statistics.

---

## 📜 Table of Contents

- [About The Project](#about-the-project)
  - [Key Features](#key-features)
  - [Built With](#built-with)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation Guide](#installation-guide)
- [🏃‍♂️ Usage](#-usage)
  - [Running the Application](#running-the-application)
  - [API Endpoints](#api-endpoints)
- [🐳 Docker](#-docker)
  - [Using Docker Compose (Recommended)](#using-docker-compose-recommended)
  - [Using Docker Manually](#using-docker-manually)
  - [Template for Master Docker Compose](#template-for-master-docker-compose)
- [📂 Project Structure](#-project-structure)
- [⚖️ License](#️-license)

---

## About The Project

This project provides a comprehensive backend solution for managing and automating attendance. By integrating with hypothetical sensors, the system can track student presence accurately and efficiently.

### Key Features

-   **CRUD Operations**: Full support for Create, Read, Update, and Delete operations for Classes, Students, and Subjects.
-   **Attendance Tracking**: Logs and stores the entry/exit history of students and teachers.
-   **Data Validation**: Uses Joi to ensure the integrity of input data.
-   **Centralized Response Handling**: Custom middleware to standardize API responses and handle errors.
-   **Pagination & Filtering**: Built-in for endpoints that return a list.

### Built With

-   [Node.js](https://nodejs.org/)
-   [Express.js](https://expressjs.com/)
-   [Prisma](https://www.prisma.io/)
-   [SQLite](https://www.sqlite.org/index.html)

---

## 🚀 Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [NPM](https://www.npmjs.com/) (comes with Node.js)
-   [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (optional, recommended)

### Installation Guide

1.  **Clone the repository**
    ```bash
    git clone https://github.com/leetrunghaau/AT_BE.git
    cd BE
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Create the environment file (`.env`)**
    Create a `.env` file in the root directory and copy the content below. This file configures the database, server port, and other services.
    ```env
    # Database URL for Prisma
    DATABASE_URL="file:./dev.db"

    # Server port
    PORT=5000

    # Base URL for the AI service
    AI_BASE_URL="http://localhost:8000"
    ```

4.  **Set up the database**
    This command synchronizes your schema with the database, automatically creating the necessary tables.
    ```bash
    npx prisma db push
    ```
    > **Note**: `db push` is great for rapid prototyping. In a team or production environment, consider using `npx prisma migrate dev` to manage schema changes over time.

5.  **(Optional) Seed the database**
    To add sample data to the database, run:
    ```bash
    npm run seed
    ```
    Or run a specific seed file:
    ```bash
    node prisma/subject.seed.js
    ```

---

## 🏃‍♂️ Usage

### Running the Application

To start the server in development mode (with `nodemon` for auto-restarts), run:
```bash
npm start
```
The server will be available at `http://localhost:5000` (based on the `.env` configuration).

### API Endpoints

All API routes are defined within the `src/api/routes/` directory. All endpoints are prefixed with `/api`.

-   `/api/classes`: Manage classes
-   `/api/students`: Manage students
-   `/api-subjects`: Manage subjects
-   `/api/attendance`: Manage attendance

---

## 🐳 Docker

This project is pre-configured to run with Docker, simplifying setup and deployment.

### Using Docker Compose (Recommended)

This is the recommended method as it automatically manages the container, network, and volumes for data persistence.

-   **Start:** Build the image and launch the container.
    ```bash
    docker-compose up --build -d
    ```
-   **Stop:** Stop and remove the container.
    ```bash
    docker-compose down
    ```

### Using Docker Manually

-   **1. Build the image:**
    ```bash
    docker build -t be-at2 .
    ```
-   **2. Run the container:**
    ```bash
    docker run -d -p 5000:5000 --name be-at2-container --env-file .env be-at2
    ```
    > **Note**: This method does not persist data. All data will be lost when the container is removed.

### Template for Master Docker Compose

To integrate this service into a larger `docker-compose.yml` file on a server, use the template below. **Note:** You must edit the paths and network names.

```yaml
# --- Service for BE-AT2 ---
services:
  backend-at2: # Give the service a unique name
    build: ./path/to/your/BE-project # CHANGE: Path to this project's directory
    container_name: be-at2-backend
    env_file:
      - ./path/to/your/BE-project/.env # CHANGE: Path to the .env file
    volumes:
      # CHANGE: The path on the left is on your host machine
      - ./your-data/at2/dev.db:/app/dev.db
      - ./your-data/at2/public/data:/app/public/data
    networks:
      - your-shared-network # CHANGE: The name of your shared network
    ports:
      - "5000:5000" # CHANGE: Map port if necessary
    restart: unless-stopped
```

---

## 📂 Project Structure

```
/
├── prisma/             # Contains schema, database, and seed files
├── public/             # Contains static files (images, data)
├── src/
│   ├── api/            # Contains all API logic (routes, controllers, services)
│   ├── config/         # Project configuration
│   ├── helpers/        # Helper functions
│   └── server.js       # Application entry point
├── .env                # Environment variables file (ignored by Git)
├── .gitignore          # Files and directories ignored by Git
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Configuration for building the Docker image
├── package.json        # Dependencies and scripts
└── README.MD           # This documentation file
```

---

## ⚖️ License

This project is distributed under the ISC License. See `package.json` for more information.
