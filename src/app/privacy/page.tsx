import { LegalPage } from "@/components/LegalPage";
import { LegalSection } from "@/components/LegalSection";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="privacy" title="what we collect, why." updated="April 2026">
      <LegalSection title="What we collect" defaultOpen>
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
      </LegalSection>

      <LegalSection title="What we do not do">
        <ul>
          <li>Sell your data. Ever.</li>
          <li>Share your email with third-party marketers.</li>
          <li>Use cross-site tracking pixels.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Who sees your data">
        <ul>
          <li>Our shipping courier, so your order arrives.</li>
          <li>Our payment processor, so you can pay.</li>
          <li>Our email provider, so we can send order confirmations.</li>
        </ul>
        <p>
          That is it. No ad networks, no data brokers.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          You can ask us to export or delete your data at any time. Email{" "}
          <a href="mailto:privacy@underground.label">privacy@underground.label</a>{" "}
          and we will action it within 30 days.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We use strictly necessary cookies (cart, session) and a single analytics
          cookie that respects Do Not Track. No marketing cookies.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
