import React, { useState } from "react";
import styled from "styled-components";
import theme from "../theme";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(8, 20, 32, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${theme.color.navy700};

  @media (min-width: 760px) {
    padding: 18px 32px;
  }
`;

const Word = styled.a`
  font-family: ${theme.font.display};
  font-size: 0.92rem;
  color: ${theme.color.white};
  letter-spacing: 0.02em;
  white-space: nowrap;

  @media (min-width: 760px) {
    font-size: 1.15rem;
  }
`;

const Links = styled.nav`
  display: none;
  gap: 28px;
  font-family: ${theme.font.mono};
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (min-width: 760px) {
    display: flex;
  }

  a {
    color: ${theme.color.steelLight};
    transition: color 0.15s ease;
  }
  a:hover {
    color: ${theme.color.paper};
  }
`;

const CTA = styled.a`
  display: none;
  border: 1px solid ${theme.color.rustLight};
  color: ${theme.color.rustLight};
  padding: 9px 18px;
  font-family: ${theme.font.mono};
  font-size: 0.76rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;

  @media (min-width: 760px) {
    display: inline-block;
  }

  &:hover {
    background: ${theme.color.rustLight};
    color: ${theme.color.navy900};
  }
`;

const AccountArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 760px) {
    gap: 14px;
  }
`;

const AccountEmail = styled.span`
  display: none;
  font-family: ${theme.font.mono};
  font-size: 0.76rem;
  color: ${theme.color.steelLight};

  @media (min-width: 760px) {
    display: inline;
  }
`;

const GhostButton = styled.button`
  background: transparent;
  border: 1px solid ${theme.color.steel};
  color: ${theme.color.steelLight};
  padding: 9px 12px;
  font-family: ${theme.font.mono};
  font-size: 0.74rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;

  @media (min-width: 760px) {
    padding: 9px 16px;
    font-size: 0.76rem;
  }

  &:hover {
    border-color: ${theme.color.paperDim};
    color: ${theme.color.paper};
  }
`;

const RustButton = styled.button`
  border: 1px solid ${theme.color.rustLight};
  color: ${theme.color.rustLight};
  background: transparent;
  padding: 9px 14px;
  font-family: ${theme.font.mono};
  font-size: 0.74rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;

  @media (min-width: 760px) {
    padding: 9px 18px;
    font-size: 0.76rem;
  }

  &:hover {
    background: ${theme.color.rustLight};
    color: ${theme.color.navy900};
  }
`;

const Nav: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Bar>
        <Word href="#top">MERIDIAN CREWING</Word>
        <Links>
          <a href="#positions">Open berths</a>
          <a href="#process">How it works</a>
          <a href="#employers">Employers</a>
        </Links>
        <AccountArea>
          {!loading && user ? (
            <>
              <AccountEmail>
                {user.email} · {user.role === "SEAFARER" ? "Seafarer" : "Employer"}
              </AccountEmail>
              <GhostButton onClick={logout}>Log out</GhostButton>
            </>
          ) : (
            <RustButton onClick={() => setAuthOpen(true)}>Log in</RustButton>
          )}
          <CTA href="#positions">Browse berths</CTA>
        </AccountArea>
      </Bar>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
};

export default Nav;
