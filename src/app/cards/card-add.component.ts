import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CardFormComponent } from './card-form.component';
import { CardStoreService } from './card-store.service';
import { CardFormValue } from './card.model';

@Component({
  selector: 'app-card-add',
  standalone: true,
  imports: [CardFormComponent],
  template: `
    <app-card-form
      title="Add New Card"
      submitLabel="Save Card"
      (save)="handleSave($event)"
    ></app-card-form>
  `
})
export class CardAddComponent {
  constructor(
    private readonly store: CardStoreService,
    private readonly router: Router
  ) {}

  handleSave(value: CardFormValue) {
    this.store.add(value);
    this.router.navigate(['/cards']);
  }
}
