# Backend Structure

This backend follows a production-style Express folder structure that is easy to scale and maintain.

## Folder Responsibilities

### src/controllers

Responsible for handling HTTP requests and responses.

- Receives incoming requests from routes
- Calls appropriate services
- Sends response data back to the client
- Keeps request/response handling separate from business rules

### src/routes

Responsible for defining API endpoints.

- Maps URLs to controllers
- Organizes endpoints by feature or resource
- Keeps routing clean and modular

### src/models

Responsible for database schemas and data structure definitions.

- Defines Mongoose schemas
- Represents entities such as users, tools, bookings, and messages
- Centralizes data shape and validation rules

### src/middleware

Responsible for reusable request processing logic.

- Authentication checks
- Authorization checks
- Error handling
- Logging
- Request parsing and other cross-cutting concerns

### src/validators

Responsible for request validation.

- Validates incoming request bodies and params
- Ensures required fields are present
- Enforces data format and constraints
- Helps keep controllers thin and predictable

### src/config

Responsible for application configuration.

- Environment variables
- Database connection setup
- Third-party service configuration
- App-wide constants

### src/services

Responsible for core business operations.

- Contains reusable service functions
- Handles interaction with models and external APIs
- Keeps controllers focused on HTTP concerns

### src/utils

Responsible for helper functions and shared utilities.

- Common formatting helpers
- Date helpers
- Token helpers
- General-purpose reusable logic

### uploads

Responsible for storing uploaded files locally during development.

- Image uploads
- File attachments
- Temporary or local storage for non-production use

## Suggested Future Structure

You can later split feature-specific modules like:

- auth/
- tools/
- bookings/
- messages/

inside the main folders as the app grows.
