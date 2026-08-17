import React, { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "../theme";
import { useAuth } from "../context/AuthContext";
import {
  fetchEmployerProfile,
  updateEmployerProfile,
} from "../api";
const Wrap = styled.div`
  border: 1px solid ${theme.color.brass};
  background: ${theme.color.navy700};
  padding: 24px;
  margin-bottom: 24px;
`;

const Eyebrow = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.color.brass};
  margin-bottom: 8px;
`;

const Title = styled.h3`
  font-size: 1.15rem;
  color: ${theme.color.white};
  margin-bottom: 10px;
`;

const Note = styled.p`
  font-family: ${theme.font.mono};
  font-size: 0.78rem;
  color: ${theme.color.steelLight};
  line-height: 1.6;
  margin-bottom: 20px;
`;

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
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
  font-size: 0.9rem;

  &:focus {
    border-color: ${theme.color.brass};
  }
`;

const Select = styled.select`
  display: block;
  width: 100%;
  margin-top: 8px;
  background: ${theme.color.navy900};
  border: 1px solid ${theme.color.steel};
  color: ${theme.color.paper};
  padding: 11px 12px;
  font-family: ${theme.font.body};
  font-size: 0.9rem;
`;

const Submit = styled.button`
  background: ${theme.color.brass};
  color: ${theme.color.navy900};
  border: none;
  padding: 12px 22px;
  font-family: ${theme.font.mono};
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusLine = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.82rem;
  color: ${theme.color.brass};
  margin-top: 12px;
`;

const ErrorText = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.78rem;
  color: ${theme.color.rustLight};
  margin-bottom: 14px;
`;

const LICENSE_COUNTRIES = [
  "",
  "Philippines (DMW)",
  "India (RPSL)",
  "Ukraine",
  "Other",
];

const EmployerProfilePanel: React.FC = () => {
  const { token, user } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCountry, setLicenseCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "EMPLOYER") {
      setLoading(false);
      return;
    }
    fetchEmployerProfile(token)
      .then((profile) => {
        if (profile) {
          setCompanyName(profile.companyName);
          setLicenseNumber(profile.licenseNumber ?? "");
          setLicenseCountry(profile.licenseCountry ?? "");
        }
      })
      .catch(() => {
        // No profile yet is a normal state, not an error worth surfacing.
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!companyName.trim()) {
      setError("Company name is required.");
      return;
    }
    setError("");
    setSaving(true);
    setSaved(false);
    try {
      await updateEmployerProfile(
        {
          companyName: companyName.trim(),
          licenseNumber: licenseNumber.trim() || null,
          licenseCountry: licenseCountry.trim() || null,
        },
        token
      );
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || user?.role !== "EMPLOYER") return null;

  return (
    <Wrap>
      <Eyebrow>Company profile</Eyebrow>
      <Title>Who's posting these vacancies?</Title>
      <Note>
        Shown publicly on every vacancy you post. This is self-reported, not
        independently verified by Meridian — but it means seafarers see a
        real company name and license number attached to your postings
        instead of an anonymous account, and can check it themselves.{" "}
        <strong style={{ color: theme.color.paper }}>
          A company name is required before you can post a vacancy.
        </strong>
      </Note>
      {error && <ErrorText>{error}</ErrorText>}
      <form onSubmit={handleSubmit}>
        <Field>
          Company name
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Meridian Ship Management Ltd."
          />
        </Field>
        <Row2>
          <Field>
            License number{" "}
            <span style={{ opacity: 0.6, textTransform: "none" }}>(optional)</span>
            <Input
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="e.g. DMW-2024-01234"
            />
          </Field>
          <Field>
            Licensing country{" "}
            <span style={{ opacity: 0.6, textTransform: "none" }}>(optional)</span>
            <Select
              value={licenseCountry}
              onChange={(e) => setLicenseCountry(e.target.value)}
            >
              {LICENSE_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c || "Not specified"}
                </option>
              ))}
            </Select>
          </Field>
        </Row2>
        <Submit type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save company profile"}
        </Submit>
        {saved && <StatusLine>Saved.</StatusLine>}
      </form>
    </Wrap>
  );
};

export default EmployerProfilePanel;
