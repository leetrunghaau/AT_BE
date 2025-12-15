# Project Coding Rules & Conventions

This document outlines the coding standards, architecture, and conventions for this project to ensure consistency and maintainability.

## 1. Architecture

The project follows a feature-first, layered architecture. The code is organized by feature (e.g., `class`, `student`) and then by layer within each feature's files.

The request lifecycle is as follows:
**`Route` -> `Middleware(s)` -> `Controller` -> `Service`**

-   **Routes (`src/api/routes/`)**: Define API endpoints using `express.Router()`. They are responsible for mapping HTTP requests to the correct controller and applying necessary middlewares (e.g., validation).
-   **Middlewares (`src/api/middlewares/`)**: Handle cross-cutting concerns like request validation (`validation.middleware.js`), response formatting, and error handling (`response.middleware.js`).
-   **Controllers (`src/api/controllers/`)**: Act as the bridge between the HTTP layer and the business logic. They extract data from the request (`body`, `params`, `query`), call the appropriate service method, and format the final HTTP response using response handlers. **Controllers should not contain business logic.**
-   **Services (`src/api/services/`)**: Contain the core business logic of the application. They are responsible for processing data, performing calculations, and interacting with the database via the Prisma client.

## 2. Naming Conventions

-   **Files**: Use the `resource.type.js` format.
    -   Example: `class.route.js`, `class.controller.js`, `class.service.js`.
-   **Variables & Functions**: Use `camelCase`.
    -   Example: `getAllClasses`, `studentData`.
-   **Classes**: Use `PascalCase`.
    -   Example: `ClassController`, `ClassService`.
-   **Constants**: Use `UPPER_SNAKE_CASE` for environment variables or global constants.
    -   Example: `PORT`, `DATABASE_URL`.

## 3. Code Style & Patterns

### Asynchronous Operations
-   All asynchronous route handlers and service methods must use `async/await`.
-   All logic within a controller method must be wrapped in a `try...catch` block. Any errors must be passed to the central error handler using `next(error)`.
    ```javascript
    // In a controller
    async create(req, res, next) {
      try {
        const newClass = await ClassService.create(req.body);
        res.ok(newClass); // Use the custom response handler
      } catch (error) {
        next(error); // Pass error to the central handler
      }
    }
    ```

### Error Handling
-   Business logic errors (e.g., "item not found") should be thrown from the **Service** layer using the `http-errors` library.
    ```javascript
    // In a service
    const createError = require('http-errors');

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw createError.NotFound('Item not found');
    }
    ```
-   The central `errorHandler` in `response.middleware.js` will catch and format the final error response.

### Validation
-   All incoming request data (`body`, `params`, `query`) must be validated.
-   Validation schemas must be defined using **Joi** in the `src/api/validations/` directory.
-   The `validate` middleware should be used in the **Route** files to apply the schemas.
    ```javascript
    // In a route file
    const validate = require("@mids/validation.middleware");
    const { create } = require("@valis/class.validation");

    router.post("/", validate(create), ClassController.create);
    ```

### Database Interaction
-   All database queries must be performed within the **Service** layer using the Prisma client.
-   The Prisma client should be imported from the central config file: `require('../../config/prisma')`.

### Singleton Instances
-   Controller and Service classes should be exported as singleton instances to maintain a single, consistent state and avoid unnecessary instantiation.
    ```javascript
    // At the end of a controller or service file
    module.exports = new ClassController();
    ```
