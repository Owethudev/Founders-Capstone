// src/types.ts - This file defines what data looks like in our app

// User interface - describes what a person looks like in our system
interface User {
  id: string; // Unique identifier for each user
  name: string; // Person's name
  email: string; // Person's email address
  phone: string; // Person's phone number
  location: {
    // Where the person lives
    latitude: number; // GPS latitude
    longitude: number; // GPS longitude
    address: string; // Street address as text
  };
  joinedDate: Date; // When they signed up
}

// Tool interface - describes what a tool/item looks like
interface Tool {
  id: string; // Unique identifier for each tool
  name: string; // Tool name (e.g., "Drill")
  description: string; // What it is and condition
  category: string; // Category (e.g., "Power Tools")
  imageUrl: string; // Picture of the tool
  owner: User; // Who owns it
  isBorrowed: boolean; // Is someone currently borrowing it?
  distance: number; // How many km away from user
  postedDate: Date; // When was it posted
}

// Booking interface - describes a booking request
interface Booking {
  id: string; // Unique booking ID
  toolId: string; // Which tool is being booked
  borrowerId: string; // Who wants to borrow it
  ownerId: string; // Who owns the tool
  bookingDate: Date; // When was it booked
  status: "confirmed" | "cancelled"; // What status is booking in
}

export type { User, Tool, Booking };
