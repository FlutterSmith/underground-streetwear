import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <LegalPage eyebrow="returns" title="how returns work." updated="April 2026">
      <h2>The short version</h2>
      <p>
        You have 14 days from the delivery date to request a return on a regular
        piece. The piece must be unworn, unwashed, tags still attached, and in the
        original packaging. Signature and hand-dyed pieces are final sale.
      </p>

      <h2>How to start a return</h2>
      <ul>
        <li>Email <a href="mailto:returns@underground.label">returns@underground.label</a> with your order number.</li>
        <li>We send a return label within 48 hours.</li>
        <li>Drop the parcel at the carrier within 7 days of receiving the label.</li>
      </ul>

      <h2>Refunds</h2>
      <p>
        Once we receive the parcel we inspect it within 3 business days. Approved
        refunds go back to the original payment method and post within 5&ndash;10
        business days, depending on the bank.
      </p>

      <h2>Exchanges</h2>
      <p>
        Wrong size? Email us first. If the size you want is still in stock we hold
        it while your return is in transit.
      </p>

      <h2>Return shipping</h2>
      <p>
        Domestic returns are free. International returns are at the buyer&apos;s
        expense unless the item arrived damaged or we shipped the wrong piece.
      </p>

      <h2>Not eligible for return</h2>
      <ul>
        <li>Signature and hand-dyed pieces.</li>
        <li>Masks and balaclavas (hygiene).</li>
        <li>Anything that has been worn, washed, or altered.</li>
        <li>Pre-orders more than 30 days after delivery.</li>
      </ul>
    </LegalPage>
  );
}
