import React, { useState } from "react";
import styled from "styled-components";
import theme from "../theme";
import { useAuth } from "../context/AuthContext";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(4, 10, 16, 0.72);
  overflow-y: auto;
  padding: 40px 24px;
  z-index: 100;
`;

const Panel = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: ${theme.color.rustLight};
  font-family: ${theme.font.mono};
  font-size: 0.76rem;
  margin: -6px 0 16px;
`;

const Confirm = styled.p`
  font-family: ${theme.font.mono};
  font-size: 0.88rem;
  color: ${theme.color.paper};
  line-height: 1.7;
`;

const ResetPasswordModal: React.FC = () => {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await updatePassword(password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay>
      <Panel>
        {done ? (
          <>
            <Eyebrow>Password updated</Eyebrow>
            <Title>You're all set</Title>
            <Confirm>
              Your password's been changed. You're logged in with your new
              password — no need to log in again.
            </Confirm>
          </>
        ) : (
          <>
            <Eyebrow>Password reset</Eyebrow>
            <Title>Set a new password</Title>
            {error && <ErrorText>{error}</ErrorText>}
            <form onSubmit={handleSubmit}>
              <Field>
                New password
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoFocus
                />
              </Field>
              <Field>
                Confirm new password
                <Input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Type it again"
                />
              </Field>
              <Actions>
                <Submit type="submit" disabled={submitting}>
                  {submitting ? "Updating…" : "Update password"}
                </Submit>
              </Actions>
            </form>
          </>
        )}
      </Panel>
    </Overlay>
  );
};

export default ResetPasswordModal;
