import { Tool, User } from "../types";
import { ToolCard } from "./ToolCard";

interface MyPostedToolsScreenProps {
  currentUser: User; // The logged-in user
  allTools: Tool[]; // All tools in the system
  onAddTool: () => void; // Open add tool flow
  onRemoveTool: (toolId: string) => void; // Remove a tool from the list
  onToolClick: (tool: Tool) => void; // View tool details
  onBack: () => void; // Go back to home
}

export function MyPostedToolsScreen({
  currentUser,
  allTools,
  onAddTool,
  onRemoveTool,
  onToolClick,
  onBack,
}: MyPostedToolsScreenProps) {
  const myTools = allTools.filter((tool) => tool.owner.id === currentUser.id);

  return (
    <div className="my-posted-tools">
      <header className="posted-tools-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h1>My Posted Tools</h1>
        <button className="add-tool-btn" onClick={onAddTool}>
          + Post a New Tool
        </button>
      </header>

      {myTools.length > 0 ? (
        <div className="posted-tools-grid">
          {myTools.map((tool) => (
            <div key={tool.id} className="my-tool-card">
              <ToolCard
                tool={tool}
                onClick={(toolId) => {
                  const selectedTool = myTools.find(
                    (item) => item.id === toolId,
                  );
                  if (selectedTool) {
                    onToolClick(selectedTool);
                  }
                }}
              />
              {tool.isBorrowed && (
                <div className="borrowed-badge">Currently borrowed</div>
              )}
              <div className="tool-actions">
                <button
                  className="edit-btn"
                  onClick={() => window.alert("Edit is coming soon!")}
                >
                  Edit
                </button>
                <button
                  className="remove-btn"
                  onClick={() => onRemoveTool(tool.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-tools">
          <p>You haven't posted any tools yet.</p>
          <button onClick={onAddTool}>Post Your First Tool</button>
        </div>
      )}
    </div>
  );
}
