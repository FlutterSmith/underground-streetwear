import { LegalPage } from "@/components/LegalPage";
import { LegalSection } from "@/components/LegalSection";

export const metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <LegalPage eyebrow="returns" title="how returns work." updated="April 2026">
      <LegalSection title="The short version" defaultOpen>
        <p>
          You have 14 days from the delivery date to request a return on a regular
          piece. The piece must be unworn, unwashed, tags still attached, and in the
          original packaging. Signature and hand-dyed pieces are final sale.
        </p>
      </LegalSection>

      <LegalSection title="How to start a return">
        <ul>
          <li>Email <a href="mailto:returns@underground.label">returns@underground.label</a> with your order number.</li>
          <li>We send a return label within 48 hours.</li>
          <li>Drop the parcel at the carrier within 7 days of receiving the label.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Refunds">
        <p>
          Once we receive the parcel we inspect it within 3 business days. Approved
          refunds go back to the original payment method and post within 5&ndash;10
          business days, depending on the bank.
        </p>
      </LegalSection>

      <LegalSection title="Exchanges">
        <p>
          Wrong size? Email us first. If the size you want is still in stock we hold
          it while your return is in transit.
        </p>
      </LegalSection>

      <LegalSection title="Return shipping">
        <p>
          Domestic returns are free. International returns are at the buyer&apos;s
          expense unless the item arrived damaged or we shipped the wrong piece.
        </p>
      </LegalSection>

      <LegalSection title="Not eligible for return">
        <ul>
          <li>Signature and hand-dyed pieces.</li>
          <li>Masks and balaclavas (hygiene).</li>
          <li>Anything that has been worn, washed, or altered.</li>
          <li>Pre-orders more than 30 days after delivery.</li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}
