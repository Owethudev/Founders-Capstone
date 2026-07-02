import { useState } from "react";
import { Tool, Booking, User } from "../types";
import { createBooking } from "../services/toolService";

interface BookingFormProps {
  tool: Tool; // Tool being booked
  borrower: User; // User borrowing the tool
  onConfirm: (booking: Booking) => void; // What to do when confirmed
  onCancel: () => void; // What to do when cancelled
}

export function BookingForm({
  tool,
  borrower,
  onConfirm,
  onCancel,
}: BookingFormProps) {
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    const booking = createBooking(tool, borrower);
    onConfirm(booking);
  };

  return (
    <div className="booking-form">
      <h2>Confirm Your Booking</h2>

      <div className="booking-summary">
        <p>
          <strong>Tool:</strong> {tool.name}
        </p>
        <p>
          <strong>Owner:</strong> {tool.owner.name}
        </p>
        <p>
          <strong>Contact:</strong> {tool.owner.phone}
        </p>
      </div>

      <div className="borrower-section">
        <p>
          <strong>Your Name:</strong> {borrower.name}
        </p>
        <p>
          <strong>Your Phone:</strong> {borrower.phone}
        </p>
      </div>

      <div className="notes-section">
        <label htmlFor="notes">Any notes for the owner?</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="When do you need it? Any special instructions?"
        />
      </div>

      <div className="booking-actions">
        <button className="confirm-btn" onClick={handleConfirm}>
          Confirm Booking
        </button>
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
