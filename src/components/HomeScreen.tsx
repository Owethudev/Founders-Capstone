// src/components/HomeScreen.tsx
import { useState } from "react";
import { Tool, User } from "../types";
import { ToolCard } from "./ToolCard";
import { mockTools } from "../data/mockTools";

// Props interface defines what data HomeScreen receives from parent (App.tsx)
interface HomeScreenProps {
  currentUser: User; // The logged-in user object
  onToolClick: (tool: Tool) => void; // Function to call when user clicks a tool
  onViewMyTools: () => void; // Function to navigate to "my posted tools" page
}

// HomeScreen component - main browsing page where users see all available tools
// This is the first screen users see after logging in
export function HomeScreen({
  currentUser,
  onToolClick,
  onViewMyTools,
}: HomeScreenProps) {
  // State to hold all tools we're displaying
  // Initialize with mockTools from our data file
  const [tools, setTools] = useState<Tool[]>(mockTools);

  // Map through tools array and create a ToolCard component for each one
  // .map() transforms each tool object into a ToolCard component
  const toolCards = tools.map((tool) => (
    <ToolCard
      key={tool.id} // React needs a unique key for lists - helps with re-rendering
      tool={tool} // Pass the tool data to ToolCard component
      onClick={(toolId) => {
        // When ToolCard is clicked, this function is called with the tool's ID
        // Find the actual tool object by ID
        const selectedTool = tools.find((t) => t.id === toolId);
        // If we found it, pass it to parent component (App.tsx)
        if (selectedTool) {
          onToolClick(selectedTool);
        }
      }}
    />
  ));

  return (
    <div className="home-screen">
      {/* Header section - displays app name and welcome message */}
      <header className="home-header">
        {/* App name - BackyardBuds */}
        <h1>BackyardBuds</h1>

        {/* Personalized welcome message using logged-in user's name */}
        <p>Welcome, {currentUser.name}!</p>

        {/* Navigation button to "My Posted Tools" page - Decision 8 in action */}
        {/* Allows users to see and manage tools they've posted */}
        <button
          className="my-tools-btn"
          onClick={onViewMyTools} // Triggers parent's onViewMyTools function
          aria-label="View my posted tools" // Accessibility label
        >
          My Posted Tools
        </button>
      </header>

      {/* Tools grid - displays all available tools */}
      <div className="tools-grid">
        {/* Conditional rendering: check if we have any tools */}
        {toolCards.length > 0 ? (
          toolCards // Show all the tool card components if tools exist
        ) : (
          <p>No tools available</p> // Show this message if no tools (empty state)
        )}
      </div>
    </div>
  );
}
