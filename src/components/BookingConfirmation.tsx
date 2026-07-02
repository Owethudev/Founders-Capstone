import { Booking, Tool } from "../types";

interface BookingConfirmationProps {
  booking: Booking; // The completed booking
  tool: Tool; // The tool that was booked
  onClose: () => void; // What to do when user closes this screen
}

export function BookingConfirmation({
  booking,
  tool,
  onClose,
}: BookingConfirmationProps) {
  return (
    <div className="confirmation-screen">
      <div className="success-icon">✓</div>
      <h1>Booking Confirmed!</h1>

      <div className="confirmation-details">
        <p>
          <strong>Tool:</strong> {tool.name}
        </p>
        <p>
          <strong>Owner:</strong> {tool.owner.name}
        </p>
        <p>
          <strong>Booking ID:</strong> {booking.id}
        </p>
        <p>
          <strong>Date Booked:</strong>{" "}
          {booking.bookingDate.toLocaleDateString()}
        </p>
      </div>

      <div className="next-steps">
        <h3>Next Steps:</h3>
        <ol>
          <li>
            Contact the owner: <strong>{tool.owner.phone}</strong>
          </li>
          <li>Arrange pickup time and location</li>
          <li>Enjoy your borrowed tool!</li>
        </ol>
      </div>

      <p className="info-message">
        This tool has been removed from the listing.
      </p>

      <button className="return-home-btn" onClick={onClose}>
        Return to Home
      </button>
    </div>
  );
}
