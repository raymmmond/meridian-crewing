import styled from "styled-components";
import theme from "../theme";

export const LegalWrap = styled.main`
  max-width: 780px;
  margin: 0 auto;
  padding: 80px 32px 120px;
`;

export const LegalMeta = styled.p`
  font-family: ${theme.font.mono};
  font-size: 0.78rem;
  color: ${theme.color.steelLight};
  margin-bottom: 40px;
`;

export const LegalTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 2.8rem);
  color: ${theme.color.white};
  margin-bottom: 8px;
`;

export const LegalNotice = styled.div`
  border: 1px solid ${theme.color.rustLight};
  background: ${theme.color.navy700};
  padding: 18px 20px;
  margin-bottom: 40px;
  font-family: ${theme.font.mono};
  font-size: 0.82rem;
  line-height: 1.7;
  color: ${theme.color.paper};
`;

export const LegalH2 = styled.h2`
  font-size: 1.3rem;
  color: ${theme.color.white};
  margin: 36px 0 14px;
`;

export const LegalP = styled.p`
  font-size: 0.95rem;
  line-height: 1.75;
  color: ${theme.color.steelLight};
  margin-bottom: 14px;
`;

export const LegalUl = styled.ul`
  margin: 0 0 14px;
  padding-left: 22px;
  color: ${theme.color.steelLight};
  font-size: 0.95rem;
  line-height: 1.75;

  li {
    margin-bottom: 6px;
  }
`;

export const LegalTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
  font-size: 0.88rem;

  th,
  td {
    border: 1px solid ${theme.color.navy700};
    padding: 10px 12px;
    text-align: left;
    color: ${theme.color.steelLight};
  }

  th {
    color: ${theme.color.paper};
    font-family: ${theme.font.mono};
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export const LegalStrong = styled.strong`
  color: ${theme.color.paper};
`;

export const BackLink = styled.a`
  display: inline-block;
  margin-bottom: 32px;
  font-family: ${theme.font.mono};
  font-size: 0.8rem;
  color: ${theme.color.brass};
`;
