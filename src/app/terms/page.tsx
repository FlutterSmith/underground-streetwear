import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage eyebrow="terms" title="the fine print." updated="April 2026">
      <h2>Using this site</h2>
      <p>
        By browsing or buying from this site you agree to these terms. If you do
        not, do not use the site.
      </p>

      <h2>Orders and pricing</h2>
      <ul>
        <li>Prices are in Egyptian Pound (EGP) unless noted.</li>
        <li>
          We reserve the right to refuse or cancel an order if a listing was
          mispriced or stock was miscounted. You will get a full refund.
        </li>
        <li>Promotions and discounts are not stackable unless we say so.</li>
      </ul>

      <h2>Pre-orders</h2>
      <p>
        Pre-order pieces are reserved in the order received. Expected ship date is
        listed on the product page and may shift by up to 30 days. If the delay is
        longer we offer a full refund.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All artwork, graphics, product names, and photography on this site are the
        property of the brand. You may not copy, resell, or reproduce them without
        written permission.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        We are liable for the product you bought and nothing more. We are not
        responsible for damages arising from use, misuse, or inability to use the
        product, to the extent allowed by law.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the Arab Republic of Egypt.
        Disputes are handled in Cairo courts.
      </p>

      <h2>Changes</h2>
      <p>
        We can update these terms. The date at the top shows the latest revision.
        Keep using the site after changes means you accept them.
      </p>
    </LegalPage>
  );
}
