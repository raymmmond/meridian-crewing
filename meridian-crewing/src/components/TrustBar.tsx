import React from "react";
import styled from "styled-components";
import theme from "../theme";

const Wrap = styled.section`
  border-top: 1px solid ${theme.color.navy700};
  border-bottom: 1px solid ${theme.color.navy700};
  background: ${theme.color.navy900};
`;

const Grid = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 0 32px;

  @media (min-width: 800px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Stat = styled.div`
  padding: 36px 20px;
  border-right: 1px solid ${theme.color.navy700};

  &:nth-child(2n) {
    border-right: none;
  }

  @media (min-width: 800px) {
    &:nth-child(2n) {
      border-right: 1px solid ${theme.color.navy700};
    }
    &:last-child {
      border-right: none;
    }
  }
`;

const Num = styled.div`
  font-family: ${theme.font.display};
  font-size: 2.4rem;
  color: ${theme.color.white};
  font-weight: 600;
`;

const Label = styled.div`
  margin-top: 6px;
  font-family: ${theme.font.mono};
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.color.steelLight};
`;

const stats: Array<[string, string]> = [
  ["9,400+", "Seafarers placed"],
  ["340", "Partner fleets"],
  ["46", "Flag states covered"],
  ["11 days", "Avg. time to sign-on"],
];

const TrustBar: React.FC = () => (
  <Wrap>
    <Grid>
      {stats.map(([num, label]) => (
        <Stat key={label}>
          <Num>{num}</Num>
          <Label>{label}</Label>
        </Stat>
      ))}
    </Grid>
  </Wrap>
);

export default TrustBar;
