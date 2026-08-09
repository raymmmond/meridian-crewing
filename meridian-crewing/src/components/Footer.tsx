import React from "react";
import styled from "styled-components";
import theme from "../theme";

const Wrap = styled.footer`
  background: ${theme.color.navy900};
  border-top: 1px solid ${theme.color.navy700};
  padding: 64px 32px 32px;
`;

const Inner = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid ${theme.color.navy700};

  @media (min-width: 800px) {
    grid-template-columns: 1.4fr 1fr 1fr;
  }
`;

const Word = styled.div`
  font-family: ${theme.font.display};
  font-size: 1.6rem;
  color: ${theme.color.white};
  letter-spacing: 0.02em;
`;

const Tag = styled.p`
  margin-top: 12px;
  font-size: 0.9rem;
  color: ${theme.color.steelLight};
  max-width: 32ch;
  line-height: 1.6;
`;

const ColTitle = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${theme.color.brass};
  margin-bottom: 14px;
`;

const ColLink = styled.a`
  display: block;
  font-size: 0.92rem;
  color: ${theme.color.paper};
  padding: 6px 0;
  transition: color 0.15s ease;

  &:hover {
    color: ${theme.color.rustLight};
  }
`;

const Bottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  padding-top: 24px;
  font-family: ${theme.font.mono};
  font-size: 0.72rem;
  color: ${theme.color.steelLight};
`;

const Footer: React.FC = () => (
  <Wrap>
    <Inner>
      <Top>
        <div>
          <Word>MERIDIAN CREWING</Word>
          <Tag>
            Manning desk open around the clock across three time zones —
            Rotterdam, Manila, Panama.
          </Tag>
        </div>
        <div>
          <ColTitle>Seafarers</ColTitle>
          <ColLink href="#positions">Open berths</ColLink>
          <ColLink href="#process">How sign-on works</ColLink>
          <ColLink href="#top">Register</ColLink>
        </div>
        <div>
          <ColTitle>Employers</ColTitle>
          <ColLink href="#employers">Post a vacancy</ColLink>
          <ColLink href="#employers">Candidate pool</ColLink>
          <ColLink href="#top">Talk to the desk</ColLink>
        </div>
      </Top>
      <Bottom>
        <span>© 2026 Meridian Crewing. IMO-recognised manning agent.</span>
        <span>Rotterdam · Manila · Panama City</span>
      </Bottom>
    </Inner>
  </Wrap>
);

export default Footer;
