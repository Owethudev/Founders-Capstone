# Software Design Document

## Community Tool-Sharing Platform

## 1. Overview

This document defines the architecture, data model, API surface, security posture, and delivery roadmap for a community-based tool-sharing platform. The product allows users to discover, borrow, and lend tools within their local community, with a focus on trust, safety, and a smooth booking experience.

### 1.1 Product Goal

Enable neighbors to share tools in a simple, trustworthy, and low-friction way, reducing unnecessary purchases while strengthening local community participation.

### 1.2 Target Users

- Borrowers seeking short-term access to tools
- Lenders who want to monetize or offset the cost of owned equipment
- Community managers or moderators for safety and policy enforcement

### 1.3 Scope for v1

- User registration and authentication
- Tool listing and discovery
- Search and filtering
- Booking and confirmation flow
- Messaging between borrower and lender
- Ratings and reviews
- Basic moderation and reporting

### 1.4 Out of Scope for v1

- Full marketplace payments and escrow
- Real-time map-based geospatial routing
- AI-based recommendations
- Multi-language support
- Full admin dashboard for large-scale operations

---

## 2. Functional Requirements

### 2.1 Authentication and Account Management

- Users can sign up, sign in, and recover accounts.
- Users can create a profile with name, location, bio, profile photo, and preferred contact method.
- Users can update their profile and manage notification preferences.
- Users can verify their email address.

### 2.2 Tool Listing Management

- Authenticated users can create, edit, and deactivate tool listings.
- Each listing must include title, description, category, availability window, condition, daily or hourly rate, deposit requirements, location, and images.
- Users can mark a tool as available or unavailable.
- Users can upload multiple images per listing.

### 2.3 Discovery and Search

- Users can browse all active listings.
- Users can search by keyword, category, price mode, and location radius.
- Users can filter by availability, price type, rating, and distance.
- Results should be sorted by relevance, proximity, and recency.

### 2.4 Booking Flow

- Borrowers can request a tool for a selected date/time range.
- The lender can approve, decline, or counteroffer the request.
- A booking transitions through statuses: pending, approved, rejected, canceled, completed.
- Users receive booking confirmation and reminder notifications.

### 2.5 Messaging

- Borrowers and lenders can exchange messages for a booking.
- Conversations should be scoped to a specific booking.
- Messages should support simple text content and optional media attachments.

### 2.6 Reviews and Reputation

- Users can leave reviews for completed bookings.
- Reviews must include a star rating and optional written feedback.
- Reviews should be visible on the user and tool profile.

### 2.7 Moderation and Safety

- Users can report listings, users, or messages.
- Admins can suspend accounts, hide tools, or remove inappropriate content.
- System should support blocklist and abuse-prevention rules.

### 2.8 Notifications

- Users receive notifications for booking updates, new messages, review requests, and account security events.

---

## 3. Non-Functional Requirements

### 3.1 Performance

- Initial page load should occur within 2 seconds on a standard broadband connection for logged-in users.
- Search and listing APIs should respond in under 500 ms for typical query loads.
- Image loading should be optimized with lazy loading and responsive sizing.

### 3.2 Reliability and Availability

- Core booking and authentication flows should maintain 99.9% availability target.
- The system should degrade gracefully in case of downstream service degradation.
- Automated backups and recovery procedures should be in place.

### 3.3 Security

- All data in transit must use HTTPS.
- Passwords must be hashed using strong adaptive algorithms.
- Role-based access control must enforce permissions for users, moderators, and admins.
- Sensitive data must be protected from injection, enumeration, and cross-site scripting attacks.

### 3.4 Scalability

- The architecture must support increasing users, listings, and bookings without a rewrite.
- The system should support horizontal scaling for API services and stateless application tiers.
- Search, storage, and caching should be separated where appropriate.

### 3.5 Maintainability

- The codebase should be modular, typed, and documented.
- Shared domain models and validation rules should be reused across frontend and backend.
- CI/CD pipelines should enforce linting, type-checking, and automated tests.

### 3.6 Accessibility and Usability

- The platform must support keyboard navigation and screen-reader compatibility.
- UI should be responsive for mobile, tablet, and desktop experiences.
- Error states and empty states must be clear and actionable.

---

## 4. User Stories

### 4.1 Borrower Stories

- As a borrower, I want to search for nearby tools so I can find what I need quickly.
- As a borrower, I want to view tool details and availability so I can decide confidently.
- As a borrower, I want to request a booking so I can use a tool without purchasing it.
- As a borrower, I want to chat with a lender so I can coordinate pickup details.
- As a borrower, I want to leave a review so I can help future users trust the platform.

### 4.2 Lender Stories

- As a lender, I want to list my tools so others can discover them.
- As a lender, I want to approve or reject bookings so I can stay in control of availability.
- As a lender, I want to communicate with borrowers so I can coordinate handoff smoothly.
- As a lender, I want to manage my reputation so others feel comfortable borrowing from me.

### 4.3 Moderator/Admin Stories

- As a moderator, I want to review reports so I can maintain a safe community.
- As an admin, I want to manage abuse and content issues so the platform remains trustworthy.

---

## 5. System Architecture

### 5.1 High-Level Architecture

The platform will follow a modular MERN-style architecture:

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Real-time communication: Socket.IO for messaging and live updates
- Object storage: Cloudinary or S3 for images
- Authentication: JWT with refresh tokens and secure cookie handling
- Search and filtering: MongoDB query layer with optional Atlas Search for advanced search
- Monitoring: Sentry, logging, and health endpoints

### 5.2 Component Overview

- Client application handles UI routing, state management, forms, and rendering.
- API layer exposes REST endpoints for authentication, listings, bookings, messages, reviews, and moderation.
- Domain services enforce business rules such as availability and booking conflict prevention.
- Persistence layer stores and retrieves data from MongoDB.
- Notification service sends email/push/in-app notifications.
- File upload service stores images and returns public URLs.

### 5.3 Deployment Architecture

- Frontend deployed to Vercel or Netlify
- Backend deployed to Render, Railway, Fly.io, or AWS ECS
- MongoDB Atlas as managed database
- CDN and image optimization for static assets
- Environment-based configuration with secrets management

### 5.4 Recommended Tech Stack

- Frontend: React, TypeScript, Vite, React Router, Zustand or Redux Toolkit
- Backend: Node.js, Express, TypeScript, Zod, JWT, Socket.IO
- Database: MongoDB Atlas
- Validation: Zod or Joi
- Testing: Vitest, Jest, Supertest, Playwright
- CI/CD: GitHub Actions

---

## 6. Folder Structure

### 6.1 Frontend Structure

```text
src/
  components/
    auth/
    booking/
    listings/
    messaging/
    profile/
    shared/
  pages/
    HomePage/
    ListingDetailPage/
    BookingPage/
    ProfilePage/
    MessagesPage/
  hooks/
  services/
  store/
  types/
  utils/
  styles/
  routes/
```

### 6.2 Backend Structure

```text
server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    sockets/
    utils/
    validators/
    tests/
  scripts/
```

### 6.3 Shared Structure

```text
shared/
  contracts/
    api/
    domain/
```

---

## 7. API Design

### 7.1 Conventions

- RESTful resource-oriented endpoints
- JSON request/response format
- Consistent error schema
- Pagination for list endpoints
- Versioning via `/api/v1`

### 7.2 Core Endpoints

#### Authentication

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

#### Users

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `GET /api/v1/users/:userId`

#### Tools

- `GET /api/v1/tools`
- `GET /api/v1/tools/:toolId`
- `POST /api/v1/tools`
- `PATCH /api/v1/tools/:toolId`
- `DELETE /api/v1/tools/:toolId`

#### Bookings

- `GET /api/v1/bookings`
- `GET /api/v1/bookings/:bookingId`
- `POST /api/v1/bookings`
- `PATCH /api/v1/bookings/:bookingId`

#### Messages

- `GET /api/v1/bookings/:bookingId/messages`
- `POST /api/v1/bookings/:bookingId/messages`

#### Reviews

- `POST /api/v1/bookings/:bookingId/reviews`
- `GET /api/v1/users/:userId/reviews`

#### Moderation

- `POST /api/v1/reports`
- `GET /api/v1/admin/reports`

### 7.3 Response Standards

- Success responses should return `data` and optional `meta` fields.
- Errors should return `error.code`, `error.message`, and `details` where appropriate.
- Rate limiting and validation failures should return clear HTTP status codes.

### 7.4 Recommended Status Codes

- `200` OK
- `201` Created
- `204` No Content
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `422` Unprocessable Entity
- `429` Too Many Requests
- `500` Internal Server Error

---

## 8. MongoDB Collections

### 8.1 Users

Stores account and profile information.

Fields:

- `_id`
- `name`
- `email`
- `passwordHash`
- `role` (`user`, `moderator`, `admin`)
- `location`
- `profilePhotoUrl`
- `bio`
- `ratingAverage`
- `reviewCount`
- `isVerified`
- `isActive`
- `createdAt`
- `updatedAt`

### 8.2 Tools

Stores tool listings available for borrowing.

Fields:

- `_id`
- `ownerId`
- `title`
- `description`
- `category`
- `subcategory`
- `condition`
- `priceType` (`free`, `daily`, `hourly`, `negotiable`)
- `priceAmount`
- `depositAmount`
- `location`
- `latitude`
- `longitude`
- `availabilityWindow`
- `images`
- `isActive`
- `createdAt`
- `updatedAt`

### 8.3 Bookings

Stores borrow requests and their lifecycle.

Fields:

- `_id`
- `toolId`
- `borrowerId`
- `lenderId`
- `startDate`
- `endDate`
- `status`
- `message`
- `totalAmount`
- `depositAmount`
- `createdAt`
- `updatedAt`

### 8.4 Messages

Stores conversation content between borrowers and lenders.

Fields:

- `_id`
- `bookingId`
- `senderId`
- `recipientId`
- `content`
- `attachments`
- `createdAt`

### 8.5 Reviews

Stores user-generated feedback after completed bookings.

Fields:

- `_id`
- `bookingId`
- `reviewerId`
- `revieweeId`
- `rating`
- `comment`
- `createdAt`

### 8.6 Reports

Stores moderation and safety reports.

Fields:

- `_id`
- `reporterId`
- `reportedUserId`
- `reportedToolId`
- `reason`
- `description`
- `status`
- `createdAt`

### 8.7 Notifications

Stores user-facing notification events.

Fields:

- `_id`
- `recipientId`
- `type`
- `payload`
- `isRead`
- `createdAt`

---

## 9. Relationships

### 9.1 Entity Relationships

- One User can own many Tools.
- One User can make many Bookings as a borrower.
- One User can receive many Bookings as a lender.
- One Tool can have many Bookings over time.
- One Booking can have many Messages.
- One Booking can have at most one Review.
- One User can receive many Reviews.
- One User can submit many Reports.

### 9.2 Relationship Notes

- Bookings should enforce that a tool is not double-booked for overlapping date ranges.
- Reviews should only be permitted after booking completion.
- Messages should be accessible only to participants in the booking.
- Tool visibility should be controlled by ownership and activity state.

---

## 10. Security Considerations

### 10.1 Authentication and Authorization

- Use password hashing with Argon2 or bcrypt.
- Use short-lived access tokens and refresh tokens.
- Store refresh tokens in secure httpOnly cookies or encrypted storage.
- Enforce authorization at both route and service levels.

### 10.2 Input Validation

- Validate all incoming payloads using schema validation.
- Reject malformed body data and disallow unexpected fields.
- Sanitize text fields to prevent stored XSS and injection issues.

### 10.3 Data Protection

- Encrypt sensitive data at rest where appropriate.
- Avoid exposing full user locations publicly unless explicitly permitted.
- Apply least-privilege access to admin and moderation capabilities.

### 10.4 Abuse Prevention

- Add rate limiting for auth and public endpoints.
- Use CAPTCHA or bot protection where appropriate for signup and repetitive requests.
- Enable moderation workflows and reporting endpoints.

### 10.5 Operational Security

- Store secrets in environment variables or a managed secret store.
- Use HTTPS everywhere and enforce HSTS headers.
- Enable dependency scanning and vulnerability monitoring.

---

## 11. Future Scalability

### 11.1 Horizontal Scaling

- Keep services stateless to support multiple API instances.
- Containerize backend services for orchestration in later phases.
- Use a managed database with read replicas if traffic increases.

### 11.2 Search and Discovery

- Introduce full-text search and geospatial indexing as data volume grows.
- Consider Elasticsearch or MongoDB Atlas Search for more advanced search features.

### 11.3 Real-Time Features

- Add WebSocket-based live presence indicators and push notifications.
- Improve message synchronization and offline support later.

### 11.4 Payments and Trust

- Integrate payment processing, deposits, and escrow flows.
- Add identity verification and insurance-like trust features.

### 11.5 Analytics and Growth

- Add event tracking for search, booking conversion, and retention trends.
- Introduce recommendation systems and community leaderboards over time.

---

## 12. ER Diagram (Text Version)

```text
User
  - _id
  - name
  - email
  - passwordHash
  - role
  - location
  - profilePhotoUrl
  - bio
  - ratingAverage
  - reviewCount
  - isVerified
  - isActive
  - createdAt
  - updatedAt

Tool
  - _id
  - ownerId -> User._id
  - title
  - description
  - category
  - condition
  - priceType
  - priceAmount
  - depositAmount
  - location
  - latitude
  - longitude
  - availabilityWindow
  - images
  - isActive
  - createdAt
  - updatedAt

Booking
  - _id
  - toolId -> Tool._id
  - borrowerId -> User._id
  - lenderId -> User._id
  - startDate
  - endDate
  - status
  - totalAmount
  - depositAmount
  - createdAt
  - updatedAt

Message
  - _id
  - bookingId -> Booking._id
  - senderId -> User._id
  - recipientId -> User._id
  - content
  - attachments
  - createdAt

Review
  - _id
  - bookingId -> Booking._id
  - reviewerId -> User._id
  - revieweeId -> User._id
  - rating
  - comment
  - createdAt

Report
  - _id
  - reporterId -> User._id
  - reportedUserId -> User._id
  - reportedToolId -> Tool._id
  - reason
  - description
  - status
  - createdAt

Notification
  - _id
  - recipientId -> User._id
  - type
  - payload
  - isRead
  - createdAt
```

---

## 13. Development Roadmap

### Phase 1 — Foundation

- Set up frontend shell and design system
- Implement authentication flows
- Create core user and tool models
- Build listing and search experience

### Phase 2 — Booking and Trust

- Implement booking creation and approval workflow
- Add messaging integration
- Build review flow and simple reputation display
- Add moderation and reporting endpoints

### Phase 3 — Production Readiness

- Add image upload and storage
- Introduce notification system
- Harden security and validations
- Add automated tests and CI/CD

### Phase 4 — Growth and Scale

- Add geospatial search and smarter discovery
- Introduce payments, deposits, and escrow
- Add analytics dashboards and growth features
- Support multi-region deployment and higher availability

---

## 14. Recommended Implementation Principles

- Prefer explicit domain models over ad-hoc data structures.
- Keep business rules centralized in services rather than duplicated across routes.
- Use strict TypeScript throughout frontend and backend.
- Build with testability in mind from day one.
- Design for mobile-first interactions and community trust.
- Make the product feel polished while remaining lean enough to launch quickly.
