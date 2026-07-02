import { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ToolDetailScreen } from "./components/ToolDetailScreen";
import { BookingForm } from "./components/BookingForm";
import { User, Tool, Booking } from "./types";

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

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
    console.log("Booking confirmed", newBooking);
    setBooking(null);
    setSelectedTool(null);
  };

  const handleCancelBooking = () => {
    setBooking(null);
  };

  return currentUser ? (
    <div className="app-shell">
      {selectedTool ? (
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
