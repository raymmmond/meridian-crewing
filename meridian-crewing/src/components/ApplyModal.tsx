import React, { useState } from "react";
import styled from "styled-components";
import theme from "../theme";
import { Position } from "../api";
import { useCrewing } from "../context/CrewingContext";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(4, 10, 16, 0.72);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 24px;
  z-index: 100;
`;

const Panel = styled.div`
  width: 100%;
  max-width: 480px;
  margin: auto;
  background: ${theme.color.navy700};
  border: 1px solid ${theme.color.steel};
  padding: 32px;
`;

const Eyebrow = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.color.rustLight};
  margin-bottom: 10px;
`;

const Title = styled.h3`
  font-size: 1.4rem;
  color: ${theme.color.white};
  margin-bottom: 24px;
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
  background: ${theme.color.navy900};
  border: 1px solid ${theme.color.steel};
  color: ${theme.color.paper};
  padding: 11px 12px;
  font-family: ${theme.font.body};
  font-size: 0.92rem;

  &:focus {
    border-color: ${theme.color.brass};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Submit = styled.button`
  flex: 1;
  background: ${theme.color.rust};
  color: ${theme.color.white};
  border: none;
  padding: 13px;
  font-family: ${theme.font.mono};
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  &:hover {
    background: ${theme.color.rustLight};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Cancel = styled.button`
  background: transparent;
  border: 1px solid ${theme.color.steel};
  color: ${theme.color.steelLight};
  padding: 13px 18px;
  font-family: ${theme.font.mono};
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const Confirm = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.9rem;
  color: ${theme.color.paper};
  line-height: 1.7;

  strong {
    color: ${theme.color.brass};
  }
`;

const ErrorText = styled.div`
  color: ${theme.color.rustLight};
  font-family: ${theme.font.mono};
  font-size: 0.76rem;
  margin: -6px 0 16px;
`;

interface Props {
  position: Position;
  onClose: () => void;
}

const ApplyModal: React.FC<Props> = ({ position, onClose }) => {
  const { addApplication } = useCrewing();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await addApplication({
        positionId: position.id,
        positionRole: position.role,
        name: name.trim(),
        email: email.trim(),
        rank: position.rank,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        {submitted ? (
          <>
            <Eyebrow>Application received</Eyebrow>
            <Title>You're on the list</Title>
            <Confirm>
              Application for <strong>{position.role}</strong> (
              {position.vessel}) has been logged. The manning desk reviews
              new applications within 36 hours — you'll hear back by email.
            </Confirm>
            <Actions>
              <Submit type="button" onClick={onClose}>
                Close
              </Submit>
            </Actions>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <Eyebrow>{position.rank} · {position.vessel}</Eyebrow>
            <Title>Apply for {position.role}</Title>
            {error && <ErrorText>{error}</ErrorText>}
            <Field>
              Full name
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As shown on your seaman's book"
              />
            </Field>
            <Field>
              Email
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </Field>
            <Actions>
              <Submit type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit application"}
              </Submit>
              <Cancel type="button" onClick={onClose}>
                Cancel
              </Cancel>
            </Actions>
          </form>
        )}
      </Panel>
    </Overlay>
  );
};

export default ApplyModal;
