import React, { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "../theme";
import { useCrewing } from "../context/CrewingContext";
import { useAuth } from "../context/AuthContext";
import {
  Rank,
  RANK_LABELS,
  RANK_ROLE_SUGGESTIONS,
  Application,
  ApplicationStatus,
  Document,
  fetchMyPostingApplications,
  updateApplicationStatus,
  fetchApplicationDocuments,
} from "../api";

const Wrap = styled.section`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  padding: 110px 32px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
`;

const Eyebrow = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${theme.color.brass};
  margin-bottom: 18px;
`;

const Title = styled.h2`
  font-size: clamp(1.9rem, 4vw, 2.6rem);
  color: ${theme.color.white};
  max-width: 14ch;
  margin-bottom: 20px;
`;

const Desc = styled.p`
  font-size: 1rem;
  line-height: 1.65;
  color: ${theme.color.steelLight};
  max-width: 46ch;
  margin-bottom: 32px;
`;

const StatsPanel = styled.div`
  border: 1px solid ${theme.color.navy700};
  background: ${theme.color.navy700};
  padding: 32px;
`;

const PanelRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid ${theme.color.steel};
  font-family: ${theme.font.mono};
  font-size: 0.82rem;

  &:last-child {
    border-bottom: none;
  }
`;

const Key = styled.span`
  color: ${theme.color.steelLight};
`;

const Val = styled.span`
  color: ${theme.color.paper};
`;

const Form = styled.form`
  border: 1px solid ${theme.color.navy700};
  background: ${theme.color.navy900};
  padding: 28px;
`;

const Field = styled.label`
  display: block;
  margin-bottom: 16px;
  font-family: ${theme.font.mono};
  font-size: 0.74rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.color.steelLight};
`;

const Input = styled.input`
  display: block;
  width: 100%;
  margin-top: 8px;
  background: ${theme.color.navy700};
  border: 1px solid ${theme.color.steel};
  color: ${theme.color.paper};
  padding: 11px 12px;
  font-family: ${theme.font.body};
  font-size: 0.9rem;

  &:focus {
    border-color: ${theme.color.brass};
  }
`;

const Select = styled.select`
  display: block;
  width: 100%;
  margin-top: 8px;
  background: ${theme.color.navy700};
  border: 1px solid ${theme.color.steel};
  color: ${theme.color.paper};
  padding: 11px 12px;
  font-family: ${theme.font.body};
  font-size: 0.9rem;
`;

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const Submit = styled.button`
  width: 100%;
  background: ${theme.color.brass};
  color: ${theme.color.navy900};
  border: none;
  padding: 14px;
  font-family: ${theme.font.mono};
  font-size: 0.82rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-top: 8px;

  &:hover {
    background: ${theme.color.paper};
  }
`;

const Success = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.9rem;
  color: ${theme.color.brass};
  padding: 12px 0 4px;
`;

const ErrorText = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.82rem;
  color: ${theme.color.rustLight};
  padding: 10px 0 0;
`;

const RANK_OPTIONS: Rank[] = [
  "DECK_OFFICER",
  "ENGINE_OFFICER",
  "ELECTRO_TECHNICAL",
  "DECK_RATING",
  "ENGINE_RATING",
  "CATERING",
];

const ApplicantsWrap = styled.section`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  padding: 0 32px 110px;
`;

const ApplicantsTitle = styled.h3`
  font-size: 1.3rem;
  color: ${theme.color.white};
  margin-bottom: 20px;
`;

const ApplicantsBoard = styled.div`
  border: 1px solid ${theme.color.navy700};
  background: ${theme.color.navy900};
`;

const ApplicantRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  padding: 18px 24px;
  border-bottom: 1px solid ${theme.color.navy700};

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 760px) {
    grid-template-columns: 1fr 1fr 1fr 140px 110px;
    align-items: center;
    gap: 16px;
  }
`;

const DocsToggle = styled.button`
  font-family: ${theme.font.mono};
  font-size: 0.72rem;
  color: ${theme.color.steelLight};
  background: transparent;
  border: 1px solid ${theme.color.steel};
  padding: 8px 10px;
  white-space: nowrap;
`;

const DocsPanel = styled.div`
  grid-column: 1 / -1;
  margin-top: 10px;
  padding: 12px 16px;
  background: ${theme.color.navy800};
  border: 1px solid ${theme.color.navy700};
  font-family: ${theme.font.mono};
  font-size: 0.78rem;
  color: ${theme.color.steelLight};
`;

const DocsPanelLink = styled.a`
  color: ${theme.color.brass};
  display: block;
  padding: 4px 0;
`;

const ApplicantName = styled.div`
  font-family: ${theme.font.body};
  font-size: 0.95rem;
  color: ${theme.color.paper};
`;

const ApplicantMeta = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.8rem;
  color: ${theme.color.steelLight};
`;

const StatusSelect = styled.select<{ $status: ApplicationStatus }>`
  background: ${theme.color.navy700};
  border: 1px solid
    ${(p) =>
      p.$status === "OFFERED"
        ? theme.color.brass
        : p.$status === "REJECTED"
        ? theme.color.rustLight
        : theme.color.steel};
  color: ${theme.color.paper};
  padding: 8px 10px;
  font-family: ${theme.font.mono};
  font-size: 0.76rem;
`;

const EmptyApplicants = styled.p`
  padding: 24px;
  font-family: ${theme.font.mono};
  font-size: 0.85rem;
  color: ${theme.color.steelLight};
`;

const STATUS_OPTIONS: ApplicationStatus[] = ["SUBMITTED", "SHORTLISTED", "OFFERED", "REJECTED"];

const Employers: React.FC = () => {
  const { addPosition } = useCrewing();
  const [role, setRole] = useState("");
  const [vessel, setVessel] = useState("");
  const [vesselType, setVesselType] = useState("");
  const [rank, setRank] = useState<Rank>("DECK_OFFICER");
  const [contract, setContract] = useState("");
  const [signOn, setSignOn] = useState("");
  const [wage, setWage] = useState("");
  const [posted, setPosted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { token, user } = useAuth();
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [docsByApplication, setDocsByApplication] = useState<Record<string, Document[]>>({});
  const [docsLoadingId, setDocsLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token || user?.role !== "EMPLOYER") {
      setApplicantsLoading(false);
      return;
    }
    fetchMyPostingApplications(token)
      .then(setApplicants)
      .catch(() => {
        // A quiet failure here just means an empty list — the employer
        // can still use the rest of the page.
      })
      .finally(() => setApplicantsLoading(false));
  }, [token, user?.role, posted]); // refetch after posting, since it's a natural moment to glance at applicants too

  const toggleDocs = async (applicationId: string) => {
    if (expandedId === applicationId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(applicationId);
    if (!token || docsByApplication[applicationId]) return; // already fetched
    setDocsLoadingId(applicationId);
    try {
      const docs = await fetchApplicationDocuments(applicationId, token);
      setDocsByApplication((prev) => ({ ...prev, [applicationId]: docs }));
    } catch {
      setDocsByApplication((prev) => ({ ...prev, [applicationId]: [] }));
    } finally {
      setDocsLoadingId(null);
    }
  };

  const handleStatusChange = async (applicationId: string, status: ApplicationStatus) => {
    if (!token) return;
    const previous = applicants;
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status } : a))
    );
    try {
      await updateApplicationStatus(applicationId, status, token);
    } catch {
      setApplicants(previous); // roll back on failure rather than show a wrong status
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !vessel.trim() || !contract.trim() || !signOn.trim()) {
      setError("Fill in every field before posting.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await addPosition({
        role: role.trim(),
        vessel: vessel.trim(),
        vesselType: vesselType.trim() || vessel.trim(),
        rank,
        contract: contract.trim(),
        signOn: signOn.trim(),
        wage: wage.trim() || null,
      });
      setPosted(true);
      setRole("");
      setVessel("");
      setVesselType("");
      setContract("");
      setSignOn("");
      setWage("");
      setTimeout(() => setPosted(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <Wrap id="employers">
      <div>
        <Eyebrow>For shipping companies &amp; manning agents</Eyebrow>
        <Title>Crew a vessel in days, not weeks</Title>
        <Desc>
          Post a vacancy against a pre-vetted pool of certified officers and
          ratings. Every candidate's documents are checked before they reach
          your shortlist, so you're comparing sign-on dates, not chasing
          paperwork.
        </Desc>
        <StatsPanel>
          <PanelRow>
            <Key>Avg. time to shortlist</Key>
            <Val>36 hrs</Val>
          </PanelRow>
          <PanelRow>
            <Key>Verified candidate pool</Key>
            <Val>9,400+</Val>
          </PanelRow>
          <PanelRow>
            <Key>Flag states covered</Key>
            <Val>46</Val>
          </PanelRow>
          <PanelRow>
            <Key>Manning agent network</Key>
            <Val>340 fleets</Val>
          </PanelRow>
        </StatsPanel>
      </div>

      <Form id="post-vacancy" onSubmit={handleSubmit}>
        <Row2>
          <Field>
            Rank category
            <Select
              value={rank}
              onChange={(e) => setRank(e.target.value as Rank)}
            >
              {RANK_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {RANK_LABELS[r]}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            Contract length
            <Input
              value={contract}
              onChange={(e) => setContract(e.target.value)}
              placeholder="e.g. 6 months"
            />
          </Field>
        </Row2>
        <Field>
          Position title
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder={`e.g. ${RANK_ROLE_SUGGESTIONS[rank][0]}`}
            list="role-suggestions"
          />
          <datalist id="role-suggestions">
            {RANK_ROLE_SUGGESTIONS[rank].map((title) => (
              <option key={title} value={title} />
            ))}
          </datalist>
        </Field>
        <Field>
          Vessel
          <Input
            value={vessel}
            onChange={(e) => setVessel(e.target.value)}
            placeholder="e.g. Container · 12,000 TEU"
          />
        </Field>
        <Field>
          Sign-on date
          <Input
            value={signOn}
            onChange={(e) => setSignOn(e.target.value)}
            placeholder="e.g. 10 Sep"
          />
        </Field>
        <Field>
          Wage <span style={{ opacity: 0.6, textTransform: "none" }}>(optional, but strongly recommended — most seafarers filter by this)</span>
          <Input
            value={wage}
            onChange={(e) => setWage(e.target.value)}
            placeholder="e.g. $3,200/month"
          />
        </Field>
        <Submit type="submit" disabled={submitting}>
          {submitting ? "Posting…" : "Post vacancy"}
        </Submit>
        {error && <ErrorText>{error}</ErrorText>}
        {posted && <Success>Posted — it's now live on the roster above.</Success>}
      </Form>
    </Wrap>

    {user?.role === "EMPLOYER" && (
      <ApplicantsWrap>
        <ApplicantsTitle>Applicants for your postings</ApplicantsTitle>
        <ApplicantsBoard>
          {applicantsLoading ? (
            <EmptyApplicants>Loading…</EmptyApplicants>
          ) : applicants.length === 0 ? (
            <EmptyApplicants>
              No one's applied yet — once someone does, they'll show up here.
            </EmptyApplicants>
          ) : (
            applicants.map((a) => (
              <ApplicantRow key={a.id}>
                <ApplicantName>{a.name}</ApplicantName>
                <ApplicantMeta>{a.positionRole}</ApplicantMeta>
                <ApplicantMeta>{a.email}</ApplicantMeta>
                <StatusSelect
                  $status={a.status}
                  value={a.status}
                  onChange={(e) =>
                    handleStatusChange(a.id, e.target.value as ApplicationStatus)
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </option>
                  ))}
                </StatusSelect>
                <DocsToggle type="button" onClick={() => toggleDocs(a.id)}>
                  {expandedId === a.id ? "Hide docs" : "Documents"}
                </DocsToggle>
                {expandedId === a.id && (
                  <DocsPanel>
                    {docsLoadingId === a.id ? (
                      "Loading…"
                    ) : (docsByApplication[a.id]?.length ?? 0) === 0 ? (
                      "No documents uploaded by this applicant yet."
                    ) : (
                      docsByApplication[a.id].map((d) => (
                        <DocsPanelLink
                          key={d.id}
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {d.label} →
                        </DocsPanelLink>
                      ))
                    )}
                  </DocsPanel>
                )}
              </ApplicantRow>
            ))
          )}
        </ApplicantsBoard>
      </ApplicantsWrap>
    )}
    </>
  );
};

export default Employers;
