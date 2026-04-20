import { LegalPage } from "@/components/LegalPage";
import { LegalSection } from "@/components/LegalSection";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage eyebrow="terms" title="the fine print." updated="April 2026">
      <LegalSection title="Using this site" defaultOpen>
        <p>
          By browsing or buying from this site you agree to these terms. If you do
          not, do not use the site.
        </p>
      </LegalSection>

      <LegalSection title="Orders and pricing">
        <ul>
          <li>Prices are in Egyptian Pound (EGP) unless noted.</li>
          <li>
            We reserve the right to refuse or cancel an order if a listing was
            mispriced or stock was miscounted. You will get a full refund.
          </li>
          <li>Promotions and discounts are not stackable unless we say so.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Pre-orders">
        <p>
          Pre-order pieces are reserved in the order received. Expected ship date is
          listed on the product page and may shift by up to 30 days. If the delay is
          longer we offer a full refund.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          All artwork, graphics, product names, and photography on this site are the
          property of the brand. You may not copy, resell, or reproduce them without
          written permission.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          We are liable for the product you bought and nothing more. We are not
          responsible for damages arising from use, misuse, or inability to use the
          product, to the extent allowed by law.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws of the Arab Republic of Egypt.
          Disputes are handled in Cairo courts.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We can update these terms. The date at the top shows the latest revision.
          Keep using the site after changes means you accept them.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
