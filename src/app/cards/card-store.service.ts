import { effect, Injectable, signal } from '@angular/core';

import { Card, CardFormValue } from './card.model';
import { VaultService } from '../vault/vault.service';

const seed: Card[] = [
  {
    id: 'card-1',
    type: 'Credit',
    issuer: 'Visa',
    bankName: 'HDFC Bank',
    holderName: 'Asha Patel',
    cardNumber: '4111 1111 1111 1111',
    expiry: '09/29',
    cvv: '123',
    createdAt: '2026-02-06'
  },
  {
    id: 'card-2',
    type: 'Debit',
    issuer: 'Mastercard',
    bankName: 'ICICI Bank',
    holderName: 'Ravi Sharma',
    cardNumber: '5555 2222 3333 4444',
    expiry: '04/28',
    cvv: '456',
    createdAt: '2026-01-20'
  }
];

@Injectable({ providedIn: 'root' })
export class CardStoreService {
  readonly cards = signal<Card[]>([]);
  private passphrase = '';

  constructor(private readonly vault: VaultService) {
    this.loadFromStorage();

    effect(() => {
      if (!this.vault.unlocked()) return;
      const serialized = JSON.stringify(this.cards());
      if (!this.passphrase) return;
      const encrypted = this.vault.encrypt(serialized, this.passphrase);
      localStorage.setItem(this.vault.dataKey, encrypted);
    });
  }

  setPassphrase(passphrase: string) {
    this.passphrase = passphrase;
  }

  clear() {
    this.cards.set([]);
    this.passphrase = '';
    localStorage.removeItem(this.vault.dataKey);
  }

  loadFromStorage() {
    const encrypted = localStorage.getItem(this.vault.dataKey);
    if (!encrypted) {
      this.cards.set(seed);
      return;
    }
    if (!this.passphrase) return;
    const decrypted = this.vault.decrypt(encrypted, this.passphrase);
    if (!decrypted) {
      this.cards.set([]);
      return;
    }
    try {
      const parsed = JSON.parse(decrypted) as Card[];
      this.cards.set(parsed);
    } catch {
      this.cards.set([]);
    }
  }

  add(value: CardFormValue) {
    const next: Card = {
      ...value,
      id: `card-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    this.cards.update((current) => [next, ...current]);
  }

  update(id: string, value: CardFormValue) {
    this.cards.update((current) =>
      current.map((card) => (card.id === id ? { ...card, ...value } : card))
    );
  }

  remove(id: string) {
    this.cards.update((current) => current.filter((card) => card.id !== id));
  }

  byId(id: string) {
    return this.cards().find((card) => card.id === id);
  }

  mask(cardNumber: string) {
    const digits = cardNumber.replace(/\s+/g, '');
    const last4 = digits.slice(-4);
    return `**** **** **** ${last4}`;
  }
}
