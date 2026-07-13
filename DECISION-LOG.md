# Decision Log

At least 8 real entries. Generic entries score nothing. Use this shape:

## Decision: [what you decided]

- Context:
- Options I considered:
- What I chose and why:
- What I gave up:

---

## Decision: 1 - Product Name: BackyardBuds

- Context: The initial product name "Pddle Thabo" was not resonating with the target market and didn't communicate the community lending purpose.
- Options I considered: Keep "Pddle Thabo", rebrand to "ToolShare", "Community Lend", "BackyardBuds"
- What I chose and why: Chose "BackyardBuds" because it's memorable, friendly, community focused and immediately communicates the neighborhood/backyard aspect of tool borrowing.
- What I gave up: The original name the founder gave us which lacked market appeal.

---

## Decision: 2 - Platform Type: Community Borrowing System (Not Marketplace)

- Context: Initial brief specified a marketplace but the actual use case is enabling neighbors to borrow tools from each other without commercial transactions.
- Options I considered: Build a full marketplace with vendor management, create a community lending platform, hybrid approach
- What I chose and why: Community lending platform because it removes complexity, eliminates payment processing and aligns with the non commercial borrowing mission where neighbors help neighbors.
- What I gave up: Potential revenue generation through transaction fees or vendor commission models.

---

## Decision: 3 - Payment Model: Free Borrowing Only (Removed Paid Option)

- Context: Brief requested both free and paid borrowing options when searching for product but this conflicts with the community first mission.
- Options I considered: paid transactions and the borrowing and free only model
- What I chose and why: Free only borrowing because it reinforces community values, reduces platform complexity, eliminates payment processing infrastructure and removes friction from the borrowing experience.
- What I gave up: Monetization potential and revenue streams from tool rentals.

---

## Decision: 4 - Booking System: Frontend Confirmation + Contact Details (Not Backend Booking)prevents spam, and builds user accountability while keeping implementation straightforward on frontend.

- Context: A full backend booking system would require server side infrastructure not currently available. Users need a way to express interest and confirm bookings.
- Options I considered: Full backend booking system, email-based booking, frontend confirmation form with contact exchange, direct messaging
- What I chose and why: Frontend confirmation form that captures borrower information, displays lender details and removes the item after confirmation. This keeps the project frontend focused and gives users direct contact information for coordination.
- What I gave up: Automated backend booking management, persistent booking history, and booking status tracking.

---

## Decision: 5 - User Authentication: Implementing Login Feature

- Context: Users need identity verification to post tools and maintain profiles without anonymous abuse.
- Options I considered: No authentication, simple email verification, full login system, OAuth integration
- What I chose and why: a welcome page that has a form and after clicking the submit information button it takes you to the available tools page.
- What I gave up: Guest posting capability and anonymous borrowing/lending.

---

## Decision: 6 - Excluded "3 People Looking" Social Feature

- Context: Original brief requested showing when multiple people are interested in a tool, creating social proof/urgency.
- Options I considered: Implement the feature, exclude it, implement as phase 2
- What I chose and why: Excluded it because it's unnecessary for core functionality, adds visual clutter and doesn't improve the user experience for a community borrowing platform focused on simple tool exchange.
- What I gave up: Social proof mechanics that might increase perceived demand.

---

## Decision: 7 - Messaging: Excluded In-App Messaging (Use Contact Details Instead)

- Context: Inapp messaging was requested but frontend-only implementation cannot persist conversations or guarantee message delivery.
- Options I considered: Build inapp messaging, use contact details for external communication, hybrid with external links
- What I chose and why: Use direct contact details (phone/email) displayed when booking because it's simpler, doesn't require backend , leverages existing communication platforms and is more reliable for coordination.
- What I gave up: Unified inapp communication experience and message history tracking.

---

## Decision: 8 - UI Implementation: Dark Mode Support + Tool Card Layout with Images

- Context: Users need an intuitive interface to browse tools, and dark mode improves accessibility and user preference satisfaction.
- Options I considered: Light mode only, dark mode only, light mode with optional dark toggle
- What I chose and why: Implemented dark mode toggle alongside card-based layout with tool images. This improves visual browsing experience, reduces eye strain, accommodates user preferences and makes the platform visually appealing with immediate tool identification via images below which sits an action button for details/booking form.
- What I gave up: Simplified styling requirements, but gained better user experience and modern UI standards.
