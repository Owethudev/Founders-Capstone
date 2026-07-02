import { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ToolDetailScreen } from "./components/ToolDetailScreen";
import { BookingForm } from "./components/BookingForm";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { MyPostedToolsScreen } from "./components/MyPostedToolsScreen";
import { useDarkMode } from "./hooks/useDarkMode";
import { User, Tool, Booking } from "./types";
import { mockTools } from "./data/mockTools";

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(
    null,
  );
  const [viewingMyTools, setViewingMyTools] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleBack = () => {
    setSelectedTool(null);
  };

  const handleStartBooking = (tool: Tool) => {
    setBooking({
      id: "",
      toolId: tool.id,
      borrowerId: "",
      ownerId: tool.owner.id,
      bookingDate: new Date(),
      status: "confirmed",
    });
  };

  const handleConfirmBooking = (newBooking: Booking) => {
    setConfirmedBooking(newBooking);
    setBooking(null);
  };

  const handleCancelBooking = () => {
    setBooking(null);
  };

  const handleCloseConfirmation = () => {
    setConfirmedBooking(null);
    setSelectedTool(null);
  };

  const handleViewMyTools = () => {
    setViewingMyTools(true);
  };

  const handleCloseMyTools = () => {
    setViewingMyTools(false);
  };

  return currentUser ? (
    <div className={`app-shell ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <header className="app-header">
        <button
          className="dark-mode-toggle"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>
      {confirmedBooking ? (
        <BookingConfirmation
          booking={confirmedBooking}
          tool={selectedTool as Tool}
          onClose={handleCloseConfirmation}
        />
      ) : selectedTool ? (
        booking ? (
          <BookingForm
            tool={selectedTool}
            borrowerName={currentUser.name}
            borrowerPhone={currentUser.phone}
            onConfirm={handleConfirmBooking}
            onCancel={handleCancelBooking}
          />
        ) : (
          <ToolDetailScreen
            tool={selectedTool}
            onBack={handleBack}
            onBook={handleStartBooking}
          />
        )
      ) : viewingMyTools ? (
        <MyPostedToolsScreen
          currentUser={currentUser}
          allTools={mockTools}
          onAddTool={() => undefined}
          onBack={handleCloseMyTools}
        />
      ) : (
        <HomeScreen
          currentUser={currentUser}
          onToolClick={handleToolClick}
          onViewMyTools={handleViewMyTools}
        />
      )}
    </div>
  ) : (
    <WelcomeScreen onLoginComplete={setCurrentUser} />
  );
}
