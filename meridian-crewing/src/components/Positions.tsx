import React, { useMemo, useState } from "react";
import styled from "styled-components";
import theme from "../theme";
import { useCrewing } from "../context/CrewingContext";
import { Position, Rank, RANK_LABELS } from "../api";
import ApplyModal from "./ApplyModal";

const Wrap = styled.section`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  padding: 110px 32px;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  color: ${theme.color.white};
`;

const HeadNote = styled.p`
  font-family: ${theme.font.mono};
  font-size: 0.78rem;
  color: ${theme.color.steelLight};
  max-width: 34ch;
  line-height: 1.6;
  text-align: left;

  @media (min-width: 700px) {
    text-align: right;
  }
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
`;

const Search = styled.input`
  flex: 1;
  min-width: 200px;
  background: ${theme.color.navy900};
  border: 1px solid ${theme.color.navy700};
  color: ${theme.color.paper};
  padding: 12px 14px;
  font-family: ${theme.font.mono};
  font-size: 0.85rem;

  &::placeholder {
    color: ${theme.color.steelLight};
  }
  &:focus {
    border-color: ${theme.color.brass};
  }
`;

const WageInput = styled.input`
  width: 180px;
  background: ${theme.color.navy900};
  border: 1px solid ${theme.color.navy700};
  color: ${theme.color.paper};
  padding: 12px 14px;
  font-family: ${theme.font.mono};
  font-size: 0.85rem;

  &::placeholder {
    color: ${theme.color.steelLight};
  }
  &:focus {
    border-color: ${theme.color.brass};
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: 1px solid ${theme.color.steel};
  color: ${theme.color.steelLight};
  padding: 11px 16px;
  font-family: ${theme.font.mono};
  font-size: 0.76rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const FilterNote = styled.p`
  font-family: ${theme.font.mono};
  font-size: 0.7rem;
  color: ${theme.color.steelLight};
  opacity: 0.75;
  line-height: 1.5;
  margin-bottom: 20px;
  max-width: 60ch;
`;

const RankButton = styled.button<{ $active: boolean }>`
  background: ${(p) => (p.$active ? theme.color.brass : "transparent")};
  border: 1px solid ${theme.color.brass};
  color: ${(p) => (p.$active ? theme.color.navy900 : theme.color.brass)};
  padding: 11px 16px;
  font-family: ${theme.font.mono};
  font-size: 0.76rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const Board = styled.div`
  border: 1px solid ${theme.color.navy700};
  background: ${theme.color.navy900};
`;

const RowHead = styled.div`
  display: none;
  grid-template-columns: 130px 1fr 0.9fr 0.9fr 0.7fr 0.6fr 130px;
  gap: 16px;
  padding: 14px 24px;
  font-family: ${theme.font.mono};
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.color.steelLight};
  border-bottom: 1px solid ${theme.color.navy700};

  @media (min-width: 860px) {
    display: grid;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
  padding: 20px 20px 20px 18px;
  border-bottom: 1px solid ${theme.color.navy700};
  border-left: 3px solid transparent;
  transition: background 0.15s ease, border-left-color 0.15s ease;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${theme.color.navy700};
    border-left-color: ${theme.color.brass};
  }

  @media (min-width: 860px) {
    grid-template-columns: 130px 1fr 0.9fr 0.9fr 0.7fr 0.6fr 130px;
    align-items: center;
    gap: 16px;
    padding: 22px 24px 22px 21px;
  }
`;

const RankBadge = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.68rem;
  color: ${theme.color.brass};
  border: 1px solid ${theme.color.brass};
  padding: 3px 8px;
  display: inline-block;
  width: fit-content;
  max-width: 100%;
  white-space: normal;
  line-height: 1.3;
  justify-self: start;
  margin-bottom: 4px;
`;

const Role = styled.div`
  font-family: ${theme.font.display};
  font-size: 1.1rem;
  color: ${theme.color.white};
  letter-spacing: 0.01em;
`;

const EmployerLine = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.7rem;
  color: ${theme.color.steelLight};
  margin-top: 3px;

  span.unverified {
    opacity: 0.7;
    font-style: italic;
  }
`;

const Cell = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.82rem;
  color: ${theme.color.steelLight};
`;

const CellLabel = styled.span`
  color: ${theme.color.steelLight};
  opacity: 0.6;
  margin-right: 6px;

  @media (min-width: 860px) {
    display: none;
  }
`;

const Apply = styled.button`
  font-family: ${theme.font.mono};
  font-size: 0.76rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.color.rustLight};
  background: transparent;
  border: 1px solid ${theme.color.rustLight};
  padding: 9px 16px;
  text-align: center;
  width: fit-content;
  margin-top: 6px;
  transition: background 0.15s ease, color 0.15s ease;

  @media (min-width: 860px) {
    margin-top: 0;
  }

  &:hover {
    background: ${theme.color.rustLight};
    color: ${theme.color.navy900};
  }
`;

const Empty = styled.div`
  padding: 40px 24px;
  font-family: ${theme.font.mono};
  font-size: 0.85rem;
  color: ${theme.color.steelLight};
`;

const RANKS: Array<Rank | "ALL"> = [
  "ALL",
  "DECK_OFFICER",
  "ENGINE_OFFICER",
  "ELECTRO_TECHNICAL",
  "DECK_RATING",
  "ENGINE_RATING",
  "CATERING",
];

type ContractRange = "ANY" | "SHORT" | "MEDIUM" | "LONG";

const CONTRACT_RANGES: Array<{ value: ContractRange; label: string }> = [
  { value: "ANY", label: "Any length" },
  { value: "SHORT", label: "≤6 months" },
  { value: "MEDIUM", label: "7–9 months" },
  { value: "LONG", label: "10+ months" },
];

function contractInRange(months: number, range: ContractRange): boolean {
  if (range === "SHORT") return months <= 6;
  if (range === "MEDIUM") return months >= 7 && months <= 9;
  if (range === "LONG") return months >= 10;
  return true;
}

const Positions: React.FC = () => {
  const { positions } = useCrewing();
  const [query, setQuery] = useState("");
  const [rankFilter, setRankFilter] = useState<Rank | "ALL">("ALL");
  const [minWage, setMinWage] = useState("");
  const [contractFilter, setContractFilter] = useState<ContractRange>("ANY");
  const [applying, setApplying] = useState<Position | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const minWageNum = minWage.trim() ? Number(minWage) : null;

    return positions.filter((p) => {
      const matchesRank = rankFilter === "ALL" || p.rank === rankFilter;
      const matchesQuery =
        !q ||
        p.role.toLowerCase().includes(q) ||
        p.vessel.toLowerCase().includes(q) ||
        p.vesselType.toLowerCase().includes(q);
      // Postings without a structured wage figure can't be matched against
      // a numeric filter — they're excluded here, not assumed to fail it.
      const matchesWage =
        minWageNum === null || (p.wageMin !== null && p.wageMin >= minWageNum);
      const matchesContract =
        contractFilter === "ANY" ||
        (p.contractMonths !== null && contractInRange(p.contractMonths, contractFilter));
      return matchesRank && matchesQuery && matchesWage && matchesContract;
    });
  }, [positions, query, rankFilter, minWage, contractFilter]);

  return (
    <Wrap id="positions">
      <Head>
        <Title>Open berths this week</Title>
        <HeadNote>
          A live roster, not a stale listing — vacancies come straight from
          manning agents and close the moment they're filled.
        </HeadNote>
      </Head>

      <Filters>
        <Search
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by role or vessel type…"
          aria-label="Search open berths"
        />
        {RANKS.map((r) => (
          <RankButton
            key={r}
            $active={rankFilter === r}
            onClick={() => setRankFilter(r)}
            type="button"
          >
            {r === "ALL" ? "All ranks" : RANK_LABELS[r]}
          </RankButton>
        ))}
      </Filters>

      <Filters>
        <WageInput
          type="number"
          min="0"
          value={minWage}
          onChange={(e) => setMinWage(e.target.value)}
          placeholder="Min wage (USD/month)"
          aria-label="Minimum wage"
        />
        {CONTRACT_RANGES.map((c) => (
          <RankButton
            key={c.value}
            $active={contractFilter === c.value}
            onClick={() => setContractFilter(c.value)}
            type="button"
          >
            {c.label}
          </RankButton>
        ))}
        {(minWage || contractFilter !== "ANY") && (
          <ClearButton
            type="button"
            onClick={() => {
              setMinWage("");
              setContractFilter("ANY");
            }}
          >
            Clear
          </ClearButton>
        )}
      </Filters>

      <FilterNote>
        Wage and contract filters only match postings where the employer
        provided that detail as a number, not just descriptive text — some
        real postings won't appear under these filters even though they're
        visible in the full list above.
      </FilterNote>

      <Board>
        <RowHead>
          <div>Rank</div>
          <div>Position</div>
          <div>Wage</div>
          <div>Vessel</div>
          <div>Contract</div>
          <div>Sign-on</div>
          <div />
        </RowHead>
        {filtered.length === 0 && (
          <Empty>No berths match that search. Try clearing a filter.</Empty>
        )}
        {filtered.map((p) => (
          <Row key={p.id}>
            <RankBadge>{RANK_LABELS[p.rank]}</RankBadge>
            <Role>{p.role}</Role>
            <EmployerLine>
              {p.employer ? (
                <>
                  {p.employer.companyName}
                  {p.employer.licenseNumber && (
                    <span className="unverified">
                      {" "}
                      · License {p.employer.licenseNumber}
                      {p.employer.licenseCountry ? ` (${p.employer.licenseCountry})` : ""}
                      {" — self-reported"}
                    </span>
                  )}
                </>
              ) : (
                <span className="unverified">Employer not specified</span>
              )}
            </EmployerLine>
            <Cell>
              <CellLabel>Wage:</CellLabel>
              {p.wage || "Not disclosed"}
            </Cell>
            <Cell>
              <CellLabel>Vessel:</CellLabel>
              {p.vessel}
            </Cell>
            <Cell>
              <CellLabel>Contract:</CellLabel>
              {p.contract}
            </Cell>
            <Cell>
              <CellLabel>Sign-on:</CellLabel>
              {p.signOn}
            </Cell>
            <Apply type="button" onClick={() => setApplying(p)}>
              Apply
            </Apply>
          </Row>
        ))}
      </Board>

      {applying && (
        <ApplyModal position={applying} onClose={() => setApplying(null)} />
      )}
    </Wrap>
  );
};

export default Positions;
