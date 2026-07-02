import { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { HomeScreen } from "./components/HomeScreen";
import { User } from "./types";

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return currentUser ? (
    <div className="app-shell">
      <HomeScreen
        currentUser={currentUser}
        onToolClick={() => undefined}
        onViewMyTools={() => undefined}
      />
    </div>
  ) : (
    <WelcomeScreen onLoginComplete={setCurrentUser} />
  );
}
