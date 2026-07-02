import { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ToolDetailScreen } from "./components/ToolDetailScreen";
import { BookingForm } from "./components/BookingForm";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { User, Tool, Booking } from "./types";

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(
    null,
  );

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

  return currentUser ? (
    <div className="app-shell">
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
