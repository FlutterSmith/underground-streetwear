import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="privacy" title="what we collect, why." updated="April 2026">
      <h2>What we collect</h2>
      <ul>
        <li>
          Order info: name, shipping address, email, phone, and the items you
          bought. We need this to ship.
        </li>
        <li>
          Payment info: handled by our payment processor. We do not see or store
          your card number.
        </li>
        <li>
          Site analytics: aggregated, non-identifying page visits and device type.
          No cross-site tracking.
        </li>
        <li>
          Newsletter: email address, plus whether you opened the last few sends.
        </li>
      </ul>

      <h2>What we do not do</h2>
      <ul>
        <li>Sell your data. Ever.</li>
        <li>Share your email with third-party marketers.</li>
        <li>Use cross-site tracking pixels.</li>
      </ul>

      <h2>Who sees your data</h2>
      <ul>
        <li>Our shipping courier, so your order arrives.</li>
        <li>Our payment processor, so you can pay.</li>
        <li>Our email provider, so we can send order confirmations.</li>
      </ul>
      <p>
        That is it. No ad networks, no data brokers.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us to export or delete your data at any time. Email{" "}
        <a href="mailto:privacy@underground.label">privacy@underground.label</a>{" "}
        and we will action it within 30 days.
      </p>

      <h2>Cookies</h2>
      <p>
        We use strictly necessary cookies (cart, session) and a single analytics
        cookie that respects Do Not Track. No marketing cookies.
      </p>
    </LegalPage>
  );
}
