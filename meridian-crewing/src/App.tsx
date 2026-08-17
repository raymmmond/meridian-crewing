import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyle from "./GlobalStyle";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CrewingProvider } from "./context/CrewingContext";
import ConnectionBanner from "./components/ConnectionBanner";
import ResetPasswordModal from "./components/ResetPasswordModal";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

// Split out so it can call useAuth() — App itself renders AuthProvider,
// so it can't call the hook that provider exposes at its own top level.
const AppShell: React.FC = () => {
  const { passwordRecoveryMode } = useAuth();

  return (
    <CrewingProvider>
      <GlobalStyle />
      <ConnectionBanner />
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
      <Footer />
      {passwordRecoveryMode && <ResetPasswordModal />}
    </CrewingProvider>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
