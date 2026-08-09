import React from "react";
import GlobalStyle from "./GlobalStyle";
import { AuthProvider } from "./context/AuthContext";
import { CrewingProvider } from "./context/CrewingContext";
import ConnectionBanner from "./components/ConnectionBanner";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import Positions from "./components/Positions";
import SeafarerDashboard from "./components/SeafarerDashboard";
import Process from "./components/Process";
import Employers from "./components/Employers";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <AuthProvider>
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
      </CrewingProvider>
    </AuthProvider>
  );
};

export default App;
