import React from "react";
import GlobalStyle from "./GlobalStyle";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CrewingProvider } from "./context/CrewingContext";
import ConnectionBanner from "./components/ConnectionBanner";
import ResetPasswordModal from "./components/ResetPasswordModal";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import Positions from "./components/Positions";
import SeafarerDashboard from "./components/SeafarerDashboard";
import Process from "./components/Process";
import Employers from "./components/Employers";
import Footer from "./components/Footer";

// Split out so it can call useAuth() — App itself renders AuthProvider,
// so it can't call the hook that provider exposes at its own top level.
const AppShell: React.FC = () => {
  const { passwordRecoveryMode } = useAuth();

  return (
    <CrewingProvider>
      <GlobalStyle />
      <ConnectionBanner />
      <Nav />
      <Hero />
      <TrustBar />
      <Positions />
      <SeafarerDashboard />
      <Process />
      <Employers />
      <Footer />
      {passwordRecoveryMode && <ResetPasswordModal />}
    </CrewingProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
};

export default App;
