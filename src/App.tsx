import { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ToolDetailScreen } from "./components/ToolDetailScreen";
import { User, Tool } from "./types";

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleBack = () => {
    setSelectedTool(null);
  };

  return currentUser ? (
    <div className="app-shell">
      {selectedTool ? (
        <ToolDetailScreen
          tool={selectedTool}
          onBack={handleBack}
          onBook={() => undefined}
        />
      ) : (
        <HomeScreen
          currentUser={currentUser}
          onToolClick={handleToolClick}
          onViewMyTools={() => undefined}
        />
      )}
    </div>
  ) : (
    <WelcomeScreen onLoginComplete={setCurrentUser} />
  );
}
