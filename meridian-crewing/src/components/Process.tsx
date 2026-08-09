import React from "react";
import styled from "styled-components";
import theme from "../theme";

const Wrap = styled.section`
  background: ${theme.color.navy900};
  border-top: 1px solid ${theme.color.navy700};
  border-bottom: 1px solid ${theme.color.navy700};
  padding: 100px 32px;
`;

const Inner = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  color: ${theme.color.white};
  margin-bottom: 56px;
`;

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;

  @media (min-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Step = styled.li`
  padding: 24px 24px 24px 0;
  border-top: 1px solid ${theme.color.navy700};

  @media (min-width: 900px) {
    border-top: none;
    border-left: 1px solid ${theme.color.navy700};
    padding: 4px 24px;

    &:first-child {
      border-left: none;
      padding-left: 0;
    }
  }
`;

const StepNum = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.75rem;
  color: ${theme.color.rustLight};
  margin-bottom: 14px;
`;

const StepTitle = styled.h3`
  font-size: 1.15rem;
  color: ${theme.color.white};
  margin-bottom: 10px;
`;

const StepDesc = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${theme.color.steelLight};
`;

const steps = [
  {
    num: "STEP 1",
    title: "Register your sea service",
    desc: "Create a profile with your CoC, STCW certificates and sea time — verified once, reused for every application.",
  },
  {
    num: "STEP 2",
    title: "Documents verified",
    desc: "Our manning desk checks certification and medical validity against the flag and vessel requirements.",
  },
  {
    num: "STEP 3",
    title: "Matched to a berth",
    desc: "You're shortlisted against open positions that fit your rank, vessel type and availability window.",
  },
  {
    num: "STEP 4",
    title: "Sign on",
    desc: "Contract, flights and joining instructions are confirmed directly with the vessel's manning agent.",
  },
];

const Process: React.FC = () => (
  <Wrap id="process">
    <Inner>
      <Title>From application to sign-on</Title>
      <List>
        {steps.map((s) => (
          <Step key={s.num}>
            <StepNum>{s.num}</StepNum>
            <StepTitle>{s.title}</StepTitle>
            <StepDesc>{s.desc}</StepDesc>
          </Step>
        ))}
      </List>
    </Inner>
  </Wrap>
);

export default Process;
