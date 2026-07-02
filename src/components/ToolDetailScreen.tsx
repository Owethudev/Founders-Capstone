import { Tool } from "../types";

interface ToolDetailScreenProps {
  tool: Tool; // The tool to display
  onBook: (tool: Tool) => void; // What to do when "Book Now" clicked
  onBack: () => void; // What to do when back button clicked
}

export function ToolDetailScreen({
  tool,
  onBook,
  onBack,
}: ToolDetailScreenProps) {
  return (
    <div className="detail-screen">
      {/* Back button */}
      <button onClick={onBack} className="back-btn">
        ← Back
      </button>

      {/* Large tool image */}
      <img src={tool.imageUrl} alt={tool.name} className="detail-image" />

      {/* Tool information section */}
      <div className="detail-content">
        <h1>{tool.name}</h1>
        <p className="description">{tool.description}</p>
        <p className="category">Category: {tool.category}</p>
        <p className="distance">Distance: {tool.distance} km away</p>
      </div>

      {/* Owner information section */}
      <div className="owner-section">
        <h2>Posted by:</h2>
        <div className="owner-info">
          <p>
            <strong>{tool.owner.name}</strong>
          </p>
          <p>📧 {tool.owner.email}</p>
          <p>📱 {tool.owner.phone}</p>
          <p>📍 {tool.owner.location.address}</p>
        </div>
      </div>

      {/* Booking section */}
      {!tool.isBorrowed && (
        <button className="book-now-btn" onClick={() => onBook(tool)}>
          Book Now
        </button>
      )}

      {/* Show if already borrowed */}
      {tool.isBorrowed && (
        <p className="unavailable-message">
          This tool is currently being borrowed
        </p>
      )}
    </div>
  );
}
