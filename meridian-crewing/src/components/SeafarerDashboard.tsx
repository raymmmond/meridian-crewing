import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import theme from "../theme";
import { useCrewing } from "../context/CrewingContext";
import { useAuth } from "../context/AuthContext";
import {
  Document,
  fetchDocuments,
  uploadDocument,
  deleteDocument,
} from "../api";

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

const DocList = styled.div`
  border: 1px solid ${theme.color.navy700};
  margin-bottom: 20px;
`;

const DocRow = styled.div`
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

const DocName = styled.div`
  font-family: ${theme.font.body};
  font-size: 0.92rem;
  color: ${theme.color.paper};
`;

const DocMeta = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.72rem;
  color: ${theme.color.steelLight};
  margin-top: 3px;
`;

const DocLink = styled.a`
  font-family: ${theme.font.mono};
  font-size: 0.74rem;
  color: ${theme.color.brass};
  border: 1px solid ${theme.color.brass};
  padding: 6px 12px;
  white-space: nowrap;
`;

const DocDelete = styled.button`
  font-family: ${theme.font.mono};
  font-size: 0.74rem;
  color: ${theme.color.rustLight};
  background: transparent;
  border: 1px solid ${theme.color.rustLight};
  padding: 6px 12px;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const UploadForm = styled.form`
  border: 1px solid ${theme.color.navy700};
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-end;
`;

const Field = styled.label`
  flex: 1;
  min-width: 160px;
  font-family: ${theme.font.mono};
  font-size: 0.7rem;
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
  padding: 10px 12px;
  font-family: ${theme.font.body};
  font-size: 0.88rem;
`;

const FileInput = styled.input`
  display: block;
  margin-top: 8px;
  color: ${theme.color.steelLight};
  font-family: ${theme.font.body};
  font-size: 0.82rem;
  max-width: 220px;
`;

const UploadButton = styled.button`
  background: ${theme.color.brass};
  color: ${theme.color.navy900};
  border: none;
  padding: 11px 20px;
  font-family: ${theme.font.mono};
  font-size: 0.78rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HelpText = styled.p`
  font-family: ${theme.font.mono};
  font-size: 0.7rem;
  color: ${theme.color.steelLight};
  margin-top: 10px;
  width: 100%;
`;

const ErrorText = styled.p`
  font-family: ${theme.font.mono};
  font-size: 0.78rem;
  color: ${theme.color.rustLight};
  margin-top: 10px;
  width: 100%;
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

const AppStatus = styled.span<{ $status: string }>`
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 8px;
  border: 1px solid
    ${(p) =>
      p.$status === "OFFERED"
        ? theme.color.brass
        : p.$status === "REJECTED"
        ? theme.color.rustLight
        : theme.color.steelLight};
  color: ${(p) =>
    p.$status === "OFFERED"
      ? theme.color.brass
      : p.$status === "REJECTED"
      ? theme.color.rustLight
      : theme.color.steelLight};
`;

const EmptyState = styled.p`
  font-family: ${theme.font.mono};
  font-size: 0.82rem;
  color: ${theme.color.steelLight};
  line-height: 1.6;
  padding: 20px;
`;

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const SeafarerDashboard: React.FC = () => {
  const { applications } = useCrewing();
  const { token, user } = useAuth();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token || user?.role !== "SEAFARER") {
      setDocsLoading(false);
      return;
    }
    fetchDocuments(token)
      .then(setDocuments)
      .catch(() => {
        // An empty list on failure is a reasonable fallback here — the
        // upload form still works even if the initial list fetch hiccups.
      })
      .finally(() => setDocsLoading(false));
  }, [token, user?.role]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!token) return;
    if (!label.trim()) {
      setUploadError("Give the document a label first (e.g. 'STCW Certificate').");
      return;
    }
    if (!file) {
      setUploadError("Choose a file to upload.");
      return;
    }
    setUploadError("");
    setUploading(true);
    try {
      const created = await uploadDocument(file, label.trim(), token);
      setDocuments((prev) => [created, ...prev]);
      setLabel("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeletingId(id);
    try {
      await deleteDocument(id, token);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch {
      // Leave the document in the list if deletion failed — better than
      // silently pretending it's gone when it isn't.
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Wrap id="dashboard">
      <Inner>
        <div>
          <Eyebrow>Your documents</Eyebrow>
          <Title>Certificates on file</Title>
          <Note>
            Upload your STCW, medical, and competency certificates once —
            they're stored securely and only shared with employers you
            actually apply to, never listed publicly.
          </Note>

          {docsLoading ? (
            <EmptyState>Loading…</EmptyState>
          ) : documents.length > 0 ? (
            <DocList>
              {documents.map((d) => (
                <DocRow key={d.id}>
                  <div>
                    <DocName>{d.label}</DocName>
                    <DocMeta>
                      {formatSize(d.fileSize)} · uploaded{" "}
                      {new Date(d.uploadedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </DocMeta>
                  </div>
                  <DocLink href={d.url} target="_blank" rel="noopener noreferrer">
                    View
                  </DocLink>
                  <DocDelete
                    type="button"
                    disabled={deletingId === d.id}
                    onClick={() => handleDelete(d.id)}
                  >
                    {deletingId === d.id ? "…" : "Delete"}
                  </DocDelete>
                </DocRow>
              ))}
            </DocList>
          ) : (
            <EmptyState>
              No documents uploaded yet — add your first certificate below.
            </EmptyState>
          )}

          <UploadForm onSubmit={handleUpload}>
            <Field>
              Label
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. STCW Certificate"
              />
            </Field>
            <Field>
              File
              <FileInput
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/jpeg,image/png"
              />
            </Field>
            <UploadButton type="submit" disabled={uploading}>
              {uploading ? "Uploading…" : "Upload"}
            </UploadButton>
            <HelpText>PDF, JPEG, or PNG. Max 10MB.</HelpText>
            {uploadError && <ErrorText>{uploadError}</ErrorText>}
          </UploadForm>
        </div>

        <AppCard>
          <AppTitle>Your applications</AppTitle>
          {applications.length === 0 ? (
            <EmptyState>
              No applications yet — apply to an open berth above and it'll
              show up here.
            </EmptyState>
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
                <AppStatus $status={a.status}>
                  {a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                </AppStatus>
              </AppRow>
            ))
          )}
        </AppCard>
      </Inner>
    </Wrap>
  );
};

export default SeafarerDashboard;
