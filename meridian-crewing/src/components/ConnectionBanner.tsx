import React from "react";
import styled from "styled-components";
import theme from "../theme";
import { useCrewing } from "../context/CrewingContext";

const Bar = styled.div`
  background: ${theme.color.rust};
  color: ${theme.color.white};
  font-family: ${theme.font.mono};
  font-size: 0.8rem;
  text-align: center;
  padding: 10px 20px;
  line-height: 1.5;
`;

const ConnectionBanner: React.FC = () => {
  const { connectionError } = useCrewing();

  if (!connectionError) return null;

  return (
    <Bar>
      Can't reach the backend ({connectionError}). Start it with{" "}
      <code>npm run dev</code> inside <code>meridian-backend</code>, then
      refresh this page.
    </Bar>
  );
};

export default ConnectionBanner;
