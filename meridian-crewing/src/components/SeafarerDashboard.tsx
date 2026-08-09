import React, { useMemo } from "react";
import styled from "styled-components";
import theme from "../theme";
import { useCrewing } from "../context/CrewingContext";

const Wrap = styled.section`
  background: ${theme.color.navy900};
  border-top: 1px solid ${theme.color.navy700};
  border-bottom: 1px solid ${theme.color.navy700};
  padding: 100px 32px;
`;

const Inner = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;

  @media (min-width: 960px) {
    grid-template-columns: 1.2fr 1fr;
  }
`;

const Eyebrow = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${theme.color.brass};
  margin-bottom: 14px;
`;

const Title = styled.h2`
  font-size: clamp(1.9rem, 4vw, 2.6rem);
  color: ${theme.color.white};
  margin-bottom: 14px;
`;

const Note = styled.p`
  font-size: 0.92rem;
  line-height: 1.6;
  color: ${theme.color.steelLight};
  max-width: 46ch;
  margin-bottom: 28px;
`;

const CertList = styled.div`
  border: 1px solid ${theme.color.navy700};
`;

const CertRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid ${theme.color.navy700};
  background: ${theme.color.navy700};

  &:last-child {
    border-bottom: none;
  }
`;

const CertName = styled.div`
  font-family: ${theme.font.body};
  font-size: 0.92rem;
  color: ${theme.color.paper};
`;

const CertExpires = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.76rem;
  color: ${theme.color.steelLight};
`;

const Status = styled.div<{ $tone: "valid" | "soon" | "expired" }>`
  font-family: ${theme.font.mono};
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
  border: 1px solid
    ${(p) =>
      p.$tone === "valid"
        ? theme.color.steelLight
        : p.$tone === "soon"
        ? theme.color.brass
        : theme.color.rustLight};
  color: ${(p) =>
    p.$tone === "valid"
      ? theme.color.steelLight
      : p.$tone === "soon"
      ? theme.color.brass
      : theme.color.rustLight};
`;

const AppCard = styled.div`
  border: 1px solid ${theme.color.navy700};
  padding: 26px;
`;

const AppTitle = styled.h3`
  font-size: 1.05rem;
  color: ${theme.color.white};
  margin-bottom: 18px;
`;

const AppRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${theme.color.navy700};
  font-family: ${theme.font.mono};
  font-size: 0.8rem;

  &:last-child {
    border-bottom: none;
  }
`;

const AppRole = styled.span`
  color: ${theme.color.paper};
`;

const AppMeta = styled.span`
  color: ${theme.color.steelLight};
`;

const EmptyApps = styled.p`
  font-family: ${theme.font.mono};
  font-size: 0.82rem;
  color: ${theme.color.steelLight};
  line-height: 1.6;
`;

type Cert = { name: string; expires: string };

const SAMPLE_CERTS: Cert[] = [
  { name: "Certificate of Competency (CoC)", expires: "2029-03-01" },
  { name: "STCW Basic Safety Training", expires: "2026-09-14" },
  { name: "ENG1 Medical Fitness", expires: "2026-08-20" },
  { name: "Seaman's Book / CDC", expires: "2027-11-05" },
  { name: "GMDSS GOC", expires: "2026-01-10" },
];

function daysUntil(dateStr: string): number {
  const today = new Date("2026-08-04");
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

function statusFor(days: number): "valid" | "soon" | "expired" {
  if (days < 0) return "expired";
  if (days <= 90) return "soon";
  return "valid";
}

function statusLabel(tone: "valid" | "soon" | "expired", days: number): string {
  if (tone === "expired") return "Expired";
  if (tone === "soon") return `${days}d left`;
  return "Valid";
}

const SeafarerDashboard: React.FC = () => {
  const { applications } = useCrewing();

  const certs = useMemo(
    () =>
      SAMPLE_CERTS.map((c) => {
        const days = daysUntil(c.expires);
        return { ...c, days, tone: statusFor(days) };
      }),
    []
  );

  return (
    <Wrap id="dashboard">
      <Inner>
        <div>
          <Eyebrow>Sample seafarer profile</Eyebrow>
          <Title>Your certificates, tracked</Title>
          <Note>
            Expired paperwork is the single most common reason a sign-on gets
            delayed. Meridian flags every certificate approaching its expiry
            date before it becomes a problem at the gangway.
          </Note>
          <CertList>
            {certs.map((c) => (
              <CertRow key={c.name}>
                <CertName>{c.name}</CertName>
                <CertExpires>
                  Expires {new Date(c.expires).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </CertExpires>
                <Status $tone={c.tone}>
                  {statusLabel(c.tone, c.days)}
                </Status>
              </CertRow>
            ))}
          </CertList>
        </div>

        <AppCard>
          <AppTitle>Your applications</AppTitle>
          {applications.length === 0 ? (
            <EmptyApps>
              No applications yet — apply to an open berth above and it'll
              show up here.
            </EmptyApps>
          ) : (
            applications.map((a) => (
              <AppRow key={a.id}>
                <AppRole>{a.positionRole}</AppRole>
                <AppMeta>
                  {new Date(a.submitted).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </AppMeta>
              </AppRow>
            ))
          )}
        </AppCard>
      </Inner>
    </Wrap>
  );
};

export default SeafarerDashboard;
