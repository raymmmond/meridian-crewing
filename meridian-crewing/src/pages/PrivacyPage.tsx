import React from "react";
import {
  LegalWrap,
  LegalMeta,
  LegalTitle,
  LegalNotice,
  LegalH2,
  LegalP,
  LegalUl,
  LegalTable,
  LegalStrong,
  BackLink,
} from "./LegalLayout";

const PrivacyPage: React.FC = () => (
  <LegalWrap>
    <BackLink href="/">← Back to Meridian Crewing</BackLink>
    <LegalTitle>Privacy Policy</LegalTitle>
    <LegalMeta>Last updated: 16 August 2026</LegalMeta>

    <LegalP>
      This Privacy Policy explains how Meridian Crewing ("we," "us," "the
      platform") collects, uses, stores, and protects your personal data
      when you use meridian-crewing.vercel.app (the "Service").
    </LegalP>
    <LegalP>
      Meridian Crewing is currently operated by an individual based in
      Nigeria, not yet a registered company. This policy will be updated to
      reflect a registered entity if and when one is formed.
    </LegalP>
    <LegalP>
      This policy is written to comply with the Nigeria Data Protection Act,
      2023 ("NDPA"), which applies to us as a Nigeria-based operator and to
      any personal data we process belonging to Nigerian residents,
      regardless of where they access the Service from. Because our users
      are seafarers and shipping companies worldwide, we've also written
      this policy with general international data-protection principles in
      mind — but we do not currently claim formal certification or
      compliance with other specific regimes (such as the EU's GDPR) beyond
      what is stated here.
    </LegalP>

    <LegalNotice>
      <LegalStrong>This document has not been reviewed by a lawyer.</LegalStrong>{" "}
      It's written to accurately describe what the Service actually does.
      If you have concerns about a specific legal requirement, please raise
      it — we'd rather fix a real gap than have a policy that just sounds
      reassuring.
    </LegalNotice>

    <LegalH2>1. What we collect</LegalH2>
    <LegalTable>
      <thead>
        <tr>
          <th>Data</th>
          <th>Why we collect it</th>
          <th>Where it's stored</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Email address, password</td>
          <td>To create and secure your account</td>
          <td>Supabase Auth (password is hashed — we never see or store it in plain text)</td>
        </tr>
        <tr>
          <td>Account role (Seafarer or Employer)</td>
          <td>To show you the right features</td>
          <td>Supabase Auth (user metadata)</td>
        </tr>
        <tr>
          <td>Rank, application details, name, email (submitted with an application)</td>
          <td>To let employers evaluate your application</td>
          <td>Our database (Supabase Postgres)</td>
        </tr>
        <tr>
          <td>Vacancy details you post (as an employer) — role, vessel, contract, wage</td>
          <td>To display open positions to seafarers</td>
          <td>Our database (Supabase Postgres)</td>
        </tr>
        <tr>
          <td>Uploaded documents (certificates, medical records, identity documents)</td>
          <td>To let you share credentials with employers you apply to</td>
          <td>Supabase Storage, in a private bucket — not publicly accessible by URL</td>
        </tr>
        <tr>
          <td>Application status changes</td>
          <td>To let you track where your application stands</td>
          <td>Our database (Supabase Postgres)</td>
        </tr>
      </tbody>
    </LegalTable>
    <LegalP>
      We do not currently collect payment information, location data, or
      use third-party analytics or advertising trackers.
    </LegalP>

    <LegalH2>2. Legal basis for processing</LegalH2>
    <LegalP>
      We process your data because it's necessary to provide the Service
      you've asked to use — matching seafarers with vacancies is the core
      function of the platform, and we can't do that without this
      information. Where we ask for something not strictly necessary, we'll
      ask for your consent separately.
    </LegalP>

    <LegalH2>3. Who can see your data</LegalH2>
    <LegalUl>
      <li>
        <LegalStrong>Your uploaded documents</LegalStrong> are visible only
        to you, and to an employer <LegalStrong>after</LegalStrong> you've
        actually applied to one of their posted positions — never to
        employers in general, and never publicly.
      </li>
      <li>
        <LegalStrong>Application details</LegalStrong> (your name, email,
        rank) are visible to the employer whose position you applied to.
      </li>
      <li>
        <LegalStrong>Posted vacancies</LegalStrong> (role, vessel, wage if
        provided, contract length) are public to anyone browsing the
        Service — that's the point of a vacancy listing.
      </li>
      <li>
        We do not sell your data to third parties, and we do not share it
        with anyone outside the operation of the Service itself.
      </li>
    </LegalUl>

    <LegalH2>4. Where your data lives</LegalH2>
    <LegalP>
      Our infrastructure runs on Supabase (database, authentication, and
      file storage) and is deployed via Render and Vercel. These are
      third-party infrastructure providers; your data may be processed on
      servers outside Nigeria as a result. We choose providers based on
      their own security and privacy practices, but we don't control their
      infrastructure directly.
    </LegalP>

    <LegalH2>5. How long we keep your data</LegalH2>
    <LegalP>
      We keep your account data and uploaded documents for as long as your
      account is active. If you want your account and associated data
      deleted, contact us at the email below — we do not currently have a
      self-service account-deletion feature, so this is handled manually
      for now, which we acknowledge is a limitation we intend to improve.
    </LegalP>

    <LegalH2>6. Your rights</LegalH2>
    <LegalP>
      Under the NDPA and as a matter of how we want to operate regardless
      of where you are, you have the right to:
    </LegalP>
    <LegalUl>
      <li>Know what data we hold about you</li>
      <li>Correct inaccurate data</li>
      <li>Request deletion of your data</li>
      <li>Withdraw consent where processing is based on consent</li>
      <li>Ask us questions about how your data is used</li>
    </LegalUl>
    <LegalP>
      To exercise any of these, email{" "}
      <LegalStrong>privacy@meridiancrewing.com</LegalStrong> (placeholder —
      replace with a real monitored address before this policy goes live).
    </LegalP>

    <LegalH2>7. Security</LegalH2>
    <LegalUl>
      <li>
        Passwords are hashed by Supabase Auth — we never store or see them
        in plain text.
      </li>
      <li>
        Uploaded documents live in a private storage bucket; access
        requires a short-lived signed link generated specifically for an
        authorized viewer, not a permanent public URL.
      </li>
      <li>All traffic to the Service is encrypted in transit (HTTPS).</li>
      <li>
        We do not currently have a dedicated security team, formal
        penetration testing, or a certified information security
        management system — this is an early-stage platform, and this
        policy will be updated honestly as that changes.
      </li>
    </LegalUl>

    <LegalH2>8. Data breach notification</LegalH2>
    <LegalP>
      If we become aware of a breach affecting your personal data, we will
      notify affected users and, where required by the NDPA, the Nigeria
      Data Protection Commission, without undue delay.
    </LegalP>

    <LegalH2>9. Children</LegalH2>
    <LegalP>
      The Service is not directed at anyone under 18. We do not knowingly
      collect data from minors.
    </LegalP>

    <LegalH2>10. Changes to this policy</LegalH2>
    <LegalP>
      We'll update the date at the top of this document when this policy
      changes. Material changes affecting how your data is used will be
      communicated directly where practical.
    </LegalP>

    <LegalH2>11. Contact</LegalH2>
    <LegalP>
      Questions about this policy or your data:{" "}
      <LegalStrong>privacy@meridiancrewing.com</LegalStrong> (placeholder —
      replace before publishing)
    </LegalP>
  </LegalWrap>
);

export default PrivacyPage;
