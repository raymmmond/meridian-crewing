import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import theme from "../theme";
import { useAuth } from "../context/AuthContext";
import DeleteAccountModal from "./DeleteAccountModal";

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

  @media (min-width: 900px) {
    grid-template-columns: 1.2fr 1fr 1fr 1fr;
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

const DeleteAccountLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-family: ${theme.font.mono};
  font-size: 0.72rem;
  color: ${theme.color.steelLight};
  text-decoration: underline;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    color: ${theme.color.rustLight};
  }
`;

const Footer: React.FC = () => {
  const { user } = useAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
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
          <div>
            <ColTitle>Legal</ColTitle>
            <ColLink as={Link} to="/terms">Terms of Service</ColLink>
            <ColLink as={Link} to="/privacy">Privacy Policy</ColLink>
          </div>
        </Top>
        <Bottom>
          <span>© 2026 Meridian Crewing. Partner agencies hold valid national manning licenses (DMW, RPSL, or equivalent) and operate under MLC 2006.</span>
          {user ? (
            <DeleteAccountLink type="button" onClick={() => setDeleteOpen(true)}>
              Delete my account
            </DeleteAccountLink>
          ) : (
            <span>Rotterdam · Manila · Panama City</span>
          )}
        </Bottom>
      </Inner>
      {deleteOpen && <DeleteAccountModal onClose={() => setDeleteOpen(false)} />}
    </Wrap>
  );
};

export default Footer;
