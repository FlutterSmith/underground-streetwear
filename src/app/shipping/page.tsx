import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <LegalPage eyebrow="shipping" title="how we ship." updated="April 2026">
      <h2>Processing</h2>
      <p>
        Orders are cut and packed within 3&ndash;5 business days. Signature and
        hand-dyed pieces may take up to 10 business days. If something ships faster,
        we will send the tracking the same day.
      </p>

      <h2>Domestic (Egypt)</h2>
      <ul>
        <li>Standard: 2&ndash;4 business days after ship date. Flat LE 80.</li>
        <li>Express: 1&ndash;2 business days. LE 160.</li>
        <li>Free standard on orders over LE 3,000.</li>
      </ul>

      <h2>International</h2>
      <ul>
        <li>MENA region: 5&ndash;9 business days. Quoted at checkout.</li>
        <li>Rest of world: 8&ndash;18 business days. DHL only.</li>
        <li>Customs and import duties are the buyer&apos;s responsibility.</li>
      </ul>

      <h2>Tracking</h2>
      <p>
        You&apos;ll get a tracking link by email once the parcel leaves our warehouse.
        If it has been more than 5 business days and you have not received it,
        write to <a href="mailto:hello@underground.label">hello@underground.label</a>.
      </p>

      <h2>Lost or damaged parcels</h2>
      <p>
        If the courier marks the parcel as delivered but it did not arrive,
        file a claim within 7 days. We will work with the carrier and replace or
        refund once the claim clears.
      </p>
    </LegalPage>
  );
}
