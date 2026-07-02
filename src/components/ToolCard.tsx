// src/components/ToolCard.tsx
import { Tool } from "../types";

// This component shows ONE tool as a card
// It's used in the tools list and can be clicked to see full details
// This is a reusable component - we use it for each tool in the grid

// Props interface defines what data this component receives from parent
interface ToolCardProps {
  tool: Tool; // The tool object to display
  onClick: (toolId: string) => void; // Function to call when card is clicked
}

// ToolCard component - renders a single tool card
// Receives tool data and onClick callback as props
export function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    // Main card container - clickable
    <div
      className="tool-card"
      onClick={() => onClick(tool.id)} // When user clicks anywhere on card, call onClick with this tool's ID
      tabIndex={0} // Make div focusable for keyboard navigation
      role="button" // Tell screen readers this is a button
      aria-label={`View details for ${tool.name}`} // Accessibility label
      onKeyDown={(e) => {
        // Handle keyboard navigation
        if (e.key === "Enter" || e.key === " ") {
          // Enter or Space key
          e.preventDefault(); // Stop default behavior
          onClick(tool.id); // Trigger click handler
        }
      }}
    >
      {/* Tool image section */}
      <img
        src={tool.imageUrl} // URL to the tool's image
        alt={tool.name} // Alt text for accessibility (describes image if it fails to load)
        className="tool-image" // CSS class for styling
      />

      {/* Card content section - all text info goes here */}
      <div className="card-content">
        {/* Tool name as heading */}
        <h3 className="tool-name">{tool.name}</h3>

        {/* Category badge - shows what type of tool it is */}
        <span className="category-badge">{tool.category}</span>

        {/* Owner information */}
        <p className="owner-name">By {tool.owner.name}</p>

        {/* Distance from user - how far away the tool is */}
        <p className="distance">{tool.distance} km away</p>

        {/* Conditional rendering: only show if tool is currently borrowed */}
        {tool.isBorrowed && (
          <p className="borrowed-status">Currently borrowed</p>
        )}

        {/* Conditional rendering: only show button if tool is NOT borrowed */}
        {/* This prevents users from trying to book already-taken tools */}
        {!tool.isBorrowed && (
          <button
            className="view-details-btn"
            onClick={() => onClick(tool.id)} // Button also triggers the same click handler
            aria-label={`View details for ${tool.name}`} // Accessibility label for button
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
