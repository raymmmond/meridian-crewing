import React, { useState } from "react";
import styled from "styled-components";
import theme from "../theme";
import { useAuth } from "../context/AuthContext";
import { deleteAccount } from "../api";

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
  border: 1px solid ${theme.color.rustLight};
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
  margin-bottom: 18px;
`;

const Warning = styled.p`
  font-family: ${theme.font.mono};
  font-size: 0.84rem;
  color: ${theme.color.paper};
  line-height: 1.7;
  margin-bottom: 20px;
`;

const Field = styled.label`
  display: block;
  margin-bottom: 20px;
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
    border-color: ${theme.color.rustLight};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const DeleteButton = styled.button`
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
    opacity: 0.4;
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

const ErrorText = styled.div`
  color: ${theme.color.rustLight};
  font-family: ${theme.font.mono};
  font-size: 0.76rem;
  margin-bottom: 16px;
`;

interface Props {
  onClose: () => void;
}

const DeleteAccountModal: React.FC<Props> = ({ onClose }) => {
  const { token, logout } = useAuth();
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!token) return;
    if (confirmText !== "DELETE") {
      setError('Type "DELETE" exactly to confirm.');
      return;
    }
    setError("");
    setDeleting(true);
    try {
      await deleteAccount(token);
      logout();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setDeleting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <Eyebrow>This can't be undone</Eyebrow>
        <Title>Delete your account</Title>
        <Warning>
          This permanently deletes your account, your uploaded documents,
          and — if you're an employer — every position you've posted and
          all applications tied to it. If you're a seafarer, your
          applications are deleted too. There's no recovery after this.
        </Warning>
        {error && <ErrorText>{error}</ErrorText>}
        <Field>
          Type DELETE to confirm
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            autoFocus
          />
        </Field>
        <Actions>
          <DeleteButton
            type="button"
            onClick={handleDelete}
            disabled={deleting || confirmText !== "DELETE"}
          >
            {deleting ? "Deleting…" : "Permanently delete"}
          </DeleteButton>
          <Cancel type="button" onClick={onClose}>
            Cancel
          </Cancel>
        </Actions>
      </Panel>
    </Overlay>
  );
};

export default DeleteAccountModal;
