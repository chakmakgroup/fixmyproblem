export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  currencySymbol: string;
}

export const SINGLE_LETTER_PRICE_ID = 'price_1TC9f0Ca47DJvdbskNrMOAtE';
export const MEMBERSHIP_PRICE_ID = 'price_1TCMembershipMonthly';

export const stripeProducts: StripeProduct[] = [
  {
    priceId: SINGLE_LETTER_PRICE_ID,
    name: 'Single Letter Unlock',
    description: 'Unlock your full professionally written complaint letter. One-time payment. No account required.',
    mode: 'payment',
    price: 10,
    currency: 'gbp',
    currencySymbol: '£',
  },
  {
    priceId: MEMBERSHIP_PRICE_ID,
    name: 'Case Membership',
    description: 'Ongoing help for active complaints and disputes. Up to 2 cases, 5 letters per month, escalation support, reply analysis, and full dashboard access.',
    mode: 'subscription',
    price: 29.99,
    currency: 'gbp',
    currencySymbol: '£',
  },
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export const singleLetterProduct = stripeProducts[0];
export const membershipProduct = stripeProducts[1];
