import React from "react";
import {
  LegalWrap,
  LegalMeta,
  LegalTitle,
  LegalNotice,
  LegalH2,
  LegalP,
  LegalUl,
  LegalStrong,
  BackLink,
} from "./LegalLayout";

const TermsPage: React.FC = () => (
  <LegalWrap>
    <BackLink href="/">← Back to Meridian Crewing</BackLink>
    <LegalTitle>Terms of Service</LegalTitle>
    <LegalMeta>Last updated: 16 August 2026</LegalMeta>

    <LegalP>
      These Terms of Service ("Terms") govern your use of Meridian Crewing
      (meridian-crewing.vercel.app, the "Service"). By creating an account,
      you agree to these Terms.
    </LegalP>

    <LegalNotice>
      <LegalStrong>This document has not been reviewed by a lawyer.</LegalStrong>{" "}
      It's written to accurately describe what the Service does and doesn't
      do, including its current limitations, rather than to sound more
      protective or established than it actually is.
    </LegalNotice>

    <LegalP>
      Meridian Crewing is currently operated by an individual based in
      Nigeria, not yet a registered company.
    </LegalP>

    <LegalH2>1. What Meridian Crewing is — and isn't</LegalH2>
    <LegalP>
      Meridian Crewing is a{" "}
      <LegalStrong>
        platform that connects seafarers with shipping companies and
        manning agencies posting crew vacancies.
      </LegalStrong>{" "}
      We are not ourselves a licensed manning agency, and we do not employ,
      place, or contract seafarers directly. Employment relationships,
      contracts, and sign-on arrangements are between the seafarer and the
      employer — we are not a party to them.
    </LegalP>
    <LegalP>
      <LegalStrong>
        We do not currently verify that every employer account is a
        legitimate, licensed shipping company or manning agency.
      </LegalStrong>{" "}
      This is a known, significant limitation, and we are actively working
      on employer verification. Until stronger verification is in place,
      seafarers should exercise their own judgment before sharing personal
      documents or accepting any offer — including verifying an employer's
      licensing status independently (e.g. against a national manning
      license registry) before relying on a posting here. We will update
      this section honestly as verification measures are added.
    </LegalP>

    <LegalH2>2. Accounts</LegalH2>
    <LegalP>
      You must provide accurate information when creating an account.
      You're responsible for keeping your login credentials secure and for
      anything that happens under your account. You must be 18 or older to
      use the Service.
    </LegalP>

    <LegalH2>3. Content you provide</LegalH2>
    <LegalP>
      <LegalStrong>Seafarers:</LegalStrong> documents you upload
      (certificates, identification, medical records) remain yours. By
      uploading them, you grant us a limited license to store them and
      display them to employers you've actually applied to — nothing more.
      We do not claim ownership of your documents, and we do not share them
      beyond what's described in our Privacy Policy.
    </LegalP>
    <LegalP>
      <LegalStrong>Employers:</LegalStrong> vacancy postings you create
      (role, vessel, contract, wage) are shown publicly on the Service so
      seafarers can browse them. You're responsible for the accuracy of
      what you post. We do not independently verify that a posted vacancy
      is genuine.
    </LegalP>

    <LegalH2>4. Acceptable use</LegalH2>
    <LegalP>You agree not to:</LegalP>
    <LegalUl>
      <li>Post false or misleading vacancy information</li>
      <li>
        Upload documents that aren't genuinely yours (seafarers) or
        misrepresent your company's identity (employers)
      </li>
      <li>
        Use the Service to harass, defraud, or discriminate unlawfully
        against another user
      </li>
      <li>
        Attempt to access another user's account or data without
        authorization
      </li>
      <li>Use the Service for any purpose that violates applicable law</li>
    </LegalUl>
    <LegalP>
      We may suspend or terminate accounts that violate these terms.
    </LegalP>

    <LegalH2>5. No guarantee of outcomes</LegalH2>
    <LegalP>
      We do not guarantee that a seafarer will be hired, that an employer
      will find a suitable candidate, or that any posted vacancy remains
      available or accurate. We are a connection point, not a guarantor of
      any employment outcome.
    </LegalP>

    <LegalH2>6. Fees</LegalH2>
    <LegalP>
      The Service is currently free to use for both seafarers and
      employers. This may change in the future; if it does, we'll
      communicate pricing clearly before charging anyone.
    </LegalP>

    <LegalH2>7. Limitation of liability</LegalH2>
    <LegalP>
      The Service is provided on an "as is" basis. To the fullest extent
      permitted by applicable law, we are not liable for losses arising
      from your use of the Service, including disputes between seafarers
      and employers, inaccurate postings, or service interruptions.
      Nothing in this section limits liability that cannot be excluded
      under the NDPA or other applicable law.
    </LegalP>

    <LegalH2>8. Termination</LegalH2>
    <LegalP>
      You may stop using the Service and request account deletion at any
      time (see Privacy Policy for how). We may suspend or terminate an
      account for violating these Terms.
    </LegalP>

    <LegalH2>9. Changes to these Terms</LegalH2>
    <LegalP>
      We'll update the date at the top of this document when these Terms
      change. Continued use of the Service after a change means you accept
      the updated Terms.
    </LegalP>

    <LegalH2>10. Governing law</LegalH2>
    <LegalP>
      These Terms are governed by the laws of Nigeria. Any dispute will be
      subject to the jurisdiction of Nigerian courts, without prejudice to
      any mandatory consumer-protection rights you may have under the law
      of your own country.
    </LegalP>

    <LegalH2>11. Contact</LegalH2>
    <LegalP>
      Questions about these Terms:{" "}
      <LegalStrong>legal@meridiancrewing.com</LegalStrong> (placeholder —
      replace before publishing)
    </LegalP>
  </LegalWrap>
);

export default TermsPage;
