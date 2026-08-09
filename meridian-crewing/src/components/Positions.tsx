import React, { useMemo, useState } from "react";
import styled from "styled-components";
import theme from "../theme";
import { useCrewing } from "../context/CrewingContext";
import { Position, Rank } from "../api";
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
  text-align: right;
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
  grid-template-columns: 90px 1.4fr 1fr 1fr 0.8fr 130px;
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
  padding: 22px 24px;
  border-bottom: 1px solid ${theme.color.navy700};
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${theme.color.navy700};
  }

  @media (min-width: 860px) {
    grid-template-columns: 90px 1.4fr 1fr 1fr 0.8fr 130px;
    align-items: center;
    gap: 16px;
  }
`;

const RankBadge = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.72rem;
  color: ${theme.color.brass};
  border: 1px solid ${theme.color.brass};
  padding: 3px 8px;
  display: inline-block;
  width: fit-content;
`;

const Role = styled.div`
  font-family: ${theme.font.display};
  font-size: 1.1rem;
  color: ${theme.color.white};
  letter-spacing: 0.01em;
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
  transition: background 0.15s ease, color 0.15s ease;

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

const RANKS: Array<Rank | "ALL"> = ["ALL", "OFFICER", "RATING", "CATERING"];

const Positions: React.FC = () => {
  const { positions } = useCrewing();
  const [query, setQuery] = useState("");
  const [rankFilter, setRankFilter] = useState<Rank | "ALL">("ALL");
  const [applying, setApplying] = useState<Position | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return positions.filter((p) => {
      const matchesRank = rankFilter === "ALL" || p.rank === rankFilter;
      const matchesQuery =
        !q ||
        p.role.toLowerCase().includes(q) ||
        p.vessel.toLowerCase().includes(q) ||
        p.vesselType.toLowerCase().includes(q);
      return matchesRank && matchesQuery;
    });
  }, [positions, query, rankFilter]);

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
            {r === "ALL" ? "All ranks" : r}
          </RankButton>
        ))}
      </Filters>

      <Board>
        <RowHead>
          <div>Rank</div>
          <div>Position</div>
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
            <RankBadge>{p.rank}</RankBadge>
            <Role>{p.role}</Role>
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
