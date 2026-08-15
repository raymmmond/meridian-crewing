import React from "react";
import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import Positions from "../components/Positions";
import SeafarerDashboard from "../components/SeafarerDashboard";
import Process from "../components/Process";
import Employers from "../components/Employers";

const HomePage: React.FC = () => (
  <>
    <Hero />
    <TrustBar />
    <Positions />
    <SeafarerDashboard />
    <Process />
    <Employers />
  </>
);

export default HomePage;
