export type CardType = 'Credit' | 'Debit';

export type CardIssuer = 'Visa' | 'Mastercard' | 'Amex' | 'Rupay';

export interface Card {
  id: string;
  type: CardType;
  issuer: CardIssuer;
  bankName: string;
  holderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  createdAt: string;
}

export interface CardFormValue {
  type: CardType;
  issuer: CardIssuer;
  bankName: string;
  holderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}
