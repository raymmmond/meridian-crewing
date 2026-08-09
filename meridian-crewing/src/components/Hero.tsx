import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import theme from "../theme";

const scan = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 0 -400px; }
`;

const Wrap = styled.section`
  position: relative;
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 120px 32px 80px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(8, 20, 32, 0.55) 0%, rgba(8, 20, 32, 0.92) 78%, ${theme.color.navy800} 100%),
    repeating-linear-gradient(
      100deg,
      ${theme.color.navy900} 0px,
      ${theme.color.navy900} 2px,
      ${theme.color.navy700} 2px,
      ${theme.color.navy700} 400px
    );
  background-size: cover, 100% 800px;
  animation: ${scan} 44s linear infinite;
`;

const Eyebrow = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.78rem;
  letter-spacing: 0.22em;
  color: ${theme.color.rustLight};
  text-transform: uppercase;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    background: ${theme.color.rustLight};
    display: inline-block;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(224, 103, 43, 0.2);
  }
`;

const Headline = styled.h1`
  font-size: clamp(2.8rem, 8vw, 6.2rem);
  line-height: 0.96;
  font-weight: 600;
  color: ${theme.color.white};
  max-width: 17ch;

  span {
    color: transparent;
    -webkit-text-stroke: 1.5px ${theme.color.paperDim};
  }
`;

const Sub = styled.p`
  margin-top: 28px;
  max-width: 48ch;
  font-size: 1.08rem;
  line-height: 1.6;
  color: ${theme.color.steelLight};
`;

const Actions = styled.div`
  margin-top: 44px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const Primary = styled.a`
  background: ${theme.color.rust};
  color: ${theme.color.white};
  border: none;
  padding: 16px 30px;
  font-family: ${theme.font.mono};
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${theme.color.rustLight};
    transform: translateY(-1px);
  }
`;

const Secondary = styled.a`
  border: 1px solid ${theme.color.steel};
  color: ${theme.color.paper};
  padding: 16px 30px;
  font-family: ${theme.font.mono};
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: ${theme.color.brass};
    color: ${theme.color.brass};
  }
`;

const Readout = styled.div`
  position: absolute;
  right: 32px;
  bottom: 40px;
  font-family: ${theme.font.mono};
  font-size: 0.78rem;
  color: ${theme.color.steelLight};
  text-align: right;
  line-height: 1.8;
  display: none;

  @media (min-width: 900px) {
    display: block;
  }

  strong {
    color: ${theme.color.paper};
    font-weight: 500;
  }
`;

function useTicking(start: number, step: number, intervalMs = 2200) {
  const [value, setValue] = useState(start);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => v + step), intervalMs);
    return () => clearInterval(id);
  }, [step, intervalMs]);
  return Math.round(value);
}

const Hero: React.FC = () => {
  const seafarers = useTicking(9412, 1);

  return (
    <Wrap id="top">
      <Eyebrow>128 berths open this week · sign-on from 11 days</Eyebrow>
      <Headline>
        Your next berth,<br />
        <span>signed on faster.</span>
      </Headline>
      <Sub>
        Meridian Crewing places qualified officers and ratings with vetted
        shipping companies worldwide — real vacancies, verified employers,
        and a manning desk that answers.
      </Sub>
      <Actions>
        <Primary href="#positions">Browse open positions</Primary>
        <Secondary href="#employers">Hire crew →</Secondary>
      </Actions>
      <Readout>
        <div>ACTIVE SEAFARERS <strong>{seafarers.toLocaleString()}</strong></div>
        <div>PARTNER FLEETS <strong>340</strong></div>
        <div>AVG SIGN-ON <strong>11 days</strong></div>
        <div>DESK STATUS <strong>OPEN 24/7</strong></div>
      </Readout>
    </Wrap>
  );
};

export default Hero;
