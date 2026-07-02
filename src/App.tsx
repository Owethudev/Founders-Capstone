import { useEffect, useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ToolDetailScreen } from "./components/ToolDetailScreen";
import { BookingForm } from "./components/BookingForm";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { MyPostedToolsScreen } from "./components/MyPostedToolsScreen";
import { useDarkMode } from "./hooks/useDarkMode";
import { User, Tool, Booking } from "./types";
import { getAvailableTools } from "./services/toolService";
import { clearUser, getSavedUser, saveUser } from "./services/storage";

type Screen =
  | "welcome"
  | "home"
  | "detail"
  | "booking"
  | "confirmation"
  | "myTools";

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [allTools, setAllTools] = useState<Tool[]>(getAvailableTools());
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleRemoveTool = (toolId: string) => {
    setAllTools((previous) => previous.filter((tool) => tool.id !== toolId));
  };

  const handleAddTool = () => {
    if (!currentUser) {
      return;
    }

    const name = window.prompt("Tool name", "New tool");
    if (!name) {
      return;
    }

    const category = window.prompt("Category", "Hand Tools") ?? "Hand Tools";
    const description =
      window.prompt(
        "Short description",
        "A reliable tool shared by a neighbor.",
      ) ?? "A reliable tool shared by a neighbor.";

    const newTool: Tool = {
      id: crypto.randomUUID(),
      name,
      description,
      category,
      imageUrl: `https://source.unsplash.com/featured/300x300/?${encodeURIComponent(
        name,
      )}`,
      owner: currentUser,
      isBorrowed: false,
      distance: 1,
      postedDate: new Date(),
    };

    setAllTools((previous) => [newTool, ...previous]);
    setCurrentScreen("myTools");
  };

  useEffect(() => {
    const savedUser = getSavedUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      setCurrentScreen("home");
    }
  }, []);

  const handleLoginComplete = (user: User) => {
    setCurrentUser(user);
    saveUser(user);
    setCurrentScreen("home");
  };

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    setCurrentScreen("detail");
  };

  const handleBookTool = (tool: Tool) => {
    setSelectedTool(tool);
    setCurrentScreen("booking");
  };

  const handleBookingConfirm = (booking: Booking) => {
    setCurrentBooking(booking);
    setCurrentScreen("confirmation");
  };

  const handleViewMyTools = () => {
    setCurrentScreen("myTools");
  };

  const handleReturnHome = () => {
    setCurrentScreen("home");
    setSelectedTool(null);
    setCurrentBooking(null);
  };

  const handleLogout = () => {
    clearUser();
    setCurrentUser(null);
    setCurrentScreen("welcome");
  };

  const renderScreen = () => {
    if (!currentUser) {
      return <WelcomeScreen onLoginComplete={handleLoginComplete} />;
    }

    if (currentScreen === "welcome") {
      return <WelcomeScreen onLoginComplete={handleLoginComplete} />;
    }

    if (currentScreen === "home") {
      return (
        <HomeScreen
          currentUser={currentUser}
          tools={allTools}
          onToolClick={handleToolClick}
          onViewMyTools={handleViewMyTools}
        />
      );
    }

    if (currentScreen === "detail" && selectedTool) {
      return (
        <ToolDetailScreen
          tool={selectedTool}
          onBook={handleBookTool}
          onBack={() => setCurrentScreen("home")}
        />
      );
    }

    if (currentScreen === "booking" && selectedTool && currentUser) {
      return (
        <BookingForm
          tool={selectedTool}
          borrower={currentUser}
          onConfirm={handleBookingConfirm}
          onCancel={() => setCurrentScreen("detail")}
        />
      );
    }

    if (currentScreen === "confirmation" && currentBooking && selectedTool) {
      return (
        <BookingConfirmation
          booking={currentBooking}
          tool={selectedTool}
          onClose={handleReturnHome}
        />
      );
    }

    if (currentScreen === "myTools" && currentUser) {
      return (
        <MyPostedToolsScreen
          currentUser={currentUser}
          allTools={allTools}
          onAddTool={handleAddTool}
          onRemoveTool={handleRemoveTool}
          onToolClick={handleToolClick}
          onBack={() => setCurrentScreen("home")}
        />
      );
    }

    return (
      <HomeScreen
        currentUser={currentUser}
        tools={allTools}
        onToolClick={handleToolClick}
        onViewMyTools={handleViewMyTools}
      />
    );
  };

  return (
    <div className={`app-shell ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {currentUser && (
        <header className="app-header">
          <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button
            className="logout-btn"
            onClick={handleLogout}
            aria-label="Log out"
          >
            Logout
          </button>
        </header>
      )}
      {renderScreen()}
    </div>
  );
}
