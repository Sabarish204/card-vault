import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { CardFormComponent } from './card-form.component';
import { CardStoreService } from './card-store.service';
import { CardFormValue } from './card.model';

@Component({
  selector: 'app-card-edit',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, CardFormComponent],
  template: `
    @if (cardId) {
      <app-card-form
        title="Edit Card"
        submitLabel="Update Card"
        [initial]="initial"
        (save)="handleSave($event)"
      ></app-card-form>
    } @else {
      <p-card class="surface-card">
        <p>Card not found.</p>
        <p-button
          label="Back to list"
          icon="pi pi-arrow-left"
          severity="secondary"
          (onClick)="router.navigate(['/cards'])"
        ></p-button>
      </p-card>
    }
  `
})
export class CardEditComponent {
  cardId?: string;
  initial?: CardFormValue;

  constructor(
    private readonly store: CardStoreService,
    private readonly route: ActivatedRoute,
    public readonly router: Router
  ) {
    this.cardId = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (this.cardId) {
      const card = this.store.byId(this.cardId);
      if (card) {
        this.initial = {
          type: card.type,
          issuer: card.issuer,
          bankName: card.bankName,
          holderName: card.holderName,
          cardNumber: card.cardNumber,
          expiry: card.expiry,
          cvv: card.cvv
        };
      } else {
        this.cardId = undefined;
      }
    }
  }

  handleSave(value: CardFormValue) {
    if (!this.cardId) return;
    this.store.update(this.cardId, value);
    this.router.navigate(['/cards', this.cardId]);
  }
}
