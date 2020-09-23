import Stripe from 'stripe';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class StripeCardBillingAddress implements Stripe.Address {
  @Field()
  city: string;
  @Field()
  country: string;
  @Field()
  line1: string;
  @Field()
  line2: string;
  @Field()
  postal_code: string;
  @Field()
  state: string;
}
@ObjectType()
class StripeCardBillingDetails implements Stripe.PaymentMethod.BillingDetails {
  @Field()
  address: StripeCardBillingAddress;
  @Field()
  email: string;
  @Field()
  name: string;
  @Field()
  phone: string;
}
@ObjectType()
class StripeCardThreeDSecureUsage implements Stripe.PaymentMethod.Card.ThreeDSecureUsage {
  @Field()
  supported: boolean;
}
@ObjectType()
class StripeCardNetworks implements Stripe.PaymentMethod.Card.Networks {
  @Field(() => [String])
  available: string[];
  @Field()
  preferred: string;
}

@ObjectType()
class StripeCard implements Stripe.PaymentMethod.Card {
  @Field()
  brand: string;
  checks: Stripe.PaymentMethod.Card.Checks;
  @Field()
  country: string;
  @Field()
  description?: string;
  @Field()
  exp_month: number;
  @Field()
  exp_year: number;
  @Field()
  fingerprint?: string;
  @Field()
  funding: string;
  @Field()
  iin?: string;
  @Field()
  issuer?: string;
  @Field()
  last4: string;
  @Field()
  networks: StripeCardNetworks;
  @Field()
  three_d_secure_usage: StripeCardThreeDSecureUsage;

  // Not used
  wallet: Stripe.PaymentMethod.Card.Wallet;
}

@ObjectType()
export class PaymentMethod implements Partial<Stripe.PaymentMethod> {
  @Field()
  id: string;

  @Field()
  billing_details: StripeCardBillingDetails;
  @Field()
  card?: StripeCard;

  @Field()
  created: number;
  @Field()
  customer: string;
  @Field()
  livemode: boolean;

  metadata: Stripe.Metadata;

  // Not used
  type: Stripe.PaymentMethod.Type;
}
