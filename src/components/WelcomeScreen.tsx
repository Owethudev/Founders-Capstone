// src/components/WelcomeScreen.tsx
import { useState } from "react";
import { User } from "../types";

// This component shows when app first loads
// Users must fill this out before seeing tools
// This enforces Decision 5: users must authenticate before browsing
interface WelcomeScreenProps {
  onLoginComplete: (user: User) => void; // Function to call when user submits form
}

export function WelcomeScreen({ onLoginComplete }: WelcomeScreenProps) {
  // State variables to store what user types in the form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // This runs when user clicks the "Get Started" button
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Stop page from reloading when form submits

    // Create a user object from what they typed into the form
    const newUser: User = {
      id: Math.random().toString(), // Generate unique ID (simplified - would use better method in production)
      name: name, // Name they typed
      email: email, // Email they typed
      phone: phone, // Phone they typed
      location: {
        latitude: -25.7461, // Mock coordinates for now (in real app, would use geolocation API)
        longitude: 28.2313, // These are approximately Johannesburg coordinates
        address: address, // Address they typed
      },
      joinedDate: new Date(), // Today's date - records when user signed up
    };

    // Tell parent component (App.tsx) that login is complete
    // This triggers navigation to home screen
    onLoginComplete(newUser);
  };

  return (
    <div className="welcome-container">
      {/* Main heading */}
      <h1>Welcome to BackyardBuds</h1>

      {/* Subheading explaining the app */}
      <p>Share and borrow tools with your neighbors</p>

      {/* Login form - captures user details */}
      <form onSubmit={handleSubmit}>
        {/* Name input field */}
        <input
          type="text"
          placeholder="Your name"
          value={name} // What's currently in this input
          onChange={(e) => setName(e.target.value)} // Update state when user types
          aria-label="Full name input" // For screen readers / accessibility
          required // Browser won't let user submit if empty
        />

        {/* Email input field */}
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Each keystroke updates state
          aria-label="Email address input"
          required
        />

        {/* Phone input field */}
        <input
          type="tel"
          placeholder="Your phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-label="Phone number input"
          required
        />

        {/* Address input field */}
        <input
          type="text"
          placeholder="Your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          aria-label="Street address input"
          required
        />

        {/* Submit button - triggers handleSubmit */}
        <button type="submit">Get Started</button>
      </form>
    </div>
  );
}
