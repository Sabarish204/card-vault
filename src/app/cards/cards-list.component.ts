import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

import { Card } from './card.model';
import { CardStoreService } from './card-store.service';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, CardModule, DividerModule, TagModule],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.css'
})
export class CardsListComponent {
  copiedId?: string;

  constructor(
    public readonly store: CardStoreService,
    private readonly confirmation: ConfirmationService
  ) {}

  get storageEstimate() {
    const cards = this.store.cards();
    if (cards.length === 0) {
      return { perCardBytes: 0, approxMax: 0 };
    }
    const totalBytes = JSON.stringify(cards).length;
    const perCardBytes = Math.max(1, Math.round(totalBytes / cards.length));
    const approxMax = Math.round((5 * 1024 * 1024) / perCardBytes);
    return { perCardBytes, approxMax };
  }

  copyNumber(card: Card) {
    this.copyToClipboard(card.cardNumber).then((ok) => {
      if (!ok) return;
      this.copiedId = card.id;
      setTimeout(() => {
        if (this.copiedId === card.id) this.copiedId = undefined;
      }, 1500);
    });
  }

  confirmDelete(card: Card) {
    this.confirmation.confirm({
      header: 'Delete Card',
      message: `Remove ${card.bankName} card ending ${card.cardNumber.slice(-4)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.store.remove(card.id)
    });
  }

  private async copyToClipboard(value: string) {
    const ok = this.execCommandCopy(value);
    if (ok) return true;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  private execCommandCopy(value: string) {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  }
}
