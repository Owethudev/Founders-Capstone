# MongoDB Schema Design for Community Tool-Sharing Platform

## Overview

This document defines professional Mongoose schemas for the core collections in the platform.

## Collections

- Users
- Tools
- BorrowRequests
- Messages
- Notifications
- Reviews
- Reports

## Why each field exists

### Users

- name: identifies the account holder clearly in the UI and communications.
- email: required for sign-in, account recovery, and notifications.
- passwordHash: stores a secure hashed password instead of plain text.
- phone: optional contact method for coordination and trust.
- avatarUrl: improves profile recognition and user experience.
- bio: gives users a short introduction for community trust.
- location: supports nearby tool discovery and community-based matching.
- role: distinguishes regular users from moderators and admins.
- isVerified: helps signal trusted users in the marketplace.
- isActive: allows account suspension or soft-deactivation without deletion.
- isSuspended: supports moderation and safety enforcement.
- reputationScore: reflects trust and reliability over time.
- lastSeenAt: supports recent activity and engagement features.

### Tools

- ownerId: links each tool to its owner for permissions and ownership rules.
- title: a human-readable product name for discovery.
- description: explains what the tool is, how it works, and any notes.
- category: allows filtering and grouping by tool type.
- subcategory: improves precision for browsing within large categories.
- condition: helps borrowers understand wear and usefulness.
- priceType: supports free, hourly, daily, or negotiable rental models.
- priceAmount: stores the numeric rental price for pricing logic.
- depositAmount: protects the lender and supports refundable security deposits.
- location: enables nearby search and local discovery.
- availabilityStart/availabilityEnd: defines the tool’s availability window.
- images: supports visual browsing and trust.
- isActive: hides inactive listings without deleting them.
- isFeatured: supports promotional or highlighted listings.
- viewCount: helps track popularity and demand.
- averageRating/reviewCount: surfaces trust signals for borrowers.

### BorrowRequests

- toolId: links the request to the exact tool being borrowed.
- borrowerId: identifies the person requesting access.
- ownerId: identifies the lender who must approve the request.
- startDate/endDate: define the requested rental period.
- status: tracks the lifecycle of the request.
- message: captures borrower intent and special notes.
- pickupLocation: helps coordinate the exchange.
- totalAmount/depositAmount: records the financial terms clearly.
- responseMessage: stores owner responses such as approval or counteroffers.
- acceptedAt/completedAt: supports reporting, timeline tracking, and analytics.

### Messages

- borrowRequestId: scopes conversation to a specific transaction.
- senderId/receiverId: identifies participants in the conversation.
- body: stores the message content.
- attachments: supports optional files or images.
- readAt: tracks whether the receiver has seen the message.

### Notifications

- recipientId: identifies who should receive the alert.
- type: categorizes the notification for display and filtering.
- title/body: provide a user-friendly alert message.
- entityType/entityId: link the notification to a relevant entity.
- isRead: supports inbox state and unread counts.
- actionUrl: allows navigation to the relevant page.

### Reviews

- borrowRequestId: ties a review to a completed transaction.
- reviewerId/revieweeId: identify the parties involved.
- rating: captures the quality of the exchange.
- comment: provides useful qualitative feedback.
- isVisible: supports moderation and content filtering.

### Reports

- reporterId: identifies the user who filed the report.
- reportedUserId/reportedToolId: identifies what is being reported.
- reason: standardizes common moderation categories.
- description: gives context for review.
- status: tracks moderation workflow.
- adminNote: records moderator follow-up actions.

## Indexes

Indexes are included for:

- fast user lookup by email
- geospatial search for nearby tools and users
- filtering tools by category, activity, and pricing type
- efficient borrow request lookup by status and date
- recent messages and notifications retrieval
- review listing and moderation queues

## Naming conventions

- Use camelCase for field names in JavaScript and MongoDB documents.
- Use singular, descriptive model names such as User, Tool, BorrowRequest, Message.
- Use collection names in lowercase, plural form such as users, tools, borrowRequests.
- Use consistent status enums and role names.

## Notes

These schemas are designed to be production-friendly, easy to evolve, and suitable for future authentication, booking, messaging, moderation, and search features.
