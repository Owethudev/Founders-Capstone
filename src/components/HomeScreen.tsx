// src/components/HomeScreen.tsx
import { useState } from "react";
import { Tool, User } from "../types";
import { ToolCard } from "./ToolCard";
import { SearchBar } from "./SearchBar";
import { getAvailableTools, filterTools } from "../services/toolService";
import { categories } from "../data/mockTools";

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
  // Initialize with the type-safe service layer
  const [tools] = useState<Tool[]>(getAvailableTools());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxDistance, setMaxDistance] = useState(100);

  // Filter tools by search query, selected category, and max distance
  const filteredTools = filterTools(
    tools,
    searchQuery,
    selectedCategory,
    maxDistance,
  );

  // Map filtered tools into ToolCard components
  const toolCards = filteredTools.map((tool) => (
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

      {/* Search bar lets users filter the tool list by keyword */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Category filter buttons */}
      <div className="category-filter">
        <button
          className={selectedCategory === "All" ? "active" : ""}
          onClick={() => setSelectedCategory("All")}
          aria-pressed={selectedCategory === "All"}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => setSelectedCategory(category)}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Distance filter slider - lets users choose how far away tools can be */}
      <div className="distance-filter">
        <label htmlFor="distance-filter-range">
          Show tools within {maxDistance} km
        </label>
        <input
          id="distance-filter-range"
          type="range"
          min="1"
          max="10"
          step="1"
          value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
          aria-label="Filter tools by distance"
        />
      </div>

      {/* Tools grid - displays all available tools */}
      <div className="tools-grid">
        {/* Conditional rendering: check if we have any matching tools */}
        {toolCards.length > 0 ? (
          toolCards // Show filtered tool cards if any exist
        ) : (
          <p>No tools match your search</p> // Show this message if no tools match search
        )}
      </div>
    </div>
  );
}
